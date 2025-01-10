import {
    BadRequestException,
    Controller,
    HttpCode,
    Param,
    Patch,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current.user.decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";

@Controller("/answers/:answerId/choose-as-best")
export class ChooseQuestionBestAnswerController {
    constructor(
        private readonly chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
    ) {}

    @Patch()
    @HttpCode(204)
    async handle(
        @Param("answerId") answerId: string,
        @CurrentUser() user: UserPayload,
    ) {
        const { sub: userId } = user;
        const result = await this.chooseQuestionBestAnswer.handle({
            authorId: userId,
            answerId,
        });
        if (result.isLeft()) {
            throw new BadRequestException();
        }
    }
}
