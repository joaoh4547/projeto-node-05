import { ValueObject } from "@/core/entities/value-object";
import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Slug } from "./slug";
import { Attachment } from "../attachment";

interface QuestionDetailsProps {
    questionId: UniqueEntityId;
    authorId: UniqueEntityId;
    authorName: string;
    title: string;
    content: string;
    slug: Slug;
    attachments: Attachment[];
    bestAnswerId?: UniqueEntityId | null;
    createdAt: Date;
    updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
    get questionId() {
        return this.props.questionId;
    }

    get content() {
        return this.props.content;
    }

    get title() {
        return this.props.title;
    }

    get slug() {
        return this.props.slug;
    }

    get attachments() {
        return this.props.attachments;
    }

    get bestAnswerId() {
        return this.props.bestAnswerId;
    }

    get authorId() {
        return this.props.authorId;
    }

    get authorName() {
        return this.props.authorName;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(props: QuestionDetailsProps) {
        return new QuestionDetails(props);
    }
}
