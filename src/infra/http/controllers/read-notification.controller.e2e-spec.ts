import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/prisma/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { NotificationFactory } from "test/factories/make-notification";
import { StudentFactory } from "test/factories/make-student";

describe("Read Notification (E2E)", () => {
    let app: INestApplication;
    let studentFactory: StudentFactory;
    let notificationFactory: NotificationFactory;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, NotificationFactory, PrismaService],
        }).compile();

        app = moduleRef.createNestApplication();
        prismaService = moduleRef.get(PrismaService);
        studentFactory = moduleRef.get(StudentFactory);
        notificationFactory = moduleRef.get(NotificationFactory);
        jwtService = moduleRef.get(JwtService);
        await app.init();
    });

    test("[GET] /notifications/:notificationId/read", async () => {
        const user = await studentFactory.makePrismaStudent({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password123",
        });

        const accessToken = jwtService.sign({ sub: user.id.toString() });

        const notification = await notificationFactory.makePrismaNotification({
            recipientId: user.id,
        });
        const notificationId = notification.id.toString();
        const response = await request(app.getHttpServer())
            .patch(`/notifications/${notificationId}/read`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(204);
        const notificationOnDatabase =
            await prismaService.notification.findFirst({
                where: {
                    recipientId: user.id.toString(),
                },
            });

        expect(notificationOnDatabase?.readAt).not.toBeNull();
    });
});
