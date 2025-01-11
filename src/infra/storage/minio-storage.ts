import {
    Uploader,
    UploadParams,
} from "@/domain/forum/application/storage/uploader";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { EnvService } from "../env/env.service";
import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MinioStorage implements Uploader {
    private client: S3Client;

    constructor(private envService: EnvService) {
        this.client = new S3Client({
            endpoint: envService.get("AWS_BUCKET_URL"),
            credentials: {
                accessKeyId: envService.get("AWS_ACCESS_KEY_ID"),
                secretAccessKey: envService.get("AWS_SECRET_ACCESS_KEY"),
            },
        });
    }

    async upload({ body, fileName, fileType }: UploadParams) {
        const uploadId = randomUUID();

        const uniqueFileName = `${uploadId}-${fileName}`;

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.envService.get("AWS_BUCKET_NAME"),
                Key: uniqueFileName,
                ContentType: fileType,
                Body: body,
            }),
        );

        return {
            url: uniqueFileName,
        };
    }
}
