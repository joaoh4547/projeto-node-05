import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaQuestionsRepository } from "./repositories/prisma-questions-repository";
import { PrismaQuestionCommentsRepository } from "./repositories/prisma-question-comments-repository";
import { PrismaQuestionAttachmentRepository } from "./repositories/prisma-question-attachments-repository";
import { PrismaAnswersRepository } from "./repositories/prisma-answers-repository";
import { PrismaAnswerCommentsRepository } from "./repositories/prisma-answers-comments-repository";
import { PrismaAnswerAttachmentsRepository } from "./repositories/prisma-answer-attachments-repository";

@Module({
    providers: [
        PrismaService,
        PrismaQuestionsRepository,
        PrismaQuestionCommentsRepository,
        PrismaQuestionAttachmentRepository,
        PrismaAnswersRepository,
        PrismaAnswerCommentsRepository,
        PrismaAnswerAttachmentsRepository,
    ],
    exports: [PrismaService],
})
export class DatabaseModule {}
