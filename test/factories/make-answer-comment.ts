import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { AnswerComment, AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comment";
import { faker } from "@faker-js/faker";

export function makeAnswerComment(override:Partial<AnswerCommentProps> = {}, id?: UniqueEntityId): AnswerComment {
    const answerComment = AnswerComment.create({
        authorId: new UniqueEntityId("1"),
        answerId: new UniqueEntityId("1"),
        content: faker.lorem.text(),
        createdAt: faker.date.recent(),
        ...override,
    },id);

    return answerComment;
}