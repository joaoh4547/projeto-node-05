import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answers-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswersCommentsRepository implements AnswersCommentsRepository{
    comments: AnswerComment[] = [];
  
    async create(answerComment: AnswerComment) {
        this.comments.push(answerComment);
    }

    async findById(id: string) {
        return this.comments.find(comment => comment.id.toString() === id) || null;
    }

    async delete(answerComment: AnswerComment) {
        this.comments = this.comments.filter(c => c.id !== answerComment.id);
    }

    async findManyByAnswerId(answerId: string,{page}: PaginationParams) {
        const PAGE_SIZE = 20;
        return this.comments
            .filter(comment => comment.answerId.toString() === answerId)
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }
}