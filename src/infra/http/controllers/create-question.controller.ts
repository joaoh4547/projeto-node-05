import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current.user.decorator";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { z } from "zod";



const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {

    constructor(
        private readonly prismaService: PrismaService
    ) { }


    @Post()
    async handle(@Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema, @CurrentUser() user: UserPayload) {
        const { title, content } = body;
        const { sub: userId } = user;
        await this.prismaService.question.create({
            data: {
                title,
                content,
                slug: this.convertToSlug(title),
                authorId: userId
            }
        });
    }

    private convertToSlug(title: string){
        return title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
    }
}