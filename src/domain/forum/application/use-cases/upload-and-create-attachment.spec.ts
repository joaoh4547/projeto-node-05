import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";

let attachmentsRepository: InMemoryAttachmentsRepository;
let sut: UploadAndCreateAttachmentUseCase;
let uploader: FakeUploader;

describe("Upload and create attachment", () => {
    beforeEach(() => {
        attachmentsRepository = new InMemoryAttachmentsRepository();
        uploader = new FakeUploader();
        sut = new UploadAndCreateAttachmentUseCase(
            attachmentsRepository,
            uploader,
        );
    });

    it("should be able to upload and create an attachment", async () => {
        const result = await sut.handle({
            fileName: "sample-upload.jpg",
            fileType: "image/jpg",
            body: Buffer.from("sample-image-data"),
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            attachment: attachmentsRepository.attachments[0],
        });
        expect(uploader.uploads).toHaveLength(1);
        expect(uploader.uploads[0]).toEqual(
            expect.objectContaining({
                fileName: "sample-upload.jpg",
            }),
        );
    });

    it("should not be able to upload attachment with invalid file type", async () => {
        const result = await sut.handle({
            fileName: "sample-upload.mp3",
            fileType: "audio/mp3",
            body: Buffer.from("sample-upload-audio-data"),
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
    });
});
