import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
    static toHTTP(question: QuestionDetails) {
        return {
            questionId: question.questionId.toString(),
            authorId: question.authorId.toString(),
            authorName: question.authorName,
            content: question.content,
            title: question.title,
            slug: question.slug.value,
            bestAnswerId: question.bestAnswerId?.toString(),
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
            attachments: question.attachments.map(AttachmentPresenter.toHTTP),
        };
    }
}
