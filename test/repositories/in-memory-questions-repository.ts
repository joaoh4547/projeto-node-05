import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { InMemoryStudentRepository } from "./in-memory-students-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";

export class InMemoryQuestionsRepository implements QuestionsRepository {
    questions: Question[] = [];

    constructor(
        private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
        private attachmentsRepository: InMemoryAttachmentsRepository,
        private studentsRepository: InMemoryStudentRepository,
    ) {}

    async create(question: Question) {
        this.questions.push(question);
        await this.questionAttachmentsRepository.createMany(
            question.attachments.getItems(),
        );
        DomainEvents.dispatchEventsForAggregate(question.id);
    }

    async findBySlug(slug: string) {
        return (
            this.questions.find((question) => question.slug.value === slug) ||
            null
        );
    }

    async findBySlugWithDetails(slug: string) {
        const question = this.questions.find(
            (question) => question.slug.value === slug,
        );

        if (!question) {
            return null;
        }

        const author = this.studentsRepository.students.find((student) =>
            student.id.equals(question.authorId),
        );
        if (!author) {
            throw new Error(
                `Author ${question.authorId.toString()} not found for question ${question.id.toString()}`,
            );
        }

        const questionAttachments =
            await this.questionAttachmentsRepository.findManyByQuestionId(
                question.id.toString(),
            );

        const attachments = questionAttachments.map((attachment) => {
            const questionAttachment =
                this.attachmentsRepository.attachments.find((a) =>
                    a.id.equals(attachment.id),
                );

            if (!questionAttachment) {
                throw new Error(
                    `Attachment ${attachment.id.toString()} not found for question ${question.id.toString()}`,
                );
            }

            return questionAttachment;
        });

        return QuestionDetails.create({
            questionId: question.id,
            content: question.content,
            title: question.title,
            slug: question.slug,
            attachments,
            bestAnswerId: question.bestAnswerId,
            authorId: question.authorId,
            authorName: author.name,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        });
    }

    async findById(id: string) {
        return (
            this.questions.find((question) => question.id.toString() === id) ||
            null
        );
    }

    async delete(question: Question) {
        this.questions = this.questions.filter((q) => q.id !== question.id);
        await this.questionAttachmentsRepository.deleteManyByQuestionId(
            question.id.toString(),
        );
    }

    async save(question: Question) {
        const questionIndex = this.questions.findIndex(
            (q) => q.id === question.id,
        );
        this.questions[questionIndex] = question;
        await this.questionAttachmentsRepository.createMany(
            question.attachments.getNewItems(),
        );

        await this.questionAttachmentsRepository.deleteMany(
            question.attachments.getRemovedItems(),
        );

        DomainEvents.dispatchEventsForAggregate(question.id);
    }

    async findManyRecent({ page }: PaginationParams) {
        const PAGE_SIZE = 20;
        return this.questions
            .sort((a, b) => {
                return b.createdAt.getTime() - a.createdAt.getTime();
            })
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }
}
