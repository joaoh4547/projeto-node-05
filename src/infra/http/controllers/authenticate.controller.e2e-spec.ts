import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

describe("Authenticate User (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory],
        }).compile();

        app = moduleRef.createNestApplication();
        studentFactory = moduleRef.get(StudentFactory);
        await app.init();
    });

    test("[POST] /sessions", async () => {
        await studentFactory.makePrismaStudent({
            name: "John Doe",
            email: "john.doe@example.com",
            password: await hash("password123", 8),
        });

        const response = await request(app.getHttpServer())
            .post("/sessions")
            .send({
                email: "john.doe@example.com",
                password: "password123",
            });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            access_token: expect.any(String),
        });
    });
});
