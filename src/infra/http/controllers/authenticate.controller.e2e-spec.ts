
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";

describe("Authenticate User (E2E)", () => {

    let app: INestApplication;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get(PrismaService);
        await app.init();
    });

    test("[POST] /sessions", async () => {
        await prismaService.user.create({
            data: {
                name: "John Doe",
                email: "john.doe@example.com",
                password: await hash("password123", 8)
            }
        });

        const response = await request(app.getHttpServer()).post("/sessions").send({
            email: "john.doe@example.com",
            password: "password123"
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            access_token: expect.any(String)
        });
    });

});