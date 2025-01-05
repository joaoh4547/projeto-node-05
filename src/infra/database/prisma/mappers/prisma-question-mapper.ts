import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionAttachmentList } from "@/domain/forum/enterprise/entities/question-attachment-list";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { Prisma, Question as PrismaQuestion } from "@prisma/client";

export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion) {
        return Question.create(
            {
                title: raw.title,
                content: raw.content,
                authorId: new UniqueEntityId(raw.authorId),
                bestAnswerId: raw.bestAnswerId
                    ? new UniqueEntityId(raw.bestAnswerId)
                    : null,
                slug: Slug.create(raw.slug),
                attachments: new QuestionAttachmentList(),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityId(raw.id),
        );
    }

    static toPersistence(
        question: Question,
    ): Prisma.QuestionUncheckedCreateInput {
        return {
            id: question.id.toString(),
            title: question.title,
            content: question.content,
            authorId: question.authorId.toValue(),
            bestAnswerId: question.bestAnswerId?.toValue(),
            slug: question.slug.value,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        };
    }
}
