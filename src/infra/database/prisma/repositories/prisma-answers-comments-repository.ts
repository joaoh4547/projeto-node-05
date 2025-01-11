import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersCommentsRepository } from "@/domain/forum/application/repositories/answers-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository
    implements AnswersCommentsRepository
{
    constructor(private readonly prismaService: PrismaService) {}

    async create(answerComment: AnswerComment) {
        const data = PrismaAnswerCommentMapper.toPersistence(answerComment);
        await this.prismaService.comment.create({ data });
    }

    async findById(id: string) {
        const comment = await this.prismaService.comment.findUnique({
            where: {
                id,
            },
        });
        if (!comment) {
            return null;
        }
        return PrismaAnswerCommentMapper.toDomain(comment);
    }

    async findManyByAnswerId(answerId: string, params: PaginationParams) {
        const PAGE_SIZE = 20;
        const comments = await this.prismaService.comment.findMany({
            where: {
                answerId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: PAGE_SIZE,
            skip: (params.page - 1) * PAGE_SIZE,
        });
        return comments.map(PrismaAnswerCommentMapper.toDomain);
    }

    async findManyByAnswerIdWithAuthor(
        answerId: string,
        { page }: PaginationParams,
    ) {
        const PAGE_SIZE = 20;
        const comments = await this.prismaService.comment.findMany({
            where: {
                answerId,
            },
            include: {
                author: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
        });

        return comments.map(PrismaCommentWithAuthorMapper.toDomain);
    }

    async delete(answerComment: AnswerComment) {
        await this.prismaService.comment.delete({
            where: {
                id: answerComment.id.toString(),
            },
        });
    }
}
