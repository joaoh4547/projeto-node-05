import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Answer Question (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let attachmentFactory: AttachmentFactory;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AttachmentFactory],
        }).compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        attachmentFactory = moduleRef.get(AttachmentFactory);
        jwtService = moduleRef.get(JwtService);
        await app.init();
    });

    test("[POST] /questions/:questionId/answers", async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const questionId = question.id.toString();

        const attachment1 = await attachmentFactory.makePrismaAttachment();
        const attachment2 = await attachmentFactory.makePrismaAttachment();

        const response = await request(app.getHttpServer())
            .post(`/questions/${questionId}/answers`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                content: "New Answer",
                attachments: [
                    attachment1.id.toString(),
                    attachment2.id.toString(),
                ],
            });

        expect(response.statusCode).toBe(201);

        const answerOnDatabase = await prismaService.answer.findFirst({
            where: {
                content: "New Answer",
            },
        });

        expect(answerOnDatabase).toBeTruthy();

        const attachmentsOnDatabase = await prismaService.attachment.findMany({
            where: {
                answerId: answerOnDatabase?.id,
            },
        });

        expect(attachmentsOnDatabase).toHaveLength(2);
    });
});
