import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { AnswerFactory } from "test/factories/make-answers";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Delete Answer Comment (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let answerFactory: AnswerFactory;
    let answerCommentFactory: AnswerCommentFactory;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AnswerFactory,
                AnswerCommentFactory,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        answerFactory = moduleRef.get(AnswerFactory);
        answerCommentFactory = moduleRef.get(AnswerCommentFactory);
        jwtService = moduleRef.get(JwtService);
        await app.init();
    });

    test("[DELETE] /answers/comments/:id", async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id,
        });

        const comment = await answerCommentFactory.makePrismaAnswerComment({
            answerId: answer.id,
            authorId: user.id,
        });

        const commentId = comment.id.toString();

        const response = await request(app.getHttpServer())
            .delete(`/answers/comments/${commentId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(204);

        const commentOnDatabase = await prismaService.comment.findUnique({
            where: {
                id: commentId,
            },
        });

        expect(commentOnDatabase).toBeNull();
    });
});
