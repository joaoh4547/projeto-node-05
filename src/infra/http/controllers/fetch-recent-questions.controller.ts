import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageParamsSchema = z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1));

type PageParamsSchema = z.infer<typeof pageParamsSchema>;

@Controller("/questions")
export class FetchRecentQuestionsController {
    constructor(
        private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase,
    ) {}

    @Get()
    async handle(
        @Query("page", new ZodValidationPipe(pageParamsSchema))
        page: PageParamsSchema,
    ) {
        const result = await this.fetchRecentQuestions.handle({
            page,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
        const { questions } = result.value;

        return {
            questions: questions.map(QuestionPresenter.toHTTP),
        };
    }
}
