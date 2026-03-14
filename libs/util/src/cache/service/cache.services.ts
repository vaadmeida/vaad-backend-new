import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { EnvConfigEnum } from '@app/util/config/env.enum';

@Injectable()
export class CacheService {
  static readonly defaultTTL = 1000 * 60 * 60 * 24;
  private client: Redis;
  private readonly logger = new Logger(CacheService.name);

  constructor(private readonly configService: ConfigService) {
    const redisInstance = new Redis(
      this.configService.getOrThrow<string>(EnvConfigEnum.REDIS_HOST),
    ).on('connect', () => {
      this.logger.debug('CONNECTED TO REDIS SERVER');
      this.client = redisInstance;
    });
  }
  getClient(): Redis {
    return this.client;
  }

  private async redisSet(
    key: string,
    value: any,
    ttl: number = CacheService.defaultTTL,
  ): Promise<'OK' | null> {
    return (await this.client.set(
      key,
      JSON.stringify(value),
      'EX',
      ttl,
    )) as 'OK';
  }

  private async redisGet<T = any>(key: string): Promise<T> {
    return JSON.parse((await this.client.get(key)) as string) as T;
  }

  private async redisDelete(key: string) {
    await this.client.del(key);
  }

  async set(key: string, value: any): Promise<void> {
    await this.redisSet(key, value);
  }

  async delete(key: string): Promise<void> {
    await Promise.all([this.redisDelete(key)]);
  }

  async get<T = any>(key: string): Promise<T> {
    const value = await this.redisGet<T>(key);

    if (!value) {
      throw new NotFoundException('Redis key not found');
    }

    return value;
  }

  async getOrThrowError<T>(key: string) {
    const data = await this.get<T>(key);
    if (!data) {
      throw new NotFoundException(`redis failed to get value for key: ${key}`);
    }
    return Promise.resolve<T>(data);
  }

  async setObject<T extends Record<string, string>>(
    key: string,
    value: T,
  ): Promise<void> {
    await this.redisSet(key, value);
  }

  async getOrLoad<T>(
    key: string,
    loader: any,
    ttl: number = CacheService.defaultTTL,
  ): Promise<T> {
    let value = await this.redisGet<T>(key);
    if (!value) {
      value = await loader();
      await this.redisSet(key, value, ttl);
    }

    return value;
  }
}
