import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { z } from "zod";


const pageParamsSchema = z.string().optional().default("1").transform(Number).pipe(
    z.number().min(1)
);

type PageParamsSchema = z.infer<typeof pageParamsSchema>

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {

    constructor(
        private readonly prismaService: PrismaService
    ) { }


    @Get()
    async handle(@Query("page", new ZodValidationPipe(pageParamsSchema)) page:  PageParamsSchema){
        const PAGE_SIZE = 20;
        const questions = await this.prismaService.question.findMany({
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
            orderBy:{
                createdAt: "desc"
            }
        });

        return {questions};
    }

}