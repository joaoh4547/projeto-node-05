import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";

let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let attachmentsRepository: InMemoryAttachmentsRepository;
let studentRepository: InMemoryStudentRepository;
let sut: CreateQuestionUseCase;

describe("Create Question Use Case", () => {
    beforeEach(() => {
        questionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository();
        attachmentsRepository = new InMemoryAttachmentsRepository();
        studentRepository = new InMemoryStudentRepository();
        questionsRepository = new InMemoryQuestionsRepository(
            questionAttachmentsRepository,
            attachmentsRepository,
            studentRepository,
        );
        sut = new CreateQuestionUseCase(questionsRepository);
    });

    it("should be able to create a question", async () => {
        const result = await sut.handle({
            authorId: "1",
            title: "Title",
            content: "Content",
            attachmentsIds: ["1", "2"],
        });
        expect(result.isRight()).toBe(true);
        expect(questionsRepository.questions[0]).toEqual(
            result.value?.question,
        );
        expect(
            questionsRepository.questions[0].attachments.currentItems,
        ).toHaveLength(2);
        expect(
            questionsRepository.questions[0].attachments.currentItems,
        ).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
            expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
        ]);
    });

    it("should persist attachments when creating a new question", async () => {
        const result = await sut.handle({
            authorId: "1",
            title: "Title",
            content: "Content",
            attachmentsIds: ["1", "2"],
        });
        expect(result.isRight()).toBe(true);
        expect(questionAttachmentsRepository.attachments).toHaveLength(2);
        expect(questionAttachmentsRepository.attachments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    attachmentId: new UniqueEntityId("1"),
                }),
                expect.objectContaining({
                    attachmentId: new UniqueEntityId("2"),
                }),
            ]),
        );
    });
});
