import { makeQuestion } from "test/factories/make-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";
import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let attachmentsRepository: InMemoryAttachmentsRepository;
let studentRepository: InMemoryStudentRepository;
let questionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug Use Case", () => {
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
        sut = new GetQuestionBySlugUseCase(questionsRepository);
    });

    it("should be able to get a question by its slug", async () => {
        const student = makeStudent({
            name: "John Doe",
        });

        studentRepository.create(student);

        const createQuestion = makeQuestion({
            slug: Slug.create("title-test"),
            authorId: student.id,
        });

        await questionsRepository.create(createQuestion);

        const attachment = makeAttachment({
            title: "attachment-test",
        });

        attachmentsRepository.attachments.push(attachment);

        questionAttachmentsRepository.attachments.push(
            makeQuestionAttachment({
                attachmentId: attachment.id,
                questionId: createQuestion.id,
            }),
        );

        const result = await sut.handle({ slug: "title-test" });

        expect(result.isRight()).toBe(true);
        expect(result.value).toMatchObject({
            question: expect.objectContaining({
                title: createQuestion.title,
                authorName: "John Doe",
                attachments: [
                    expect.objectContaining({
                        title: "attachment-test",
                    }),
                ],
            }),
        });
    });
});
