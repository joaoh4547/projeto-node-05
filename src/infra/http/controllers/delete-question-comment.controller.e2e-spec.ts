import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answers";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Delete Question Comments (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let questionCommentFactory: QuestionCommentFactory;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AnswerFactory,
                QuestionCommentFactory,
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        questionCommentFactory = moduleRef.get(QuestionCommentFactory);
        jwtService = moduleRef.get(JwtService);
        await app.init();
    });

    test("[DELETE] /questions/comments/:id", async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const comment = await questionCommentFactory.makePrismaQuestionComment({
            questionId: question.id,
            authorId: user.id,
        });

        const commentId = comment.id.toString();

        const response = await request(app.getHttpServer())
            .delete(`/questions/comments/${commentId}`)
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
