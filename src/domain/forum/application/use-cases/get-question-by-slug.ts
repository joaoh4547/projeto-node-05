
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";

export interface GetQuestionBySlugUseCaseInputParams {
    slug: string
}

export type GetQuestionBySlugUseCaseResult = Either<ResourceNotFoundError, {
    question: Question
}>

export class GetQuestionBySlugUseCase {

    constructor(private questionsRepository: QuestionsRepository) { }

    async handle({ slug }: GetQuestionBySlugUseCaseInputParams): Promise<GetQuestionBySlugUseCaseResult> {
        const question = await this.questionsRepository.findBySlug(slug);
        if (!question) {
            return left(new ResourceNotFoundError());
        }
        return right({ question });
    }
}
