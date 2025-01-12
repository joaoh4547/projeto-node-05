import { Either, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { Injectable } from "@nestjs/common";

export interface SendNotificationUseCaseInputParams {
    recipientId: string;
    title: string;
    content: string;
}

export type SendNotificationUseCaseResult = Either<
    null,
    {
        notification: Notification;
    }
>;

@Injectable()
export class SendNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) {}

    async handle({
        recipientId,
        content,
        title,
    }: SendNotificationUseCaseInputParams): Promise<SendNotificationUseCaseResult> {
        const notification = Notification.create({
            recipientId: new UniqueEntityId(recipientId),
            content,
            title,
        });
        await this.notificationsRepository.create(notification);
        return right({ notification });
    }
}
