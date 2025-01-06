import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Student } from "../../enterprise/entities/student";
import { StudentRepository } from "../repositories/students-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

export interface CreateStudentUseCaseInputParams {
    name: string;
    email: string;
    password: string;
}

export type CreateStudentUseCaseResult = Either<
    StudentAlreadyExistsError,
    {
        student: Student;
    }
>;

@Injectable()
export class CreateStudentUseCase {
    constructor(
        private studentsRepository: StudentRepository,
        private hashGenerator: HashGenerator,
    ) {}

    async handle({
        email,
        name,
        password,
    }: CreateStudentUseCaseInputParams): Promise<CreateStudentUseCaseResult> {
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
