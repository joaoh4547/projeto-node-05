import { StudentRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";

export class InMemoryStudentRepository implements StudentRepository {
    students: Student[] = [];
    async findByEmail(email: string) {
        return this.students.find((s) => s.email === email) || null;
    }

    async create(student: Student) {
        this.students.push(student);
    }
}
