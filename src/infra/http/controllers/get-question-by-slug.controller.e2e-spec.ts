import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Get Question By Slug (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory],
        }).compile();

        app = moduleRef.createNestApplication();
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
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

        await questionFactory.makePrismaQuestion({
            title: "Question Title 01",
            slug: Slug.create("question-01"),
            authorId: user.id,
        });

        const response = await request(app.getHttpServer())
            .get("/questions/question-01")
            .set("Authorization", `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            question: expect.objectContaining({ title: "Question Title 01" }),
        });
    });
});
