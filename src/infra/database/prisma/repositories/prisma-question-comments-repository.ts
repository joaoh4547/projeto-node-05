import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";

@Injectable()
export class PrismaQuestionCommentsRepository
    implements QuestionsCommentsRepository
{
    constructor(private readonly prismaService: PrismaService) {}

    async create(questionComment: QuestionComment) {
        const data = PrismaQuestionCommentMapper.toPersistence(questionComment);
        await this.prismaService.comment.create({ data });
    }

    async delete(questionComment: QuestionComment) {
        await this.prismaService.comment.delete({
            where: {
                id: questionComment.id.toString(),
            },
        });
    }

    async findById(id: string) {
        const comment = await this.prismaService.comment.findUnique({
            where: {
                id: id.toString(),
            },
        });

        if (!comment) {
            return null;
        }

        return PrismaQuestionCommentMapper.toDomain(comment);
    }

    async findManyByQuestionId(questionId: string, params: PaginationParams) {
        const PAGE_SIZE = 20;
        const comments = await this.prismaService.comment.findMany({
            where: {
                questionId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: PAGE_SIZE,
            skip: (params.page - 1) * PAGE_SIZE,
        });

        return comments.map(PrismaQuestionCommentMapper.toDomain);
    }
}
