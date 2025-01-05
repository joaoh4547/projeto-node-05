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
import { OnAnswerCreated } from "./on-answer-created";
import { MockInstance } from "vitest";

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

describe("On Answer Created", () => {
    beforeEach(() => {
        questionsRepository = new InMemoryQuestionsRepository(
            new InMemoryQuestionAttachmentsRepository(),
        );
        answersRepository = new InMemoryAnswersRepository(
            new InMemoryAnswerAttachmentsRepository(),
        );
        notificationsRepository = new InMemoryNotificationsRepository();
        sendNotification = new SendNotificationUseCase(notificationsRepository);

        sendNotificationSpy = vi.spyOn(sendNotification, "handle");

        new OnAnswerCreated(questionsRepository, sendNotification);
    });

    it("should send a notification when an answer is created", async () => {
        const question = makeQuestion();
        const answer = makeAnswer({
            questionId: question.id,
        });
        questionsRepository.create(question);
        answersRepository.create(answer);

        await waitFor(() => {
            expect(sendNotificationSpy).toHaveBeenCalled();
        });
    });
});
