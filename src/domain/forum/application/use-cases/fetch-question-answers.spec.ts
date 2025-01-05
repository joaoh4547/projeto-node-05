import { makeAnswer } from "test/factories/make-answers";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { FetchQuestionsAnswersUseCase } from "./fetch-question-answers";

let answersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionsAnswersUseCase;

describe("Fetch  Questions Answers Use Case", () => {
    beforeEach(() => {
        answersRepository = new InMemoryAnswersRepository(
            new InMemoryAnswerAttachmentsRepository(),
        );
        sut = new FetchQuestionsAnswersUseCase(answersRepository);
    });

    it("should be able to fetch question answers", async () => {
        await answersRepository.create(makeAnswer());
        await answersRepository.create(makeAnswer());
        await answersRepository.create(makeAnswer());
        await answersRepository.create(makeAnswer());

        const result = await sut.handle({ questionId: "1", page: 1 });

        expect(result.isRight()).toBe(true);
        expect(result.value?.answers).toHaveLength(4);
    });

    it("should be able to fetch paginated question answers", async () => {
        for (let i = 0; i < 22; i++) {
            await answersRepository.create(makeAnswer());
        }
        const result = await sut.handle({ questionId: "1", page: 2 });
        expect(result.isRight()).toBe(true);
        expect(result.value?.answers).toHaveLength(2);
    });
});
