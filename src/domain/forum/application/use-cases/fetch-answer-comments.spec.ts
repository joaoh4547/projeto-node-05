
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswersCommentsRepository } from "test/repositories/in-memory-answers-comments-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";

let answersCommentsRepository: InMemoryAnswersCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answers Answers Use Case", () => {
    beforeEach(() => {
        answersCommentsRepository = new InMemoryAnswersCommentsRepository();
        sut = new FetchAnswerCommentsUseCase(answersCommentsRepository);
    });

    it("should be able to fetch answers comments", async () => {
        await answersCommentsRepository.create(makeAnswerComment());
        await answersCommentsRepository.create(makeAnswerComment());
        await answersCommentsRepository.create(makeAnswerComment());
        await answersCommentsRepository.create(makeAnswerComment());

        const result = await sut.handle({answerId: "1", page: 1});

        expect(result.isRight()).toBe(true);
        expect(result.value?.comments).toHaveLength(4); 

    });


    it("should be able to fetch paginated answers comments", async () => {
        for(let i = 0; i < 22; i++){
            await answersCommentsRepository.create(makeAnswerComment());
        }
        const result = await sut.handle({answerId: "1", page: 2});

        expect(result.isRight()).toBe(true);
        expect(result.value?.comments).toHaveLength(2);
    });


});