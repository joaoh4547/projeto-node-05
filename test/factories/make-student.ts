import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import {
    Student,
    StudentProps,
} from "@/domain/forum/enterprise/entities/student";
import { PrismaStudentMapper } from "@/infra/database/prisma/mappers/prisma-student-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeStudent(
    override: Partial<StudentProps> = {},
    id?: UniqueEntityId,
): Student {
    const student = Student.create(
        {
            name: faker.person.fullName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            ...override,
        },
        id,
    );

    return student;
}

@Injectable()
export class StudentFactory {
    constructor(private readonly prismaService: PrismaService) {}

    async makePrismaStudent(
        data: Partial<StudentProps> = {},
    ): Promise<Student> {
        const student = makeStudent(data);
        await this.prismaService.user.create({
            data: PrismaStudentMapper.toPersistence(student),
        });
        return student;
    }
}
