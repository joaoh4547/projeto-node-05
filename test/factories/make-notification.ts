import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import {
    Notification,
    NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeNotification(
    override: Partial<NotificationProps> = {},
    id?: UniqueEntityId,
): Notification {
    const notification = Notification.create(
        {
            recipientId: new UniqueEntityId(),
            title: faker.lorem.sentence(4),
            content: faker.lorem.sentence(),
            ...override,
        },
        id,
    );

    return notification;
}

@Injectable()
export class NotificationFactory {
    constructor(private readonly prismaService: PrismaService) {}

    async makePrismaNotification(
        data: Partial<NotificationProps> = {},
    ): Promise<Notification> {
        const notification = makeNotification(data);
        await this.prismaService.notification.create({
            data: PrismaNotificationMapper.toPersistence(notification),
        });
        return notification;
    }
}
