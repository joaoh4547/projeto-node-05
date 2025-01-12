import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AppModule } from "@/infra/app.module";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Prisma Questions Repository (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let attachmentFactory: AttachmentFactory;
    let questionAttachmentFactory: QuestionAttachmentFactory;
    let questionsRepository: QuestionsRepository;
    let cacheRepository: CacheRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule, CacheModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AttachmentFactory,
                QuestionAttachmentFactory,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        attachmentFactory = moduleRef.get(AttachmentFactory);
        questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
        cacheRepository = moduleRef.get(CacheRepository);
        questionsRepository = moduleRef.get(QuestionsRepository);
        await app.init();
    });

    it("should cache question details", async () => {
        const user = await studentFactory.makePrismaStudent();

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const attachment = await attachmentFactory.makePrismaAttachment({});

        await questionAttachmentFactory.makePrismaAttachment({
            attachmentId: attachment.id,
            questionId: question.id,
        });

        const slug = question.slug.value;

        const questionDetails =
            await questionsRepository.findBySlugWithDetails(slug);

        const cached = await cacheRepository.get(`question:${slug}:details`);

        if (!cached) {
            throw new Error();
        }

        expect(JSON.parse(cached)).toEqual(
            expect.objectContaining({
                id: questionDetails?.questionId.toString(),
            }),
        );
    });

    it("should return cached details on subsequent calls", async () => {
        const user = await studentFactory.makePrismaStudent();

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const attachment = await attachmentFactory.makePrismaAttachment({});

        await questionAttachmentFactory.makePrismaAttachment({
            attachmentId: attachment.id,
            questionId: question.id,
        });

        const slug = question.slug.value;

        const cacheKey = `question:${slug}:details`;

        let cached = await cacheRepository.get(cacheKey);
        expect(cached).toBeNull();
        await questionsRepository.findBySlugWithDetails(slug);

        cached = await cacheRepository.get(cacheKey);
        expect(cached).not.toBeNull();

        if (!cached) {
            throw new Error();
        }

        const questionDetails =
            await questionsRepository.findBySlugWithDetails(slug);

        expect(JSON.parse(cached)).toEqual(
            expect.objectContaining({
                id: questionDetails?.questionId.toString(),
            }),
        );
    });

    it("should reset question details cache when saving the question", async () => {
        const user = await studentFactory.makePrismaStudent();

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const attachment = await attachmentFactory.makePrismaAttachment({});

        await questionAttachmentFactory.makePrismaAttachment({
            attachmentId: attachment.id,
            questionId: question.id,
        });

        const slug = question.slug.value;

        const cacheKey = `question:${slug}:details`;

        await cacheRepository.set(cacheKey, JSON.stringify({ empty: true }));

        await questionsRepository.save(question);

        const cached = await cacheRepository.get(cacheKey);

        expect(cached).toBeNull();
    });
});
