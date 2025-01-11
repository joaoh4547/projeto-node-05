import { Either, right } from "@/core/either";
import { AnswersCommentsRepository } from "../repositories/answers-comments-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export interface FetchAnswerCommentsUseCaseInputParams {
    page: number;
    answerId: string;
}

export type FetchAnswerCommentsUseCaseResult = Either<
    null,
    {
        comments: CommentWithAuthor[];
    }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
    constructor(private answerRepository: AnswersCommentsRepository) {}

    async handle({
        page,
        answerId,
    }: FetchAnswerCommentsUseCaseInputParams): Promise<FetchAnswerCommentsUseCaseResult> {
        const comments =
            await this.answerRepository.findManyByAnswerIdWithAuthor(answerId, {
                page,
            });
        return right({ comments });
    }
}
