import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
    attachments: QuestionAttachment[] = [];

    async findManyByQuestionId(questionId: string) {
        return this.attachments.filter(attachment => attachment.questionId.toString() === questionId);
    }

    async deleteManyByQuestionId(questionId: string) {
        this.attachments = this.attachments.filter(attachment => attachment.questionId.toString() !== questionId);
    }
}