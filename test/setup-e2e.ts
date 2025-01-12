import { DomainEvents } from "@/core/events/domain-events";
import { envSchema } from "@/infra/env/env";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { Redis } from "ioredis";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });
const prisma = new PrismaClient();

const env = envSchema.parse(process.env);

const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: env.REDIS_DB,
});

const schemaId = randomUUID();

function generateUniqueDatabaseURL(schemaId: string) {
    if (!env.DATABASE_URL) {
        throw new Error("DATABASE_URL not found in environment variables");
    }
    const url = new URL(env.DATABASE_URL);
    url.searchParams.set("schema", schemaId);
    return url.toString();
}

beforeAll(async () => {
    const databaseUrl = generateUniqueDatabaseURL(schemaId);
    process.env.DATABASE_URL = databaseUrl;
    DomainEvents.shouldRun = false;
    await redis.flushdb();
    execSync("pnpm prisma migrate deploy");
});

afterAll(async () => {
    await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
    );
    await prisma.$disconnect();
});
