import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import {
    QuestionComment,
    QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comment";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prisma-question-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeQuestionComment(
    override: Partial<QuestionCommentProps> = {},
    id?: UniqueEntityId,
): QuestionComment {
    const questionComment = QuestionComment.create(
        {
            authorId: new UniqueEntityId("1"),
            questionId: new UniqueEntityId("1"),
            content: faker.lorem.text(),
            createdAt: faker.date.recent(),
            ...override,
        },
        id,
    );

    return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
    constructor(private readonly prismaService: PrismaService) {}

    async makePrismaQuestionComment(
        data: Partial<QuestionCommentProps> = {},
    ): Promise<QuestionComment> {
        const questionComment = makeQuestionComment(data);
        await this.prismaService.comment.create({
            data: PrismaQuestionCommentMapper.toPersistence(questionComment),
        });
        return questionComment;
    }
}
