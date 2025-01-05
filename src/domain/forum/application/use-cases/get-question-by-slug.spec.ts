import { makeQuestion } from "test/factories/make-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

let questionsRepository: InMemoryQuestionsRepository;
let sut : GetQuestionBySlugUseCase;

describe("Get Question By Slug Use Case", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository(new InMemoryQuestionAttachmentsRepository());
        sut = new GetQuestionBySlugUseCase(questionsRepository);
    });

    it("should be able to get a question by its slug", async () => {
        const createQuestion = makeQuestion({
            slug: Slug.create("title-test")
        });
        await  questionsRepository.create(createQuestion);
        
        const result = await sut.handle({slug: "title-test"});

        expect(result.isRight()).toBe(true);
        expect(result.value).toMatchObject({
            question: expect.objectContaining({
                title: createQuestion.title
            })
        });
    });
});