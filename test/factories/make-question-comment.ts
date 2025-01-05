import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { QuestionComment, QuestionCommentProps } from "@/domain/forum/enterprise/entities/question-comment";
import { faker } from "@faker-js/faker";

export function makeQuestionComment(override:Partial<QuestionCommentProps> = {}, id?: UniqueEntityId): QuestionComment {
    const questionComment = QuestionComment.create({
        authorId: new UniqueEntityId("1"),
        questionId: new UniqueEntityId("1"),
        content: faker.lorem.text(),
        createdAt: faker.date.recent(),
        ...override,
    },id);

    return questionComment;
}