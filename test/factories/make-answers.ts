import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { faker } from "@faker-js/faker";

export function makeAnswer(override:Partial<AnswerProps> = {}, id?: UniqueEntityId): Answer {
    const answer = Answer.create({
        authorId: new UniqueEntityId("1"),
        questionId: new UniqueEntityId("1"),
        createdAt: faker.date.recent(),
        content: faker.lorem.text(),
        ...override,
    },id);

    return answer;
}