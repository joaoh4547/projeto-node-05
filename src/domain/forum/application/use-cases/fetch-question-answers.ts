import { Either, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";

export interface FetchQuestionsAnswersUseCaseInputParams {
    page: number;
    questionId: string;
}

export type FetchQuestionsAnswersUseCaseResult = Either<
    null,
    {
        answers: Answer[];
    }
>;

export class FetchQuestionsAnswersUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async handle({
        page,
        questionId,
    }: FetchQuestionsAnswersUseCaseInputParams): Promise<FetchQuestionsAnswersUseCaseResult> {
        const answers = await this.answersRepository.findManyByQuestionId(
            questionId,
            { page },
        );
        return right({ answers });
    }
}
