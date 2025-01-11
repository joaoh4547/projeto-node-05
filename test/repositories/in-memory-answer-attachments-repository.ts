import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository
    implements AnswerAttachmentsRepository
{
    async createMany(attachments: AnswerAttachment[]) {
        this.attachments.push(...attachments);
    }

    async deleteMany(attachments: AnswerAttachment[]) {
        this.attachments = this.attachments.filter((item) => {
            return !attachments.some((attachment) => attachment.equals(item));
        });
    }

    attachments: AnswerAttachment[] = [];

    async findManyByAnswerId(answerId: string) {
        return this.attachments.filter(
            (attachment) => attachment.answerId.toString() === answerId,
        );
    }

    async deleteManyByAnswerId(answerId: string) {
        this.attachments = this.attachments.filter(
            (attachment) => attachment.answerId.toString() !== answerId,
        );
    }
}
