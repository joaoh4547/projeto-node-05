import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionsCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";

let questionCommentsRepository: InMemoryQuestionsCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe("Delete Question Comment Use Case", () => {
    beforeEach(() => {
        questionCommentsRepository = new InMemoryQuestionsCommentsRepository();
        sut = new DeleteQuestionCommentUseCase(questionCommentsRepository);
    });

    it("should be able to delete a question comment", async () => {
        const newQuestion = makeQuestionComment();
        await questionCommentsRepository.create(newQuestion);

        await sut.handle({
            authorId: "1",
            questionCommentId: newQuestion.id.toString(),
        });
        expect(questionCommentsRepository.comments).toHaveLength(0);
    });

    it("should not be able to delete another user question comment", async () => {
        const newQuestion = makeQuestionComment();
        await questionCommentsRepository.create(newQuestion);

        const result = await sut.handle({
            authorId: "2",
            questionCommentId: newQuestion.id.toString(),
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
