import { Module } from '@nestjs/common';
import { UtilService } from './util.service';
import { CachingModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { RedisPubSubModule } from './redis-pub-sub/redis-pub-sub.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

@Module({
  providers: [UtilService],
  exports: [UtilService],
  imports: [
    AuthModule,
    DatabaseModule,
    CachingModule,
    RedisPubSubModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: config.getOrThrow('THROTTLE_TTL'),
            limit: config.getOrThrow('THROTTLE_LIMIT'),
          },
        ],
        storage: new ThrottlerStorageRedisService(
          config.getOrThrow('REDIS_HOST'),
        ),
      }),
    }),
  ],
})
export class UtilModule {}
