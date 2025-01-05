import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { QuestionsRepository } from "../repositories/questions-repository";

export interface DeleteQuestionUseCaseInputParams {
    questionId: string;
    authorId: string;
}

export type DeleteQuestionUseCaseResult = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>;

export class DeleteQuestionUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async handle({
        questionId,
        authorId,
    }: DeleteQuestionUseCaseInputParams): Promise<DeleteQuestionUseCaseResult> {
        const question = await this.questionsRepository.findById(questionId);

        if (!question) {
            return left(new ResourceNotFoundError());
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError());
        }

        await this.questionsRepository.delete(question);
        return right(null);
    }
}
