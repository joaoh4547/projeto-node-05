import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptograph/fake-hasher";
import { FakeEncrypter } from "test/cryptograph/fake-encrypter";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { makeStudent } from "test/factories/make-student";

let studentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe("Authenticate Student Use Case", () => {
    beforeEach(() => {
        studentRepository = new InMemoryStudentRepository();
        fakeHasher = new FakeHasher();
        fakeEncrypter = new FakeEncrypter();
        sut = new AuthenticateStudentUseCase(
            studentRepository,
            fakeHasher,
            fakeEncrypter,
        );
    });

    it("should be able to authenticate a student", async () => {
        const user = makeStudent({
            email: "john.doe@example.com",
            password: await fakeHasher.hash("password123"),
        });

        studentRepository.students.push(user);

        const result = await sut.handle({
            email: "john.doe@example.com",
            password: "password123",
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            accessToken: expect.any(String),
        });
    });
});
