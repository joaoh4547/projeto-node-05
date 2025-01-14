import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaQuestionsRepository } from "./repositories/prisma-questions-repository";
import { PrismaQuestionCommentsRepository } from "./repositories/prisma-question-comments-repository";
import { PrismaQuestionAttachmentRepository } from "./repositories/prisma-question-attachments-repository";
import { PrismaAnswersRepository } from "./repositories/prisma-answers-repository";
import { PrismaAnswerCommentsRepository } from "./repositories/prisma-answers-comments-repository";
import { PrismaAnswerAttachmentsRepository } from "./repositories/prisma-answer-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { PrismaStudentsRepository } from "./repositories/prisma-students-repository";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answers-comments-repository";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { PrismaAttachmentsRepository } from "./repositories/prisma-attachments-repository";
import { PrismaNotificationsRepository } from "./repositories/prisma-notifications-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { CacheModule } from "@/infra/cache/cache.module";

@Module({
    imports: [CacheModule],
    providers: [
        PrismaService,
        {
            provide: QuestionsRepository,
            useClass: PrismaQuestionsRepository,
        },
        {
            provide: StudentsRepository,
            useClass: PrismaStudentsRepository,
        },
        {
            provide: QuestionAttachmentsRepository,
            useClass: PrismaQuestionAttachmentRepository,
        },
        {
            provide: QuestionsCommentsRepository,
            useClass: PrismaQuestionCommentsRepository,
        },

        {
            provide: AnswersRepository,
            useClass: PrismaAnswersRepository,
        },
        {
            provide: AnswersCommentsRepository,
            useClass: PrismaAnswerCommentsRepository,
        },
        {
            provide: AnswerAttachmentsRepository,
            useClass: PrismaAnswerAttachmentsRepository,
        },
        {
            provide: AttachmentsRepository,
            useClass: PrismaAttachmentsRepository,
        },
        {
            provide: NotificationsRepository,
            useClass: PrismaNotificationsRepository,
        },
    ],
    exports: [
        PrismaService,
        QuestionsRepository,
        QuestionsCommentsRepository,
        QuestionAttachmentsRepository,
        AnswersRepository,
        AnswersCommentsRepository,
        AnswerAttachmentsRepository,
        StudentsRepository,
        AttachmentsRepository,
        NotificationsRepository,
    ],
})
export class DatabaseModule {}
