import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { makeAnswer } from "test/factories/make-answers";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { EditAnswerUseCase } from "./edit-answer";

let sut: EditAnswerUseCase;
let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
describe("Edit Answer Use Case", () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
        answersRepository = new InMemoryAnswersRepository(
            answerAttachmentsRepository,
        );
        sut = new EditAnswerUseCase(
            answersRepository,
            answerAttachmentsRepository,
        );
    });

    it("should to able to edit a answer", async () => {
        const newAnswer = makeAnswer(
            { authorId: new UniqueEntityId("2") },
            new UniqueEntityId("1"),
        );
        await answersRepository.create(newAnswer);

        answerAttachmentsRepository.attachments.push(
            makeAnswerAttachment({
                attachmentId: new UniqueEntityId("1"),
                answerId: newAnswer.id,
            }),
            makeAnswerAttachment({
                attachmentId: new UniqueEntityId("2"),
                answerId: newAnswer.id,
            }),
        );

        await sut.handle({
            answerId: newAnswer.id.toString(),
            authorId: "2",
            content: "New Content",
            attachmentsIds: ["1", "3"],
        });

        expect(answersRepository.answers[0]).toMatchObject({
            content: "New Content",
        });

        expect(
            answersRepository.answers[0].attachments.currentItems,
        ).toHaveLength(2);
        expect(answersRepository.answers[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
            expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
        ]);
    });

    it("should to not be able to edit a answer from another user", async () => {
        const newAnswer = makeAnswer(
            { authorId: new UniqueEntityId("2") },
            new UniqueEntityId("1"),
        );
        await answersRepository.create(newAnswer);
        const result = await sut.handle({
            answerId: newAnswer.id.toString(),
            authorId: "4",
            content: "New Content",
            attachmentsIds: [],
        });

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });

    it("should sync new and removed attachments when editing a answer", async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityId("2"),
            },
            new UniqueEntityId("1"),
        );
        await answersRepository.create(newAnswer);

        answerAttachmentsRepository.attachments.push(
            makeAnswerAttachment({
                attachmentId: new UniqueEntityId("1"),
                answerId: newAnswer.id,
            }),
            makeAnswerAttachment({
                attachmentId: new UniqueEntityId("2"),
                answerId: newAnswer.id,
            }),
        );

        const result = await sut.handle({
            answerId: newAnswer.id.toString(),
            authorId: "2",
            content: "New Content",
            attachmentsIds: ["1", "3"],
        });

        expect(result.isRight()).toBe(true);
        expect(answerAttachmentsRepository.attachments).toHaveLength(2);
        expect(answerAttachmentsRepository.attachments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    attachmentId: new UniqueEntityId("1"),
                }),
                expect.objectContaining({
                    attachmentId: new UniqueEntityId("3"),
                }),
            ]),
        );
    });
});
