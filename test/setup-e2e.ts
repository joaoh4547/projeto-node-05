import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

const schemaId = randomUUID();

function generateUniqueDatabaseURL(schemaId : string){
    if(!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL not found in environment variables");
    }
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set("schema", schemaId);
    return url.toString();
}

beforeAll(async () =>{
    const databaseUrl = generateUniqueDatabaseURL(schemaId);
    process.env.DATABASE_URL = databaseUrl;
    execSync("pnpm prisma migrate deploy");
});

afterAll(async () =>{
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
    await prisma.$disconnect();
});