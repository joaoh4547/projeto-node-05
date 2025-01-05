import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionAttachmentList } from "@/domain/forum/enterprise/entities/question-attachment-list";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Question as PrismaQuestion } from "@prisma/client";

export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion) {
        return Question.create(
            {
                title: raw.title,
                content: raw.content,
                authorId: new UniqueEntityId(raw.authorId),
                bestAnswerId: undefined,
                slug: Slug.create(raw.slug),
                attachments: new QuestionAttachmentList(),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityId(raw.id),
        );
    }
}
