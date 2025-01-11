import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswersCommentsRepository } from "test/repositories/in-memory-answers-comments-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let studentsRepository: InMemoryStudentRepository;
let answersCommentsRepository: InMemoryAnswersCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answers Answers Use Case", () => {
    beforeEach(() => {
        studentsRepository = new InMemoryStudentRepository();
        answersCommentsRepository = new InMemoryAnswersCommentsRepository(
            studentsRepository,
        );
        sut = new FetchAnswerCommentsUseCase(answersCommentsRepository);
    });

    it("should be able to fetch answers comments", async () => {
        const student = makeStudent({
            name: "John Doe",
        });

        studentsRepository.create(student);

        const comment1 = makeAnswerComment({ authorId: student.id });
        const comment2 = makeAnswerComment({ authorId: student.id });
        const comment3 = makeAnswerComment({ authorId: student.id });
        const comment4 = makeAnswerComment({ authorId: student.id });

        await answersCommentsRepository.create(comment1);
        await answersCommentsRepository.create(comment2);
        await answersCommentsRepository.create(comment3);
        await answersCommentsRepository.create(comment4);

        const result = await sut.handle({ answerId: "1", page: 1 });

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

    it("should be able to fetch paginated answers comments", async () => {
        const student = makeStudent({
            name: "John Doe",
        });

        studentsRepository.create(student);
        for (let i = 0; i < 22; i++) {
            await answersCommentsRepository.create(
                makeAnswerComment({
                    authorId: student.id,
                }),
            );
        }
        const result = await sut.handle({ answerId: "1", page: 2 });

        expect(result.isRight()).toBe(true);
        expect(result.value?.comments).toHaveLength(2);
    });
});
