import {
    UsePipes,
    Body,
    Controller,
    Post,
    BadRequestException,
    ConflictException,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { StudentAlreadyExistsError } from "@/domain/forum/application/use-cases/errors/student-already-exists-error";
import { Public } from "@/infra/auth/public";

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
@Public()
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
            const error = result.value;
            switch (error.constructor) {
                case StudentAlreadyExistsError:
                    throw new ConflictException(error.message);
                default:
                    throw new BadRequestException(error.message);
            }
        }
    }
}
