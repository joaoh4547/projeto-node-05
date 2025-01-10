import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageParamsSchema = z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1));

type PageParamsSchema = z.infer<typeof pageParamsSchema>;

@Controller("/answers/:answerId/comments")
export class FetchAnswerCommentsController {
    constructor(
        private readonly fetchAnswerComments: FetchAnswerCommentsUseCase,
    ) {}

    @Get()
    async handle(
        @Query("page", new ZodValidationPipe(pageParamsSchema))
        page: PageParamsSchema,
        @Param("answerId") answerId: string,
    ) {
        const result = await this.fetchAnswerComments.handle({
            page,
            answerId,
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
