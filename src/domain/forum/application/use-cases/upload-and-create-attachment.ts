import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error";
import { Attachment } from "../../enterprise/entities/attachment";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { Uploader } from "../storage/uploader";

export interface UploadAndCreateAttachmentUseCaseInputParams {
    fileName: string;
    fileType: string;
    body: Buffer;
}

export type UploadAndCreateAttachmentUseCaseResult = Either<
    InvalidAttachmentTypeError,
    {
        attachment: Attachment;
    }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
    constructor(
        private attachmentsRepository: AttachmentsRepository,
        private uploader: Uploader,
    ) {}

    async handle({
        fileName,
        fileType,
        body,
    }: UploadAndCreateAttachmentUseCaseInputParams): Promise<UploadAndCreateAttachmentUseCaseResult> {
        if (!/^(image\/(png|jpe?g)|application\/pdf)$/.test(fileType)) {
            return left(new InvalidAttachmentTypeError(fileType));
        }

        const { url } = await this.uploader.upload({
            fileType,
            fileName,
            body,
        });

        const attachment = Attachment.create({
            title: fileName,
            url,
        });

        await this.attachmentsRepository.create(attachment);

        return right({ attachment });
    }
}
