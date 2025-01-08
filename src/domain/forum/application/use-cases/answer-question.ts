import { Either, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswersRepository } from "../repositories/answers-repository";
import { Injectable } from "@nestjs/common";

export interface AnswerQuestionUseCaseInputParams {
    authorId: string;
    questionId: string;
    content: string;
    attachmentsIds: string[];
}

export type AnswerQuestionUseCaseResult = Either<
    null,
    {
        answer: Answer;
    }
>;

@Injectable()
export class AnswerQuestionUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async handle({
        authorId,
        questionId,
        content,
        attachmentsIds,
    }: AnswerQuestionUseCaseInputParams): Promise<AnswerQuestionUseCaseResult> {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityId(authorId),
            questionId: new UniqueEntityId(questionId),
        });

        const answerAttachments = attachmentsIds.map((attachmentsId) => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityId(attachmentsId),
                answerId: answer.id,
            });
        });

        answer.attachments = new AnswerAttachmentList(answerAttachments);

        await this.answersRepository.create(answer);
        return right({ answer });
    }
}
