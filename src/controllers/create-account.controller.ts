import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";



const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller("/accounts")
export class CreateAccountController {

    constructor(private readonly prismaService: PrismaService) {}  // inject prisma service here.


    @Post()
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))  // apply zod validation pipe here.
    async handle(@Body() body: CreateAccountBodySchema) {
        const {name,email,password} = body;
        
        const userWithSameEmail = await this.prismaService.user.findUnique({
            where:{
                email
            }
        });

        if(userWithSameEmail){
            throw new ConflictException("User with same email already exists");
        }

        const hashedPassword = await hash(password, 8);

        return  await this.prismaService.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        console.log(body);


    }

}