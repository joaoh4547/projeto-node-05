import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";



const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/sessions")
export class AuthenticateController {

    constructor(private readonly prismaService: PrismaService, private jwt: JwtService) { }  // inject prisma service here.


    @Post()
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))  // apply zod validation pipe here.
    async handle(
        @Body() body: AuthenticateBodySchema
    ) {
        const { email, password } = body;

        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        const token = this.jwt.sign({ sub: "user-id" });

        return token;


    }
}