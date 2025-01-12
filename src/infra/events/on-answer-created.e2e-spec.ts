import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";
import { waitFor } from "test/utils/wait-for";

describe("On Answer Created (E2E)", () => {
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

    it("should send a notification when answer is created", async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const questionId = question.id.toString();

        await request(app.getHttpServer())
            .post(`/questions/${questionId}/answers`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                content: "New Answer",
                attachments: [],
            });

        await waitFor(async () => {
            const notificationOnDatabase =
                await prismaService.notification.findFirst({
                    where: {
                        recipientId: user.id.toString(),
                    },
                });
            expect(notificationOnDatabase).toBeTruthy();
        });
    });
});
