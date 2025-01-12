import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Prisma, Notification as PrismaNotification } from "@prisma/client";

export class PrismaNotificationMapper {
    static toDomain(raw: PrismaNotification) {
        return Notification.create(
            {
                title: raw.title,
                content: raw.content,
                recipientId: new UniqueEntityId(raw.recipientId),
                createdAt: raw.createdAt,
                readAt: raw.readAt,
            },
            new UniqueEntityId(raw.id),
        );
    }

    static toPersistence(
        notification: Notification,
    ): Prisma.NotificationUncheckedCreateInput {
        return {
            id: notification.id.toString(),
            title: notification.title,
            content: notification.content,
            recipientId: notification.recipientId.toValue(),
            createdAt: notification.createdAt,
            readAt: notification.readAt,
        };
    }
}
