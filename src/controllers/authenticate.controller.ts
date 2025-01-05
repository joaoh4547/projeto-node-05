import { Body, Controller, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { ZodValidationPipe } from "@/pipes/zod-validation.pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from "zod";



const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/sessions")
export class AuthenticateController {

    constructor(
        private readonly prismaService: PrismaService,
         private readonly jwt: JwtService
    ) { }  


    @Post()
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))  // apply zod validation pipe here.
    async handle(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body;

        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });
        
        if(!user){
            throw new UnauthorizedException("User credencial do not match");
        }

        const isMatchPassword = await compare(password, user.password);

        if(!isMatchPassword){
            throw new UnauthorizedException("User credencial do not match");
        }
        

        const accessToken = this.jwt.sign({ sub: user.id });

        return {
            access_token: accessToken
        };


    }
}