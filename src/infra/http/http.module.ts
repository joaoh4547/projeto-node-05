import { Module } from "@nestjs/common";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { DatabaseModule } from "../database/prisma/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";

@Module({
    controllers: [
        CreateAccountController,
        AuthenticateController,
        CreateQuestionController,
        FetchRecentQuestionsController,
    ],
    imports: [DatabaseModule],
    providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase],
})
export class HttpModule {}
