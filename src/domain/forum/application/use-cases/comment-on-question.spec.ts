import { makeQuestion } from "test/factories/make-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";

let questionsRepository: InMemoryQuestionsRepository;
let questionCommentsRepository: InMemoryQuestionsCommentsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let attachmentsRepository: InMemoryAttachmentsRepository;
let studentRepository: InMemoryStudentRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on question Use Case", () => {
    beforeEach(() => {
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository();
        attachmentsRepository = new InMemoryAttachmentsRepository();
        studentRepository = new InMemoryStudentRepository();
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository,
            attachmentsRepository,
            studentRepository,
        );

        questionCommentsRepository = new InMemoryQuestionsCommentsRepository(
            studentRepository,
        );
        sut = new CommentOnQuestionUseCase(
            questionsRepository,
            questionCommentsRepository,
        );
    });

    it("should be able to comment on question", async () => {
        const newQuestion = makeQuestion();
        await questionsRepository.create(newQuestion);

        await sut.handle({
            questionId: newQuestion.id.toString(),
            authorId: "1",
            content: "New Comment",
        });
        expect(questionCommentsRepository.comments[0].content).toEqual(
            "New Comment",
        );
    });
});
