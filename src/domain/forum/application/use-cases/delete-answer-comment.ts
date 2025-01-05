
import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AnswersCommentsRepository } from "../repositories/answers-comments-repository";

export interface DeleteAnswerCommentUseCaseInputParams {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResult =  Either<ResourceNotFoundError | NotAllowedError,null>

export class DeleteAnswerCommentUseCase {

    constructor(private answerCommentsRepository: AnswersCommentsRepository) { }

    async handle({ authorId,answerCommentId }: DeleteAnswerCommentUseCaseInputParams): Promise<DeleteAnswerCommentUseCaseResult> {
        const answerComment = await this.answerCommentsRepository.findById(answerCommentId);

        if (!answerComment) {
            return left(new ResourceNotFoundError());
        }

        if(authorId !== answerComment.authorId.toString()) {
            return left(new NotAllowedError());
        }

        await this.answerCommentsRepository.delete(answerComment);
        return right(null);
    }
}
