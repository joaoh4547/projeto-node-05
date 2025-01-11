import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment";
import { AnswerFactory } from "test/factories/make-answers";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Edit Answer (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let prismaService: PrismaService;
    let answerFactory: AnswerFactory;
    let attachmentFactory: AttachmentFactory;
    let answerAttachmentFactory: AnswerAttachmentFactory;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AnswerFactory,
                AttachmentFactory,
                AnswerAttachmentFactory,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        answerFactory = moduleRef.get(AnswerFactory);
        attachmentFactory = moduleRef.get(AttachmentFactory);
        answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
        jwtService = moduleRef.get(JwtService);
        await app.init();
    });

    test("[PUT] /answers/:id", async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id,
        });

        const attachment1 = await attachmentFactory.makePrismaAttachment();
        const attachment2 = await attachmentFactory.makePrismaAttachment();
        const attachment3 = await attachmentFactory.makePrismaAttachment();

        await answerAttachmentFactory.makePrismaAttachment({
            attachmentId: attachment1.id,
            answerId: answer.id,
        });

        await answerAttachmentFactory.makePrismaAttachment({
            attachmentId: attachment2.id,
            answerId: answer.id,
        });

        const answerId = answer.id.toString();

        const response = await request(app.getHttpServer())
            .put(`/answers/${answerId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                content: "New Answer Answer",
                attachments: [
                    attachment1.id.toString(),
                    attachment3.id.toString(),
                ],
            });

        expect(response.statusCode).toBe(204);

        const answerOnDatabase = await prismaService.answer.findFirst({
            where: {
                content: "New Answer Answer",
            },
        });

        expect(answerOnDatabase).toBeTruthy();

        const attachmentsOnDatabase = await prismaService.attachment.findMany({
            where: {
                answerId: answerOnDatabase?.id,
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
