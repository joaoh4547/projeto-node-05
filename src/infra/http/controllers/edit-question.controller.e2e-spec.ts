import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Edit Question (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory],
        }).compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        jwtService = moduleRef.get(JwtService);
        await app.init();
    });

    test("[PUT] /questions/:id", async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const questionId = question.id.toString();
        const response = await request(app.getHttpServer())
            .put(`/questions/${questionId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "New Title",
                content: "New Content",
            });

        expect(response.statusCode).toBe(204);

        const questionOnDatabase = await prismaService.question.findFirst({
            where: {
                title: "New Title",
                content: "New Content",
            },
        });

        expect(questionOnDatabase).toBeTruthy();
    });
});