import { makeQuestion } from "test/factories/make-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";

let questionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent Questions Use Case", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository(
            new InMemoryQuestionAttachmentsRepository(),
            new InMemoryAttachmentsRepository(),
            new InMemoryStudentRepository(),
        );
        sut = new FetchRecentQuestionsUseCase(questionsRepository);
    });

    it("should be able to fetch recent questions", async () => {
        await questionsRepository.create(
            makeQuestion({
                createdAt: new Date(2022, 0, 20),
            }),
        );

        await questionsRepository.create(
            makeQuestion({
                createdAt: new Date(2022, 0, 18),
            }),
        );

        await questionsRepository.create(
            makeQuestion({
                createdAt: new Date(2022, 0, 23),
            }),
        );

        const result = await sut.handle({ page: 1 });

        expect(result.isRight()).toBe(true);
        expect(result.value?.questions).toHaveLength(3);

        expect(result.value?.questions).toEqual([
            expect.objectContaining({ createdAt: new Date(2022, 0, 23) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
        ]);
    });

    it("should be able to fetch paginated recent questions", async () => {
        for (let i = 1; i <= 22; i++) {
            await questionsRepository.create(makeQuestion());
        }

        const result = await sut.handle({ page: 2 });

        expect(result.isRight()).toBe(true);
        expect(result.value?.questions).toHaveLength(2);
    });
});
