import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RefreshTokenStorageService {
  constructor(private readonly redisService: RedisService) {}

  async insert(userId: number, tokenId: string): Promise<void> {
    const key = this.getKey(userId);
    await this.redisService.redisClient.set(key, tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const key = this.getKey(userId);
    const storedId = await this.redisService.redisClient.get(key);
    return storedId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redisService.redisClient.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
