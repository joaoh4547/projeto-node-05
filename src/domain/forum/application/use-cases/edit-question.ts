
import { Either, left, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Question } from "../../enterprise/entities/question";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository";
import { QuestionsRepository } from "../repositories/questions-repository";

export interface EditQuestionUseCaseInputParams {
    questionId: string;
    authorId: string;
    title: string;
    content: string;
    attachmentsIds: string[];
}

export type EditQuestionUseCaseResult = Either<ResourceNotFoundError | NotAllowedError, {
    question: Question
}>;

export class EditQuestionUseCase {

    constructor(
        private questionsRepository: QuestionsRepository,
        private questionAttachmentsRepository: QuestionAttachmentsRepository
    ) { }

    async handle({ questionId, authorId, title, content, attachmentsIds }: EditQuestionUseCaseInputParams): Promise<EditQuestionUseCaseResult> {
        const question = await this.questionsRepository.findById(questionId);

        if (!question) {
            return left(new ResourceNotFoundError());
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError());
        }

        const currentQuestionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

        const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments);


        const questionAttachments = attachmentsIds.map(attachmentsId =>{
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityId(attachmentsId),
                questionId: question.id,
            });
        });

        questionAttachmentList.update(questionAttachments);

        question.title = title;
        question.content = content;
        question.attachments = questionAttachmentList;

        await this.questionsRepository.save(question);
        return right({ question });
    }
}
