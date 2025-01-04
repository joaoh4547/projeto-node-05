import { Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";

@Controller("api/hello")
export class AppController {
    constructor(private appService: AppService, private prismaService: PrismaService) { }

    @Get("")
    getHello(): string {
        return this.appService.getHello();
    }

    @Post()
    async postHello() {
        return await this.prismaService.user.findMany();
    }
}
