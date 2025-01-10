import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current.user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";

@Controller("/answers/comments/:id")
export class DeleteAnswerCommentController {
    constructor(
        private readonly deleteAnswerComment: DeleteAnswerCommentUseCase,
    ) {}

    @Delete()
    @HttpCode(204)
    async handle(
        @Param("id") answerCommentId: string,
        @CurrentUser() user: UserPayload,
    ) {
        const { sub: userId } = user;
        const result = await this.deleteAnswerComment.handle({
            answerCommentId,
            authorId: userId,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}
