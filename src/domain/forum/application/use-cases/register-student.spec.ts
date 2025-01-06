import { RegisterStudentUseCase } from "./register-student";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";
import { FakeHasher } from "test/cryptograph/fake-hasher";

let studentRepository: InMemoryStudentRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe("Register Student Use Case", () => {
    beforeEach(() => {
        studentRepository = new InMemoryStudentRepository();
        fakeHasher = new FakeHasher();
        sut = new RegisterStudentUseCase(studentRepository, fakeHasher);
    });

    it("should be able to register a new student", async () => {
        const result = await sut.handle({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password123",
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            student: studentRepository.students[0],
        });
    });

    it("should hash student password upon registration", async () => {
        const result = await sut.handle({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password123",
        });

        expect(result.isRight()).toBe(true);
        expect(studentRepository.students[0].password).toBe(
            "password123--hash",
        );
    });
});
