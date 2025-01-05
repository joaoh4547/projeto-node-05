import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";

let answersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Answer Use Case", () => {
    beforeEach(() => {
        answersRepository = new InMemoryAnswersRepository(
            new InMemoryAnswerAttachmentsRepository(),
        );
        sut = new AnswerQuestionUseCase(answersRepository);
    });

    it("should be able to create an answer", async () => {
        const result = await sut.handle({
            instructorId: "1",
            questionId: "1",
            content: "Content",
            attachmentsIds: ["1", "2"],
        });
        expect(result.isRight()).toBe(true);
        expect(answersRepository.answers[0]).toEqual(result.value?.answer);
        expect(
            answersRepository.answers[0].attachments.currentItems,
        ).toHaveLength(2);
        expect(answersRepository.answers[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
            expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
        ]);
    });
});
