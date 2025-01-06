import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Student } from "../../enterprise/entities/student";
import { HashGenerator } from "../cryptography/hash-generator";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";
import { StudentsRepository } from "../repositories/students-repository";

export interface RegisterStudentUseCaseInputParams {
    name: string;
    email: string;
    password: string;
}

export type RegisterStudentUseCaseResult = Either<
    StudentAlreadyExistsError,
    {
        student: Student;
    }
>;

@Injectable()
export class RegisterStudentUseCase {
    constructor(
        private studentsRepository: StudentsRepository,
        private hashGenerator: HashGenerator,
    ) {}

    async handle({
        email,
        name,
        password,
    }: RegisterStudentUseCaseInputParams): Promise<RegisterStudentUseCaseResult> {
        const studentWithSameEmail =
            await this.studentsRepository.findByEmail(email);
        if (studentWithSameEmail) {
            return left(new StudentAlreadyExistsError(email));
        }

        const hashedPassword = await this.hashGenerator.hash(password);

        const student = Student.create({
            name,
            email,
            password: hashedPassword,
        });

        await this.studentsRepository.create(student);

        return right({ student });
    }
}
