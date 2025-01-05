import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { makeQuestion } from "test/factories/make-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { DeleteQuestionUseCase } from "./delete-question";

let sut: DeleteQuestionUseCase;
let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;

describe("Delete Question Use Case", () => {
    beforeEach(() => {
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository();
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository,
        );
        sut = new DeleteQuestionUseCase(questionsRepository);
    });

    it("should to able to delete a question", async () => {
        const newQuestion = makeQuestion(
            { authorId: new UniqueEntityId("2") },
            new UniqueEntityId("1"),
        );
        await questionsRepository.create(newQuestion);
        questionAttachmentsRepository.attachments.push(
            makeQuestionAttachment({
                attachmentId: new UniqueEntityId("1"),
                questionId: newQuestion.id,
            }),
            makeQuestionAttachment({
                attachmentId: new UniqueEntityId("2"),
                questionId: newQuestion.id,
            }),
        );
        await sut.handle({
            questionId: newQuestion.id.toString(),
            authorId: "2",
        });

        expect(questionsRepository.questions).toHaveLength(0);
        expect(questionAttachmentsRepository.attachments).toHaveLength(0);
    });

    it("should to not be able to delete a question from another user", async () => {
        const newQuestion = makeQuestion(
            { authorId: new UniqueEntityId("2") },
            new UniqueEntityId("1"),
        );
        await questionsRepository.create(newQuestion);

        const result = await sut.handle({
            questionId: newQuestion.id.toString(),
            authorId: "4",
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });
});
