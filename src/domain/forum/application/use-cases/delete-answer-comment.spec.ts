import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswersCommentsRepository } from "test/repositories/in-memory-answers-comments-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";

let answerCommentsRepository: InMemoryAnswersCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment Use Case", () => {
    beforeEach(() => {
        answerCommentsRepository = new InMemoryAnswersCommentsRepository();
        sut = new DeleteAnswerCommentUseCase(answerCommentsRepository);
    });

    it("should be able to delete a answer comment", async () => {
        const newAnswer = makeAnswerComment();
        await answerCommentsRepository.create(newAnswer);

        await sut.handle({
            authorId: "1",
            answerCommentId: newAnswer.id.toString(),
        });
        expect(answerCommentsRepository.comments).toHaveLength(0);
    });

    it("should not be able to delete another user answer comment", async () => {
        const newAnswer = makeAnswerComment();
        await answerCommentsRepository.create(newAnswer);

        const result = await sut.handle({
            authorId: "2",
            answerCommentId: newAnswer.id.toString(),
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
