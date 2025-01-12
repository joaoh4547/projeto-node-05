import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { makeAnswer } from "test/factories/make-answers";
import { makeQuestion } from "test/factories/make-questions";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { waitFor } from "test/utils/wait-for";
import { NotificationsRepository } from "../repositories/notifications-repository";
import {
    SendNotificationUseCase,
    SendNotificationUseCaseInputParams,
    SendNotificationUseCaseResult,
} from "../use-cases/send-notification";
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";
import { MockInstance } from "vitest";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentRepository } from "test/repositories/in-memory-students-repository";

let questionsRepository: QuestionsRepository;
let answersRepository: InMemoryAnswersRepository;
let sendNotification: SendNotificationUseCase;
let notificationsRepository: NotificationsRepository;

let sendNotificationSpy: MockInstance<
    ({
        recipientId,
        content,
        title,
    }: SendNotificationUseCaseInputParams) => Promise<SendNotificationUseCaseResult>
>;

describe("On Question Best Answer Chosen", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository(
            new InMemoryQuestionAttachmentsRepository(),
            new InMemoryAttachmentsRepository(),
            new InMemoryStudentRepository(),
        );
        answersRepository = new InMemoryAnswersRepository(
            new InMemoryAnswerAttachmentsRepository(),
        );
        notificationsRepository = new InMemoryNotificationsRepository();
        sendNotification = new SendNotificationUseCase(notificationsRepository);

        sendNotificationSpy = vi.spyOn(sendNotification, "handle");

        new OnQuestionBestAnswerChosen(answersRepository, sendNotification);
    });

    it("should send a notification when an question has best answer", async () => {
        const question = makeQuestion();
        const answer = makeAnswer({
            questionId: question.id,
        });
        questionsRepository.create(question);
        answersRepository.create(answer);

        question.bestAnswerId = answer.id;

        questionsRepository.save(question);

        await waitFor(() => {
            expect(sendNotificationSpy).toHaveBeenCalled();
        });
    });
});
