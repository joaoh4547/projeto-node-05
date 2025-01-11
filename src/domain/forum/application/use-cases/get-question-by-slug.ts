import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Injectable } from "@nestjs/common";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details";

export interface GetQuestionBySlugUseCaseInputParams {
    slug: string;
}

export type GetQuestionBySlugUseCaseResult = Either<
    ResourceNotFoundError,
    {
        question: QuestionDetails;
    }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async handle({
        slug,
    }: GetQuestionBySlugUseCaseInputParams): Promise<GetQuestionBySlugUseCaseResult> {
        const question =
            await this.questionsRepository.findBySlugWithDetails(slug);
        if (!question) {
            return left(new ResourceNotFoundError());
        }
        return right({ question });
    }
}
