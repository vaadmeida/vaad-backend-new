import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { NotificationController } from './controller/notification.controller';
import { SesService } from './service/ses.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './processor/email.processor';
import { EmailSecondProcessor } from './processor/second-email.processor';
import { RedisOptions } from 'ioredis';

const connection: RedisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
};

@Module({
  exports: [NotificationService],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    SesService,
    EmailSecondProcessor,
    EmailProcessor,
  ],
  imports: [
    BullModule.registerQueue(
      {
        name: 'EMAIL_QUEUE',
        connection,
      },
      {
        name: 'IN_APP_MESSAGE_QUEUE',
        connection,
      },
    ),
  ],
})
export class NotificationModule {}
