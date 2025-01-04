import { ConflictException } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { hash } from "bcryptjs";
import { PrismaService } from "src/prisma/prisma.service";


@Controller("/accounts")
export class CreateAccountController {

    constructor(private readonly prismaService: PrismaService) {}  // inject prisma service here.


    @Post()
    async handle(@Body() body: any) {
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