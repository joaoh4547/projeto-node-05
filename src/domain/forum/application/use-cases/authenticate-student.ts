import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";
import { StudentsRepository } from "../repositories/students-repository";

export interface AuthenticateStudentUseCaseInputParams {
    email: string;
    password: string;
}

export type AuthenticateStudentUseCaseResult = Either<
    WrongCredentialsError,
    {
        accessToken: string;
    }
>;

@Injectable()
export class AuthenticateStudentUseCase {
    constructor(
        private studentsRepository: StudentsRepository,
        private hashComparer: HashComparer,
        private encrypter: Encrypter,
    ) {}

    async handle({
        email,
        password,
    }: AuthenticateStudentUseCaseInputParams): Promise<AuthenticateStudentUseCaseResult> {
        const student = await this.studentsRepository.findByEmail(email);
        if (!student) {
            return left(new WrongCredentialsError());
        }

        const isPasswordValid = await this.hashComparer.compare(
            password,
            student.password,
        );

        if (!isPasswordValid) {
            return left(new WrongCredentialsError());
        }

        const accessToken = await this.encrypter.encrypt({
            sub: student.id.toString(),
        });

        return right({ accessToken });
    }
}
