import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisChannelEnum } from '../enum/publsiher.enum';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from '../../config/env.enum';

@Injectable()
export class RedisPubSubService implements OnModuleDestroy {
  private logger = new Logger(RedisPubSubService.name);
  private publisher: Redis;
  private subscriber: Redis;

  constructor(private readonly configService: ConfigService) {
    // We need two separate connections: one for publishing, one for subscribing
    this.publisher = new Redis(
      this.configService.getOrThrow<string>(EnvConfigEnum.REDIS_URL),
    );
    this.subscriber = new Redis(
      this.configService.getOrThrow<string>(EnvConfigEnum.REDIS_URL),
    );

    this.publisher
      .on('connect', () => {
        this.logger.debug('REDIS PUBLISHER CONNECTED');
      })
      .on('error', (err) => {
        this.logger.error(`REDIS CONNECTION ERROR: ${err.message}`);
      });

    this.subscriber
      .on('connect', () => {
        this.logger.debug('REDIS SUBSCRIBER CONNECTED');
      })
      .on('error', (err) => {
        this.logger.error(`REDIS CONNECTION ERROR: ${err.message}`);
      });

    for (const channel of Object.values(RedisChannelEnum)) {
      this.subscriber.subscribe(channel);
    }
  }

  /**
   * Publish a typed message to a channel
   */
  private async publish<T>(
    channel: RedisChannelEnum,
    message: T,
  ): Promise<void> {
    const data = JSON.stringify(message);
    await this.publisher.publish(channel, data);
  }

  async publishProductView<T>(message: T): Promise<void> {
    this.logger.debug('Message received');
    await this.publish(RedisChannelEnum.PRODUCT_VIEW, message);
  }

  /**
   * Subscribe to a channel with a typed callback
   */
  private subscribe<T>(
    channel: RedisChannelEnum,
    callback: (data: T) => void,
  ): void {
    this.subscriber.on('message', (incomingChannel, message) => {
      if (incomingChannel === (channel as string)) {
        try {
          const parsed: T = JSON.parse(message);
          callback(parsed);
        } catch (error) {
          console.error(`Failed to parse message from ${channel}:`, error);
        }
      }
    });

    console.log(`[Redis] Subscribed to channel: ${channel}`);
  }

  /**
   * Subscribe to a channel with a typed callback
   */
  subscribeToProductView<T>(callback: (data: T) => void): void {
    this.subscribe(RedisChannelEnum.PRODUCT_VIEW, callback);
  }

  async onModuleDestroy() {
    console.log('Cleaning up Redis connections...');
    await this.subscriber.quit();
    await this.publisher.quit();
    console.log('Redis disconnected safely.');
  }
}
