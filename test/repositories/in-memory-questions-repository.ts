import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";

export class InMemoryQuestionsRepository implements QuestionsRepository {
    questions: Question[] = [];

    constructor(private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository) { }

    async create(question: Question) {
        this.questions.push(question);
        DomainEvents.dispatchEventsForAggregate(question.id);
    }

    async findBySlug(slug: string) {
        return this.questions.find(question => question.slug.value === slug) || null;
    }

    async findById(id: string) {
        return this.questions.find(question => question.id.toString() === id) || null;
    }

    async delete(question: Question) {
        this.questions = this.questions.filter(q => q.id !== question.id);
        await this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString());
    }

    async save(question: Question) {
        const questionIndex = this.questions.findIndex(q => q.id === question.id);
        this.questions[questionIndex] = question;
        DomainEvents.dispatchEventsForAggregate(question.id);
    }

    async findManyRecent({ page }: PaginationParams) {
        const PAGE_SIZE = 20;
        return this.questions.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        }).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }


}