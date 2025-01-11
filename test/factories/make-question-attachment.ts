import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import {
    QuestionAttachment,
    QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeQuestionAttachment(
    override: Partial<QuestionAttachmentProps> = {},
    id?: UniqueEntityId,
): QuestionAttachment {
    const questionAttachment = QuestionAttachment.create(
        {
            questionId: new UniqueEntityId(),
            attachmentId: new UniqueEntityId(),
            ...override,
        },
        id,
    );

    return questionAttachment;
}

@Injectable()
export class QuestionAttachmentFactory {
    constructor(private readonly prismaService: PrismaService) {}

    async makePrismaAttachment(
        data: Partial<QuestionAttachmentProps> = {},
    ): Promise<QuestionAttachment> {
        const attachment = makeQuestionAttachment(data);

        await this.prismaService.attachment.update({
            where: {
                id: attachment.attachmentId.toString(),
            },
            data: {
                questionId: attachment.questionId.toString(),
            },
        });

        return attachment;
    }
}
