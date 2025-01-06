import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerAttachmentList } from "@/domain/forum/enterprise/entities/answer-attachment-list";
import { Prisma, Answer as PrismaAnswer } from "@prisma/client";

export class PrismaAnswerMapper {
    static toDomain(raw: PrismaAnswer) {
        return Answer.create(
            {
                content: raw.content,
                authorId: new UniqueEntityId(raw.authorId),
                attachments: new AnswerAttachmentList(),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
                questionId: new UniqueEntityId(raw.questionId),
            },
            new UniqueEntityId(raw.id),
        );
    }

    static toPersistence(answer: Answer): Prisma.AnswerUncheckedCreateInput {
        return {
            id: answer.id.toString(),
            content: answer.content,
            authorId: answer.authorId.toValue(),
            createdAt: answer.createdAt,
            updatedAt: answer.updatedAt,
            questionId: answer.questionId.toValue(),
        };
    }
}
