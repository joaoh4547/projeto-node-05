import { DomainEvents } from "@/core/events/domain-events";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answers";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";
import { waitFor } from "test/utils/wait-for";

describe("On Question Best Answer chosen (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let questionFactory: QuestionFactory;
    let prismaService: PrismaService;
    let answerFactory: AnswerFactory;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AnswerFactory],
        }).compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        questionFactory = moduleRef.get(QuestionFactory);
        answerFactory = moduleRef.get(AnswerFactory);
        jwtService = moduleRef.get(JwtService);

        DomainEvents.shouldRun = true;
        await app.init();
    });

    it("should send notification when question best answer is chosen", async () => {
        const user = await studentFactory.makePrismaStudent();

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        });

        const answer = await answerFactory.makePrismaAnswer({
            questionId: question.id,
            authorId: user.id,
        });

        const answerId = answer.id.toString();

        await request(app.getHttpServer())
            .patch(`/answers/${answerId}/choose-as-best`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send();

        await waitFor(async () => {
            const notificationOnDatabase =
                await prismaService.notification.findFirst({
                    where: {
                        recipientId: user.id.toString(),
                    },
                });

            expect(notificationOnDatabase).not.toBeNull();
        });
    });
});
