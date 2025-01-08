import { Module } from "@nestjs/common";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { DatabaseModule } from "../database/prisma/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { CryptographModule } from "../cryptograph/cryptograph.module";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { DeleteQuestionController } from "./controllers/delete-question.controller";

@Module({
    controllers: [
        CreateAccountController,
        AuthenticateController,
        CreateQuestionController,
        FetchRecentQuestionsController,
        GetQuestionBySlugController,
        EditQuestionController,
        DeleteQuestionController,
    ],
    imports: [DatabaseModule, CryptographModule],
    providers: [
        CreateQuestionUseCase,
        FetchRecentQuestionsUseCase,
        AuthenticateStudentUseCase,
        RegisterStudentUseCase,
        GetQuestionBySlugUseCase,
        EditQuestionUseCase,
        DeleteQuestionUseCase,
    ],
})
export class HttpModule {}
