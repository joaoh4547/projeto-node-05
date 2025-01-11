import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import {
    AnswerAttachment,
    AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeAnswerAttachment(
    override: Partial<AnswerAttachmentProps> = {},
    id?: UniqueEntityId,
): AnswerAttachment {
    const answerAttachment = AnswerAttachment.create(
        {
            answerId: new UniqueEntityId(),
            attachmentId: new UniqueEntityId(),
            ...override,
        },
        id,
    );

    return answerAttachment;
}

@Injectable()
export class AnswerAttachmentFactory {
    constructor(private readonly prismaService: PrismaService) {}

    async makePrismaAttachment(
        data: Partial<AnswerAttachmentProps> = {},
    ): Promise<AnswerAttachment> {
        const attachment = makeAnswerAttachment(data);

        await this.prismaService.attachment.update({
            where: {
                id: attachment.attachmentId.toString(),
            },
            data: {
                answerId: attachment.answerId.toString(),
            },
        });

        return attachment;
    }
}
