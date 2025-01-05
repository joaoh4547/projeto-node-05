import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository
    implements NotificationsRepository
{
    notifications: Notification[] = [];

    async create(notification: Notification): Promise<void> {
        this.notifications.push(notification);
    }

    async findById(id: string) {
        return (
            this.notifications.find(
                (notification) => notification.id.toString() === id,
            ) || null
        );
    }

    async save(notification: Notification) {
        const index = this.notifications.findIndex(
            (n) => n.id.toValue() === notification.id.toValue(),
        );
        this.notifications[index] = notification;
    }
}
