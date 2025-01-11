import { Either, right } from "@/core/either";
import { QuestionsCommentsRepository } from "../repositories/question-comments-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export interface FetchQuestionCommentsUseCaseInputParams {
    page: number;
    questionId: string;
}

export type FetchQuestionCommentsUseCaseResult = Either<
    null,
    {
        comments: CommentWithAuthor[];
    }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
    constructor(private questionRepository: QuestionsCommentsRepository) {}

    async handle({
        page,
        questionId,
    }: FetchQuestionCommentsUseCaseInputParams): Promise<FetchQuestionCommentsUseCaseResult> {
        const comments =
            await this.questionRepository.findManyByQuestionIdWithAuthor(
                questionId,
                { page },
            );
        return right({ comments });
    }
}
