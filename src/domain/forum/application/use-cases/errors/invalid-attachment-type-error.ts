import { UseCaseError } from "@/core/errors/use-case-error";

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
    constructor(fileType: string) {
        super(`Invalid attachment type: ${fileType}`);
    }
}
