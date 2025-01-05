import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionsCommentsRepository implements QuestionsCommentsRepository{
    comments: QuestionComment[] = [];
  
    async create(questionComment: QuestionComment) {
        this.comments.push(questionComment);
    }

    async findById(id: string) {
        return this.comments.find(comment => comment.id.toString() === id) || null;
    }

    async delete(questionComment: QuestionComment) {
        this.comments = this.comments.filter(c => c.id !== questionComment.id);
    }

    async findManyByQuestionId(questionId: string,{page}: PaginationParams) {
        const PAGE_SIZE = 20;
        return this.comments
            .filter(comment => comment.questionId.toString() === questionId)
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);;
    }
}