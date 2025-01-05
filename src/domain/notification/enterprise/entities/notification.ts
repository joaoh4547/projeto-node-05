import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface NotificationProps {
    title: string;
    content: string;
    createdAt: Date;
    readAt?: Date;
    recipientId: UniqueEntityId;
}

export class Notification extends Entity<NotificationProps> {
    get title() {
        return this.props.title;
    }

    get content() {
        return this.props.content;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get readAt() {
        return this.props.readAt;
    }

    read() {
        this.props.readAt = new Date();
    }

    get recipientId() {
        return this.props.recipientId;
    }

    static create(
        props: Optional<NotificationProps, "createdAt">,
        id?: UniqueEntityId,
    ) {
        const notification = new Notification(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        );
        return notification;
    }
}
