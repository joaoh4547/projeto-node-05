import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Get Question By Slug (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let attachmentFactory: AttachmentFactory;
    let questionAttachmentFactory: QuestionAttachmentFactory;
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
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        attachmentFactory = moduleRef.get(AttachmentFactory);
        questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
        jwtService = moduleRef.get(JwtService);
        await app.init();
    });

    test("[GET] /questions:/slug", async () => {
        const user = await studentFactory.makePrismaStudent({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password123",
        });

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            title: "Question Title 01",
            slug: Slug.create("question-01"),
            authorId: user.id,
        });

        const attachment = await attachmentFactory.makePrismaAttachment({
            title: "Attachment Title 01",
        });

        await questionAttachmentFactory.makePrismaAttachment({
            attachmentId: attachment.id,
            questionId: question.id,
        });

        const response = await request(app.getHttpServer())
            .get("/questions/question-01")
            .set("Authorization", `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            question: expect.objectContaining({
                title: "Question Title 01",
                authorName: "John Doe",
                attachments: [
                    expect.objectContaining({
                        title: "Attachment Title 01",
                    }),
                ],
            }),
        });
    });
});
