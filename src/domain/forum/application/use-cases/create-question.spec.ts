import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";

let questionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;


describe("Create Question Use Case", () => {

    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository(new InMemoryQuestionAttachmentsRepository());
        sut = new CreateQuestionUseCase(questionsRepository);
    });

    it("should be able to create a question", async () => {
        const result = await sut.handle({ authorId: "1", title: "Title", content: "Content", attachmentsIds: ["1", "2"] });
        expect(result.isRight()).toBe(true);
        expect(questionsRepository.questions[0]).toEqual(result.value?.question);
        expect(questionsRepository.questions[0].attachments.currentItems).toHaveLength(2);
        expect(questionsRepository.questions[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
            expect.objectContaining({ attachmentId: new UniqueEntityId("2") })
        ]);
    });

});

