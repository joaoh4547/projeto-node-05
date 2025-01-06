import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import {
    Student,
    StudentProps,
} from "@/domain/forum/enterprise/entities/student";
import { faker } from "@faker-js/faker";

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
