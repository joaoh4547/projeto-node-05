import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import {
    Attachment,
    AttachmentProps,
} from "@/domain/forum/enterprise/entities/attachment";
import { PrismaAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-attachment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAttachment(
    override: Partial<AttachmentProps> = {},
    id?: UniqueEntityId,
): Attachment {
    const attachment = Attachment.create(
        {
            title: faker.lorem.slug(),
            url: faker.internet.url(),
            ...override,
        },
        id,
    );

    return attachment;
}

@Injectable()
export class AttachmentFactory {
    constructor(private readonly prismaService: PrismaService) {}

    async makePrismaAttachment(
        data: Partial<AttachmentProps> = {},
    ): Promise<Attachment> {
        const attachment = makeAttachment(data);

        await this.prismaService.attachment.create({
            data: PrismaAttachmentMapper.toPersistence(attachment),
        });

        return attachment;
    }
}
