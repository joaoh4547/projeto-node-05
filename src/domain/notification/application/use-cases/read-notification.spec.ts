import { UniqueEntityId } from "@/core/entities/value-objects/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { makeNotification } from "test/factories/make-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { ReadNotificationUseCase } from "./read-notification";

let notificationRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe("Read Notification Use Case", () => {

    beforeEach(() =>{
        notificationRepository = new InMemoryNotificationsRepository();
        sut = new ReadNotificationUseCase(notificationRepository);
    });

    it("should be able read a notification", async () => {
        const newNotification = makeNotification();
        await notificationRepository.create(newNotification);

        const result = await sut.handle({notificationId: newNotification.id.toString(),recipientId: newNotification.recipientId.toString()});

        expect(result.isRight()).toBe(true);
        expect(notificationRepository.notifications[0].readAt).toEqual(expect.any(Date));
    });

    it("should to not be able to read a notification from another user", async () => {
        const newNotification = makeNotification({
            recipientId: new  UniqueEntityId("1")
        });
        await notificationRepository.create(newNotification);

        const result = await sut.handle({notificationId: newNotification.id.toString(),recipientId: new UniqueEntityId("2").toString()});

        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(NotAllowedError);
    });

});
  