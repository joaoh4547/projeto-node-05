import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current.user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { z } from "zod";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";

const editQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/:id")
export class EditQuestionController {
    constructor(private readonly editQuestion: EditQuestionUseCase) {}

    @Put()
    @HttpCode(204)
    async handle(
        @Body(new ZodValidationPipe(editQuestionBodySchema))
        body: EditQuestionBodySchema,
        @Param("id") questionId: string,
        @CurrentUser() user: UserPayload,
    ) {
        const { title, content } = body;
        const { sub: userId } = user;
        const result = await this.editQuestion.handle({
            questionId,
            title,
            content,
            authorId: userId,
            attachmentsIds: [],
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}
