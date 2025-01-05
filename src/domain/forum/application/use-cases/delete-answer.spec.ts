import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { makeAnswer } from "test/factories/make-answers";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { DeleteAnswerUseCase } from "./delete-answer";

let sut: DeleteAnswerUseCase;
let answersRepository: InMemoryAnswersRepository; 
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
describe("Delete Answer Use Case", () => {

    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
        sut = new DeleteAnswerUseCase(answersRepository);
    });

    it("should to able to delete a answer", async () => {
        const newAnswer = makeAnswer({authorId: new UniqueEntityId("2")}, new UniqueEntityId("1"));
        await answersRepository.create(newAnswer);

        answerAttachmentsRepository.attachments.push(
            makeAnswerAttachment({
                attachmentId: new UniqueEntityId("1"),
                answerId: newAnswer.id
            }),
            makeAnswerAttachment({
                attachmentId: new UniqueEntityId("2"),
                answerId: newAnswer.id
            }),
        );

        await sut.handle({answerId: newAnswer.id.toString(),authorId: "2"});

        expect(answersRepository.answers).toHaveLength(0);
        expect(answerAttachmentsRepository.attachments).toHaveLength(0);
    });


    it("should to not be able to delete a answer from another user", async () => {
        const newAnswer = makeAnswer({authorId: new UniqueEntityId("2")}, new UniqueEntityId("1"));
        await answersRepository.create(newAnswer);

        const result = await sut.handle({answerId: newAnswer.id.toString(),authorId: "4"});

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });

});