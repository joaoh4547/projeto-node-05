import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch Recent Questions (E2E)", () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory],
        }).compile();

        app = moduleRef.createNestApplication();
        jwtService = moduleRef.get(JwtService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        await app.init();
    });

    test("[GET] /questions", async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        await Promise.all([
            questionFactory.makePrismaQuestion({
                authorId: user.id,
                title: "Question Title 01",
            }),
            questionFactory.makePrismaQuestion({
                authorId: user.id,
                title: "Question Title 02",
            }),
        ]);

        const response = await request(app.getHttpServer())
            .get("/questions")
            .set("Authorization", `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            questions: [
                expect.objectContaining({ title: "Question Title 02" }),
                expect.objectContaining({ title: "Question Title 01" }),
            ],
        });
    });
});
