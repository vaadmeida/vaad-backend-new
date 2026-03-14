import { Global, Module } from '@nestjs/common';
import { RedisPubSubService } from './service/pub-sub.service';

@Global()
@Module({
  providers: [RedisPubSubService],
  exports: [RedisPubSubService],
})
export class RedisPubSubModule {}
