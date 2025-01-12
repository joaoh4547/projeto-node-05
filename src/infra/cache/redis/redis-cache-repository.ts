import { Injectable } from "@nestjs/common";
import { CacheRepository } from "../cache-repository";
import { RedisService } from "./redis.service";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
    constructor(private redisService: RedisService) {}

    async set(key: string, value: string) {
        await this.redisService.set(key, value, "EX", 60 * 15);
    }

    async get(key: string) {
        return await this.redisService.get(key);
    }

    async delete(key: string) {
        await this.redisService.del(key);
    }
}
