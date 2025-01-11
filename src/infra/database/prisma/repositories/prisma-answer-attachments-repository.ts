import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

@Injectable()
export class PrismaAnswerAttachmentsRepository
    implements AnswerAttachmentsRepository
{
    constructor(private readonly prismaService: PrismaService) {}

    async findManyByAnswerId(answerId: string) {
        const attachments = await this.prismaService.attachment.findMany({
            where: {
                answerId,
            },
        });

        return attachments.map(PrismaAnswerAttachmentMapper.toDomain);
    }

    async deleteManyByAnswerId(answerId: string) {
        await this.prismaService.attachment.deleteMany({
            where: {
                answerId,
            },
        });
    }

    async createMany(attachments: AnswerAttachment[]) {
        if (!(attachments.length === 0)) {
            const data =
                PrismaAnswerAttachmentMapper.toPersistenceOfUpdateMany(
                    attachments,
                );
            await this.prismaService.attachment.updateMany(data);
        }
    }

    async deleteMany(attachments: AnswerAttachment[]) {
        if (!(attachments.length === 0)) {
            const attachmentIds = attachments.map((attachment) =>
                attachment.attachmentId.toString(),
            );
            await this.prismaService.attachment.deleteMany({
                where: {
                    id: { in: attachmentIds },
                },
            });
        }
    }
}
