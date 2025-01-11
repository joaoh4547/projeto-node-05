import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryQuestionsCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let studentsRepository: InMemoryStudentRepository;
let commentsRepository: InMemoryQuestionsCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch Questions Comments Use Case", () => {
    beforeEach(() => {
        studentsRepository = new InMemoryStudentRepository();
        commentsRepository = new InMemoryQuestionsCommentsRepository(
            studentsRepository,
        );
        sut = new FetchQuestionCommentsUseCase(commentsRepository);
    });

    it("should be able to fetch questions comments", async () => {
        const student = makeStudent({
            name: "John Doe",
        });

        await studentsRepository.create(student);

        const comment1 = makeQuestionComment({
            authorId: student.id,
        });

        const comment2 = makeQuestionComment({
            authorId: student.id,
        });

        const comment3 = makeQuestionComment({
            authorId: student.id,
        });

        const comment4 = makeQuestionComment({
            authorId: student.id,
        });

        await commentsRepository.create(comment1);
        await commentsRepository.create(comment2);
        await commentsRepository.create(comment3);
        await commentsRepository.create(comment4);

        const result = await sut.handle({ questionId: "1", page: 1 });

        expect(result.isRight()).toBe(true);
        expect(result.value?.comments).toHaveLength(4);
        expect(result.value?.comments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    authorName: "John Doe",
                    commentId: comment1.id,
                }),
                expect.objectContaining({
                    authorName: "John Doe",
                    commentId: comment2.id,
                }),
                expect.objectContaining({
                    authorName: "John Doe",
                    commentId: comment3.id,
                }),
                expect.objectContaining({
                    authorName: "John Doe",
                    commentId: comment4.id,
                }),
            ]),
        );
    });

    it("should be able to fetch paginated questions comments", async () => {
        const student = makeStudent();

        await studentsRepository.create(student);

        for (let i = 0; i < 22; i++) {
            await commentsRepository.create(
                makeQuestionComment({
                    authorId: student.id,
                }),
            );
        }
        const result = await sut.handle({ questionId: "1", page: 2 });

        expect(result.isRight()).toBe(true);
        expect(result.value?.comments).toHaveLength(2);
    });
});
