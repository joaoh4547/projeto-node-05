import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import {
    Question as PrismaQuestion,
    User as PrismaAuthor,
    Attachment as PrismaAttachment,
} from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaQuestionDetails = PrismaQuestion & {
    author: PrismaAuthor;
    attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
    static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
        const questionDetails = QuestionDetails.create({
            questionId: new UniqueEntityId(raw.id),
            authorId: new UniqueEntityId(raw.authorId),
            authorName: raw.author.name,
            content: raw.content,
            title: raw.title,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            slug: Slug.create(raw.slug),
            attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
            bestAnswerId: raw.bestAnswerId
                ? new UniqueEntityId(raw.bestAnswerId)
                : null,
        });
        return questionDetails;
    }
}
