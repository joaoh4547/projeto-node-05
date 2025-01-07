import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import {
    AnswerComment,
    AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAnswerComment(
    override: Partial<AnswerCommentProps> = {},
    id?: UniqueEntityId,
): AnswerComment {
    const answerComment = AnswerComment.create(
        {
            authorId: new UniqueEntityId("1"),
            answerId: new UniqueEntityId("1"),
            content: faker.lorem.text(),
            createdAt: faker.date.recent(),
            ...override,
        },
        id,
    );

    return answerComment;
}

@Injectable()
export class AnswerCommentFactory {
    constructor(private readonly prismaService: PrismaService) {}

    async makePrismaAnswerComment(
        data: Partial<AnswerCommentProps> = {},
    ): Promise<AnswerComment> {
        const answerComment = makeAnswerComment(data);
        await this.prismaService.comment.create({
            data: PrismaAnswerCommentMapper.toPersistence(answerComment),
        });
        return answerComment;
    }
}
