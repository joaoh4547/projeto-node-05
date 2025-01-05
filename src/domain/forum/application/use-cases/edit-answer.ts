import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository";
import { AnswersRepository } from "../repositories/answers-repository";

export interface EditAnswerUseCaseInputParams {
    answerId: string;
    authorId: string;
    content: string;
    attachmentsIds: string[];
}

export type EditAnswerUseCaseResult = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        answer: Answer;
    }
>;

export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) {}

    async handle({
        answerId,
        authorId,
        content,
        attachmentsIds,
    }: EditAnswerUseCaseInputParams): Promise<EditAnswerUseCaseResult> {
        const answer = await this.answersRepository.findById(answerId);

        if (!answer) {
            return left(new ResourceNotFoundError());
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError());
        }

        const currentAnswerAttachments =
            await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

        const answerAttachmentList = new AnswerAttachmentList(
            currentAnswerAttachments,
        );

        const answerAttachments = attachmentsIds.map((attachmentsId) => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityId(attachmentsId),
                answerId: answer.id,
            });
        });

        answerAttachmentList.update(answerAttachments);

        answer.content = content;
        answer.attachments = answerAttachmentList;

        await this.answersRepository.save(answer);
        return right({ answer });
    }
}
