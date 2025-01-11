import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answers-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { InMemoryStudentRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryAnswersCommentsRepository
    implements AnswersCommentsRepository
{
    comments: AnswerComment[] = [];

    constructor(private studentsRepository: InMemoryStudentRepository) {}

    async create(answerComment: AnswerComment) {
        this.comments.push(answerComment);
    }

    async findById(id: string) {
        return (
            this.comments.find((comment) => comment.id.toString() === id) ||
            null
        );
    }

    async delete(answerComment: AnswerComment) {
        this.comments = this.comments.filter((c) => c.id !== answerComment.id);
    }

    async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
        const PAGE_SIZE = 20;
        return this.comments
            .filter((comment) => comment.answerId.toString() === answerId)
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }

    async findManyByAnswerIdWithAuthor(
        answerId: string,
        { page }: PaginationParams,
    ) {
        const PAGE_SIZE = 20;
        return this.comments
            .filter((comment) => comment.answerId.toString() === answerId)
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
            .map((comment) => {
                const author = this.studentsRepository.students.find(
                    (student) => student.id.equals(comment.authorId),
                );

                if (!author) {
                    throw new Error(
                        `Author ${comment.authorId} not found for comment ${comment.id}`,
                    );
                }

                return CommentWithAuthor.create({
                    content: comment.content,
                    commentId: comment.id,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                    authorId: comment.authorId,
                    authorName: author.name,
                });
            });
    }
}
