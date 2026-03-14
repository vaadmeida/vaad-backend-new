import { Global, Module } from '@nestjs/common';
import { CacheService } from './service/cache.services';

@Global()
@Module({
  controllers: [],
  providers: [CacheService],
  exports: [CacheService],
})
export class CachingModule {}
