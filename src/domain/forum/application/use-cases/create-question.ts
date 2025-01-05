
import { Either, right } from "@/core/either";
import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionsRepository } from "../repositories/questions-repository";

export interface CreateQuestionUseCaseInputParams {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

export type CreateQuestionUseCaseResult = Either<null, {
  question: Question
}>

export class CreateQuestionUseCase {

    constructor(private questionsRepository: QuestionsRepository) { }

    async handle({ authorId, content, title,attachmentsIds }: CreateQuestionUseCaseInputParams): Promise<CreateQuestionUseCaseResult> {
        const question = Question.create({ authorId: new UniqueEntityId(authorId), content, title });
        const questionAttachments = attachmentsIds.map(attachmentsId =>{
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityId(attachmentsId),
                questionId: question.id,
            });
        });

        question.attachments = new QuestionAttachmentList(questionAttachments);

        await this.questionsRepository.create(question);
        return right({ question });
    }
}
