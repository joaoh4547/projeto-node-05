import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { PrismaService } from "../prisma.service";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
    constructor(private readonly prismaService: PrismaService) {}
    async create(notification: Notification) {
        const data = PrismaNotificationMapper.toPersistence(notification);
        await this.prismaService.notification.create({ data });
    }

    async findById(id: string) {
        const notification = await this.prismaService.notification.findUnique({
            where: { id },
        });

        if (!notification) {
            return null;
        }

        return PrismaNotificationMapper.toDomain(notification);
    }

    async save(notification: Notification) {
        const data = PrismaNotificationMapper.toPersistence(notification);
        await this.prismaService.notification.update({
            where: {
                id: data.id,
            },
            data,
        });
    }
}
