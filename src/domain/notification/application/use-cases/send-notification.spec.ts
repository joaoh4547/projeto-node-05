import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SendNotificationUseCase } from "./send-notification";

let notificationRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("Send Notification Use Case", () => {

    beforeEach(() =>{
        notificationRepository = new InMemoryNotificationsRepository();
        sut = new SendNotificationUseCase(notificationRepository);
    });

    it("should be able read a notification", async () => {
        const result = await sut.handle({
            recipientId: "1",
            content: "content",
            title: "title"
        });

        expect(result.isRight()).toBe(true);
        expect(notificationRepository.notifications[0]).toEqual(result.value?.notification);
    });

});
  