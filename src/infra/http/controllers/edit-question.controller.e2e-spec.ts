import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Edit Question (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let attachmentFactory: AttachmentFactory;
    let questionAttachmentFactory: QuestionAttachmentFactory;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AttachmentFactory,
                QuestionAttachmentFactory,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        attachmentFactory = moduleRef.get(AttachmentFactory);
        questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
        jwtService = moduleRef.get(JwtService);
        await app.init();
    });

    test("[PUT] /questions/:id", async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const attachment1 = await attachmentFactory.makePrismaAttachment();
        const attachment2 = await attachmentFactory.makePrismaAttachment();

        await questionAttachmentFactory.makePrismaAttachment({
            attachmentId: attachment1.id,
            questionId: question.id,
        });
        await questionAttachmentFactory.makePrismaAttachment({
            attachmentId: attachment2.id,
            questionId: question.id,
        });

        const attachment3 = await attachmentFactory.makePrismaAttachment();

        const questionId = question.id.toString();
        const response = await request(app.getHttpServer())
            .put(`/questions/${questionId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "New Title",
                content: "New Content",
                attachments: [
                    attachment1.id.toString(),
                    attachment3.id.toString(),
                ],
            });

        expect(response.statusCode).toBe(204);

        const questionOnDatabase = await prismaService.question.findFirst({
            where: {
                title: "New Title",
                content: "New Content",
            },
        });

        expect(questionOnDatabase).toBeTruthy();
        const attachmentsOnDatabase = await prismaService.attachment.findMany({
            where: {
                questionId: questionOnDatabase?.id,
            },
        });

        expect(attachmentsOnDatabase).toHaveLength(2);
        expect(attachmentsOnDatabase).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: attachment1.id.toString(),
                }),
                expect.objectContaining({
                    id: attachment3.id.toString(),
                }),
            ]),
        );
    });
});
