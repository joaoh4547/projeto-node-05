import { makeQuestion } from "test/factories/make-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";

let questionsRepository: InMemoryQuestionsRepository;
let questionCommentsRepository: InMemoryQuestionsCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on question Use Case", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository(
            new InMemoryQuestionAttachmentsRepository(),
        );
        questionCommentsRepository = new InMemoryQuestionsCommentsRepository();
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
