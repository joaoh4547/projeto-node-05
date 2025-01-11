import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) {}

    async create(answer: Answer) {
        const data = PrismaAnswerMapper.toPersistence(answer);
        await this.prismaService.answer.create({ data });
        await this.answerAttachmentsRepository.createMany(
            answer.attachments.getItems(),
        );
    }

    async delete(answer: Answer) {
        await this.prismaService.answer.delete({
            where: {
                id: answer.id.toString(),
            },
        });
    }

    async findById(id: string) {
        const answer = await this.prismaService.answer.findUnique({
            where: { id },
        });
        if (!answer) {
            return null;
        }

        return PrismaAnswerMapper.toDomain(answer);
    }

    async save(answer: Answer) {
        const data = PrismaAnswerMapper.toPersistence(answer);
        await Promise.all([
            this.prismaService.answer.update({
                where: { id: answer.id.toString() },
                data,
            }),

            this.answerAttachmentsRepository.createMany(
                answer.attachments.getNewItems(),
            ),
            this.answerAttachmentsRepository.deleteMany(
                answer.attachments.getRemovedItems(),
            ),
        ]);
    }

    async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
        const PAGE_SIZE = 20;
        const answers = await this.prismaService.answer.findMany({
            where: {
                questionId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
        });

        return answers.map(PrismaAnswerMapper.toDomain);
    }
}
