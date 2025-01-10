import { Either, right } from "@/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswersCommentsRepository } from "../repositories/answers-comments-repository";
import { Injectable } from "@nestjs/common";

export interface FetchAnswerCommentsUseCaseInputParams {
    page: number;
    answerId: string;
}

export type FetchAnswerCommentsUseCaseResult = Either<
    null,
    {
        comments: AnswerComment[];
    }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
    constructor(private answerRepository: AnswersCommentsRepository) {}

    async handle({
        page,
        answerId,
    }: FetchAnswerCommentsUseCaseInputParams): Promise<FetchAnswerCommentsUseCaseResult> {
        const comments = await this.answerRepository.findManyByAnswerId(
            answerId,
            { page },
        );
        return right({ comments });
    }
}
