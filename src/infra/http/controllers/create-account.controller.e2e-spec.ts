
import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create Account (E2E)", () => {

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

    test("[POST] /account", async () => {
        const response = await request(app.getHttpServer()).post("/accounts").send({
            name : "John Doe",
            email: "john.doe@example.com",
            password: "password123"
        });

        expect(response.statusCode).toBe(201);
        const userOnDataBase  =  await prismaService.user.findUnique({
            where: {
                email: "john.doe@example.com",
            }
        });

        expect(userOnDataBase).toBeTruthy();
    });

});