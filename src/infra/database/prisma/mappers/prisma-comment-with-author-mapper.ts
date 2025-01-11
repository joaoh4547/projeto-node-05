import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { Comment as PrismaComment, User as PrismaAuthor } from "@prisma/client";

type PrismaCommentWithAuthor = PrismaComment & { author: PrismaAuthor };

export class PrismaCommentWithAuthorMapper {
    static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
        const commentWithAuthor = CommentWithAuthor.create({
            commentId: new UniqueEntityId(raw.id),
            authorId: new UniqueEntityId(raw.authorId),
            authorName: raw.author.name,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
        return commentWithAuthor;
    }
}
