import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AnswersRepository } from "../repositories/answers-repository";
import { Injectable } from "@nestjs/common";

export interface DeleteAnswerUseCaseInputParams {
    answerId: string;
    authorId: string;
}

export type DeleteAnswerUseCaseResult = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>;

@Injectable()
export class DeleteAnswerUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async handle({
        answerId,
        authorId,
    }: DeleteAnswerUseCaseInputParams): Promise<DeleteAnswerUseCaseResult> {
        const answer = await this.answersRepository.findById(answerId);

        if (!answer) {
            return left(new ResourceNotFoundError());
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError());
        }

        await this.answersRepository.delete(answer);
        return right(null);
    }
}
