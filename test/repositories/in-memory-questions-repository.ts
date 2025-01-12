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
            (item) => item.slug.value === slug,
        );

        if (!question) {
            return null;
        }

        const author = this.studentsRepository.students.find((student) => {
            return student.id.equals(question.authorId);
        });

        if (!author) {
            throw new Error(
                `Author with ID "${question.authorId.toString()}" does not exist.`,
            );
        }

        const questionAttachments =
            this.questionAttachmentsRepository.attachments.filter(
                (questionAttachment) => {
                    return questionAttachment.questionId.equals(question.id);
                },
            );

        const attachments = questionAttachments.map((questionAttachment) => {
            const attachment = this.attachmentsRepository.attachments.find(
                (attachment) => {
                    return attachment.id.equals(
                        questionAttachment.attachmentId,
                    );
                },
            );

            if (!attachment) {
                throw new Error(
                    `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
                );
            }

            return attachment;
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
