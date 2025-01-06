import { UsePipes, Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
    constructor(private readonly registerStudent: RegisterStudentUseCase) {} // inject prisma service here.

    @Post()
    @UsePipes(new ZodValidationPipe(createAccountBodySchema)) // apply zod validation pipe here.
    async handle(@Body() body: CreateAccountBodySchema) {
        const { name, email, password } = body;

        const result = await this.registerStudent.handle({
            email,
            name,
            password,
        });

        if (result.isLeft()) {
            throw new Error();
        }
    }
}
