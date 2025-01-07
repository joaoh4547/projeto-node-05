import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Get Question By Slug (E2E)", () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get(PrismaService);
        jwtService = moduleRef.get(JwtService);
        await app.init();
    });

    test("[GET] /questions:/slug", async () => {
        const user = await prismaService.user.create({
            data: {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123",
            },
        });

        const accessToken = jwtService.sign({ sub: user.id });

        await prismaService.question.create({
            data: {
                title: "Question Title 01",
                content: "Question Content 01",
                slug: "question-01",
                authorId: user.id,
            },
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
