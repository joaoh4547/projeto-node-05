import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma/prisma.service";
import { CreateAccountController } from "./controllers/create-account.controller";
import { envSchema } from "./env";

@Module({
    controllers: [CreateAccountController],
    providers: [ PrismaService],
    imports: [ConfigModule.forRoot({
        validate: obj => envSchema.parse(obj),
        isGlobal: true,
    })]
})
export class AppModule {

}
