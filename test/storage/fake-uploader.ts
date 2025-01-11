import {
    Uploader,
    UploadParams,
} from "@/domain/forum/application/storage/uploader";
import { randomUUID } from "node:crypto";

interface Upload {
    fileName: string;
    url: string;
}
export class FakeUploader implements Uploader {
    uploads: Upload[] = [];

    async upload({ fileName, fileType, body }: UploadParams) {
        const url = randomUUID();
        this.uploads.push({ fileName, url });
        return { url };
    }
}
