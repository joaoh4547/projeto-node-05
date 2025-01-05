
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswersCommentsRepository } from "../repositories/answers-comments-repository";
import { AnswersRepository } from "../repositories/answers-repository";

export interface CommentOnAnswerUseCaseInputParams {
  authorId: string;
  answerId: string;
  content: string;
}

export type CommentOnAnswerUseCaseResult = Either<ResourceNotFoundError,{
  answerComment: AnswerComment
}>

export class CommentOnAnswerUseCase {

    constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswersCommentsRepository
    ) { }

    async handle({ authorId, answerId, content }: CommentOnAnswerUseCaseInputParams): Promise<CommentOnAnswerUseCaseResult> {
        const answer = await this.answersRepository.findById(answerId);

        if (!answer) {
            return left(new ResourceNotFoundError());
        }

        const answerComment = AnswerComment.create({ authorId: new UniqueEntityId(authorId), content, answerId: new UniqueEntityId(answerId) });
        await this.answerCommentsRepository.create(answerComment);
        return right({ answerComment });
    }
}
