import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Prisma, Comment as PrismaComment } from "@prisma/client";

export class PrismaQuestionCommentMapper {
    static toDomain(raw: PrismaComment) {
        if (!raw.questionId) {
            throw new Error("Invalid comment type");
        }
        return QuestionComment.create(
            {
                content: raw.content,
                authorId: new UniqueEntityId(raw.authorId),
                questionId: new UniqueEntityId(raw.questionId),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityId(raw.id),
        );
    }

    static toPersistence(
        questionComment: QuestionComment,
    ): Prisma.CommentUncheckedCreateInput {
        return {
            id: questionComment.id.toString(),
            content: questionComment.content,
            authorId: questionComment.authorId.toString(),
            questionId: questionComment.questionId.toString(),
            createdAt: questionComment.createdAt,
            updatedAt: questionComment.updatedAt,
        };
    }
}
