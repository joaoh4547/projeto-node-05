import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current.user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";

@Controller("/answers/:id")
export class DeleteAnswerController {
    constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

    @Delete()
    @HttpCode(204)
    async handle(
        @Param("id") answerId: string,
        @CurrentUser() user: UserPayload,
    ) {
        const { sub: userId } = user;
        const result = await this.deleteAnswer.handle({
            answerId,
            authorId: userId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}
