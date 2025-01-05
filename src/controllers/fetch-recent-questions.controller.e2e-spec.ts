import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Fetch Recent Questions (E2E)", () => {

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

    test("[GET] /questions", async () => {

        const user = await prismaService.user.create({
            data: {
                name: "John Doe",
                email: "john.doe@example.com",
                password: "password123"
            }
        });
        
        const accessToken = jwtService.sign({sub: user.id});

        await prismaService.question.createMany({
            data:[
                {
                    title : "Question Title 01",
                    content: "Question Content 01",
                    slug: "question-01",
                    authorId: user.id
                },
                {
                    title : "Question Title 02",
                    content: "Question Content 02",
                    slug: "question-02",
                    authorId: user.id
                },

                {
                    title : "Question Title 03",
                    content: "Question Content 03",
                    slug: "question-03",
                    authorId: user.id
                },
                {
                    title : "Question Title 04",
                    content: "Question Content 04",
                    slug: "question-04",
                    authorId: user.id
                },
                {
                    title : "Question Title 05",
                    content: "Question Content 05",
                    slug: "question-05",
                    authorId: user.id
                }
            ]
        });

        const response = await request(app.getHttpServer()).get("/questions")
            .set("Authorization", `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            questions:[
                expect.objectContaining({title: "Question Title 01"}),
                expect.objectContaining({title: "Question Title 02"}),
                expect.objectContaining({title: "Question Title 03"}),
                expect.objectContaining({title: "Question Title 04"}),
                expect.objectContaining({title: "Question Title 05"}),
            ]
        });
    });

});