import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Env } from "@/infra/env";
import { z } from "zod";

const tokenSchema = z.object({
    sub: z.string().uuid(),
});

export type UserPayload = z.infer<typeof tokenSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly config: ConfigService<Env, true>) {
        const publicKey = config.get("JWT_PUBLIC_KEY", { infer: true });
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(publicKey, "base64"),
            algorithms: ["RS512"],
        });
    }

    async validate(payload: UserPayload) {
        return tokenSchema.parse(payload);
    }
}