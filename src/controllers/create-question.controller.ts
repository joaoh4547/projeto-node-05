import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
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
    @UsePipes(new ZodValidationPipe(createQuestionBodySchema))  // apply zod validation pipe here.
    async handle(@Body() body: CreateQuestionBodySchema) {
        const { } = body;

        return "ok";


    }
}