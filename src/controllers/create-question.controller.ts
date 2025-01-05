import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CurrentUser } from "src/auth/current.user.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UserPayload } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";



const createQuestionBodySchema = z.object({

});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwt: JwtService
    ) { }


    @Post()
    @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
    async handle(@Body() body: CreateQuestionBodySchema, @CurrentUser() user: UserPayload) {
        // const { } = body;
        console.log(user.sub);
        return "ok";


    }
}