import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { InMemoryStudentRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryQuestionsCommentsRepository
    implements QuestionsCommentsRepository
{
    comments: QuestionComment[] = [];

    constructor(private studentsRepository: InMemoryStudentRepository) {}

    async create(questionComment: QuestionComment) {
        this.comments.push(questionComment);
    }

    async findById(id: string) {
        return (
            this.comments.find((comment) => comment.id.toString() === id) ||
            null
        );
    }

    async delete(questionComment: QuestionComment) {
        this.comments = this.comments.filter(
            (c) => c.id !== questionComment.id,
        );
    }

    async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
        const PAGE_SIZE = 20;
        return this.comments
            .filter((comment) => comment.questionId.toString() === questionId)
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }

    async findManyByQuestionIdWithAuthor(
        questionId: string,
        { page }: PaginationParams,
    ) {
        const PAGE_SIZE = 20;
        return this.comments
            .filter((comment) => comment.questionId.toString() === questionId)
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
