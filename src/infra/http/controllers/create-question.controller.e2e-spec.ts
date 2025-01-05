import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Create Question (E2E)", () => {

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

    test("[POST] /questions", async () => {

        const user = await prismaService.user.create({
            data: {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123"
            }
        });
        
        const accessToken = jwtService.sign({sub: user.id});

        const response = await request(app.getHttpServer()).post("/questions")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title : "Question Title",
                content: "Question Content",
            });

        expect(response.statusCode).toBe(201);

        const questionOnDatabase = await prismaService.question.findFirst({
            where:{
                title: "Question Title"
            }
        });

        expect(questionOnDatabase).toBeTruthy();
    });

});