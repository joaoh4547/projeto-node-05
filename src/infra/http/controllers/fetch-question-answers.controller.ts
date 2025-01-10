import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { FetchQuestionsAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { AnswerPresenter } from "../presenters/answer-presenter";

const pageParamsSchema = z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1));

type PageParamsSchema = z.infer<typeof pageParamsSchema>;

@Controller("/questions/:questionId/answers")
export class FetchQuestionAnswersController {
    constructor(
        private readonly fetchQuestionAnswers: FetchQuestionsAnswersUseCase,
    ) {}

    @Get()
    async handle(
        @Query("page", new ZodValidationPipe(pageParamsSchema))
        page: PageParamsSchema,
        @Param("questionId") questionId: string,
    ) {
        const result = await this.fetchQuestionAnswers.handle({
            page,
            questionId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
        const { answers } = result.value;

        return {
            answers: answers.map(AnswerPresenter.toHTTP),
        };
    }
}
