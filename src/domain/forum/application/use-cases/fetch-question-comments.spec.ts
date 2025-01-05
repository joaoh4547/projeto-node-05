import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionsCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";

let commentsRepository: InMemoryQuestionsCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Questions Comments Use Case", () => {
    beforeEach(() => {
        commentsRepository = new InMemoryQuestionsCommentsRepository();
        sut = new FetchQuestionCommentsUseCase(commentsRepository);
    });

    it("should be able to fetch questions comments", async () => {
        await commentsRepository.create(makeQuestionComment());
        await commentsRepository.create(makeQuestionComment());
        await commentsRepository.create(makeQuestionComment());
        await commentsRepository.create(makeQuestionComment());

        const result = await sut.handle({ questionId: "1", page: 1 });

        expect(result.isRight()).toBe(true);
        expect(result.value?.comments).toHaveLength(4);
    });

    it("should be able to fetch paginated questions comments", async () => {
        for (let i = 0; i < 22; i++) {
            await commentsRepository.create(makeQuestionComment());
        }
        const result = await sut.handle({ questionId: "1", page: 2 });

        expect(result.isRight()).toBe(true);
        expect(result.value?.comments).toHaveLength(2);
    });
});
