import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import {
    Question,
    QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeQuestion(
    override: Partial<QuestionProps> = {},
    id?: UniqueEntityId,
): Question {
    const question = Question.create(
        {
            authorId: new UniqueEntityId("1"),
            title: faker.lorem.sentence(),
            content: faker.lorem.text(),
            ...override,
        },
        id,
    );

    return question;
}

@Injectable()
export class QuestionFactory {
    constructor(private readonly prismaService: PrismaService) {}

    async makePrismaQuestion(
        data: Partial<QuestionProps> = {},
    ): Promise<Question> {
        const question = makeQuestion(data);
        await this.prismaService.question.create({
            data: PrismaQuestionMapper.toPersistence(question),
        });
        return question;
    }
}
