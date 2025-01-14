import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

@Injectable()
export class PrismaQuestionAttachmentRepository
    implements QuestionAttachmentsRepository
{
    constructor(private readonly prismaService: PrismaService) {}

    async findManyByQuestionId(questionId: string) {
        const attachments = await this.prismaService.attachment.findMany({
            where: {
                questionId,
            },
        });
        return attachments.map(PrismaQuestionAttachmentMapper.toDomain);
    }

    async deleteManyByQuestionId(questionId: string) {
        await this.prismaService.attachment.deleteMany({
            where: {
                questionId,
            },
        });
    }

    async createMany(attachments: QuestionAttachment[]) {
        if (!(attachments.length === 0)) {
            const data =
                PrismaQuestionAttachmentMapper.toPersistenceOfUpdateMany(
                    attachments,
                );
            await this.prismaService.attachment.updateMany(data);
        }
    }

    async deleteMany(attachments: QuestionAttachment[]) {
        if (!(attachments.length === 0)) {
            const attachmentIds = attachments.map((attachment) =>
                attachment.id.toString(),
            );
            await this.prismaService.attachment.deleteMany({
                where: {
                    id: {
                        in: attachmentIds,
                    },
                },
            });
        }
    }
}
