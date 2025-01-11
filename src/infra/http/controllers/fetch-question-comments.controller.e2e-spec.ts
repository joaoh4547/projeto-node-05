import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch Question Answers (E2E)", () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let questionCommentFactory: QuestionCommentFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                QuestionCommentFactory,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        jwtService = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        questionCommentFactory = moduleRef.get(QuestionCommentFactory);
        await app.init();
    });

    test("[GET] /questions/:questionId/comments", async () => {
        const user = await studentFactory.makePrismaStudent({
            name: "John Doe",
        });

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        await Promise.all([
            questionCommentFactory.makePrismaQuestionComment({
                questionId: question.id,
                authorId: user.id,
                content: "Question Comment 01",
            }),
            questionCommentFactory.makePrismaQuestionComment({
                questionId: question.id,
                authorId: user.id,
                content: "Question Comment 02",
            }),
        ]);

        const questionId = question.id.toString();

        const response = await request(app.getHttpServer())
            .get(`/questions/${questionId}/comments`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            comments: expect.arrayContaining([
                expect.objectContaining({
                    content: "Question Comment 01",
                    authorName: "John Doe",
                }),
                expect.objectContaining({
                    content: "Question Comment 02",
                    authorName: "John Doe",
                }),
            ]),
        });
    });
});
