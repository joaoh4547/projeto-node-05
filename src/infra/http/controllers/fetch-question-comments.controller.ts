import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageParamsSchema = z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1));

type PageParamsSchema = z.infer<typeof pageParamsSchema>;

@Controller("/questions/:questionId/comments")
export class FetchQuestionCommentsController {
    constructor(
        private readonly fetchQuestionComments: FetchQuestionCommentsUseCase,
    ) {}

    @Get()
    async handle(
        @Query("page", new ZodValidationPipe(pageParamsSchema))
        page: PageParamsSchema,
        @Param("questionId") questionId: string,
    ) {
        const result = await this.fetchQuestionComments.handle({
            page,
            questionId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
        const { comments } = result.value;

        return {
            comments: comments.map(CommentPresenter.toHTTP),
        };
    }
}
