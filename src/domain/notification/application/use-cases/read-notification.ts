import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { Injectable } from "@nestjs/common";

export interface ReadNotificationUseCaseInputParams {
    recipientId: string;
    notificationId: string;
}

export type ReadNotificationUseCaseResult = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        notification: Notification;
    }
>;

@Injectable()
export class ReadNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) {}

    async handle({
        recipientId,
        notificationId,
    }: ReadNotificationUseCaseInputParams): Promise<ReadNotificationUseCaseResult> {
        const notification =
            await this.notificationsRepository.findById(notificationId);

        if (!notification) {
            return left(new ResourceNotFoundError());
        }
        if (recipientId !== notification.recipientId.toString()) {
            return left(new NotAllowedError());
        }

        notification.read();
        await this.notificationsRepository.save(notification);
        return right({ notification });
    }
}
