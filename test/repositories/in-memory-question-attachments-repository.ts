import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
    implements QuestionAttachmentsRepository
{
    attachments: QuestionAttachment[] = [];

    async createMany(attachments: QuestionAttachment[]) {
        this.attachments.push(...attachments);
    }

    async deleteMany(attachments: QuestionAttachment[]) {
        this.attachments = this.attachments.filter((item) => {
            return !attachments.some((attachment) => attachment.equals(item));
        });
    }

    async findManyByQuestionId(questionId: string) {
        return this.attachments.filter(
            (attachment) => attachment.questionId.toString() === questionId,
        );
    }

    async deleteManyByQuestionId(questionId: string) {
        this.attachments = this.attachments.filter(
            (attachment) => attachment.questionId.toString() !== questionId,
        );
    }
}
