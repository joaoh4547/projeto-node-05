import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async create(question: Question) {
        const data = PrismaQuestionMapper.toPersistence(question);
        this.prismaService.question.create({ data });
    }

    async findBySlug(slug: string) {
        const question = await this.prismaService.question.findUnique({
            where: { slug },
        });
        if (!question) {
            return null;
        }
        return PrismaQuestionMapper.toDomain(question);
    }

    async findById(id: string) {
        const question = await this.prismaService.question.findUnique({
            where: { id },
        });

        if (!question) {
            return null;
        }

        return PrismaQuestionMapper.toDomain(question);
    }

    async delete(question: Question) {
        const data = PrismaQuestionMapper.toPersistence(question);
        await this.prismaService.question.delete({
            where: { id: data.id },
        });
    }

    async save(question: Question) {
        const data = PrismaQuestionMapper.toPersistence(question);
        await this.prismaService.question.update({
            where: { id: question.id.toString() },
            data,
        });
    }

    async findManyRecent({ page }: PaginationParams) {
        const PAGE_SIZE = 20;
        const questions = await this.prismaService.question.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
        });

        return questions.map(PrismaQuestionMapper.toDomain);
    }
}
