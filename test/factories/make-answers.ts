import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { PrismaAnswerMapper } from "@/infra/database/prisma/mappers/prisma-answer-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAnswer(
    override: Partial<AnswerProps> = {},
    id?: UniqueEntityId,
): Answer {
    const answer = Answer.create(
        {
            authorId: new UniqueEntityId("1"),
            questionId: new UniqueEntityId("1"),
            createdAt: faker.date.recent(),
            content: faker.lorem.text(),
            ...override,
        },
        id,
    );

    return answer;
}

@Injectable()
export class AnswerFactory {
    constructor(private readonly prismaService: PrismaService) {}

    async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
        const answer = makeAnswer(data);
        await this.prismaService.answer.create({
            data: PrismaAnswerMapper.toPersistence(answer),
        });
        return answer;
    }
}
