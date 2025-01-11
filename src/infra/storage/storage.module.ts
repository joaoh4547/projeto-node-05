import { Uploader } from "@/domain/forum/application/storage/uploader";
import { Module } from "@nestjs/common";
import { MinioStorage } from "./minio-storage";
import { EnvModule } from "../env/env.module";

@Module({
    imports: [EnvModule],
    providers: [
        {
            provide: Uploader,
            useClass: MinioStorage,
        },
    ],
    exports: [Uploader],
})
export class StorageModule {}
