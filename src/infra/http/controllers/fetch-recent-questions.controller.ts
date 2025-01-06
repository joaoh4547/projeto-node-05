import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";

const pageParamsSchema = z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .pipe(z.number().min(1));

type PageParamsSchema = z.infer<typeof pageParamsSchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
    constructor(
        private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase,
    ) {}

    @Get()
    async handle(
        @Query("page", new ZodValidationPipe(pageParamsSchema))
        page: PageParamsSchema,
    ) {
        const questions = await this.fetchRecentQuestions.handle({
            page,
        });

        return { questions };
    }
}
