import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { InMemoryAnswerAttachmentsRepository } from "./in-memory-answer-attachments-repository";

export class InMemoryAnswersRepository implements AnswersRepository {
    answers: Answer[] = [];

    constructor(private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository){}

    async create(answer: Answer) {
        this.answers.push(answer);
        DomainEvents.dispatchEventsForAggregate(answer.id);
    }

    async delete(answer: Answer) {
        this.answers = this.answers.filter(a => a.id !== answer.id);
        await this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
    }

    async findById(id: string) {
        return this.answers.find(answer => answer.id.toString() === id) || null;
    }

    async save(answer: Answer) {
        const answerIndex = this.answers.findIndex(a => a.id === answer.id);
        this.answers[answerIndex] = answer;
        DomainEvents.dispatchEventsForAggregate(answer.id);
    }

    async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
        const PAGE_SIZE = 20;
        return this.answers
            .filter(answer => answer.questionId.toString() === questionId)
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }
}