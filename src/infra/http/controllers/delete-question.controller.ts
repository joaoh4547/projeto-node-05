import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current.user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";

@Controller("/questions/:id")
export class DeleteQuestionController {
    constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}

    @Delete()
    @HttpCode(204)
    async handle(
        @Param("id") questionId: string,
        @CurrentUser() user: UserPayload,
    ) {
        const { sub: userId } = user;
        const result = await this.deleteQuestion.handle({
            questionId,
            authorId: userId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}
