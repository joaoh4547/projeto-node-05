import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Env } from "@/infra/env";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            global: true,
            useFactory(config: ConfigService<Env, true>) {
                const privateKey = config.get("JWT_PRIVATE_KEY", {
                    infer: true,
                });
                const publicKey = config.get("JWT_PUBLIC_KEY", { infer: true });
                return {
                    privateKey: Buffer.from(privateKey, "base64"),
                    publicKey: Buffer.from(publicKey, "base64"),
                    signOptions: {
                        algorithm: "RS512",
                    },
                };
            },
        }),
    ],
    providers: [JwtStrategy],
    exports: [],
})
export class AuthModule {}
