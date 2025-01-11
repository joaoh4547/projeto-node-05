import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaQuestionAttachmentMapper {
    static toDomain(raw: PrismaAttachment) {
        if (!raw.questionId) {
            throw new Error("Invalid comment type");
        }
        return QuestionAttachment.create(
            {
                attachmentId: new UniqueEntityId(raw.id),
                questionId: new UniqueEntityId(raw.questionId),
            },
            new UniqueEntityId(raw.id),
        );
    }

    static toPersistenceOfUpdateMany(
        attachments: QuestionAttachment[],
    ): Prisma.AttachmentUpdateManyArgs {
        const attachmentIds = attachments.map((attachment) =>
            attachment.id.toString(),
        );

        return {
            where: {
                id: {
                    in: attachmentIds,
                },
            },
            data: {
                questionId: attachments[0].questionId.toString(),
            },
        };
    }
}
