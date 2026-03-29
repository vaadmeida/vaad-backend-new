import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { NotificationController } from './controller/notification.controller';
import { SesService } from './service/ses.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './processor/email.processor';
import { EmailSecondProcessor } from './processor/second-email.processor';

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
        connection: { host: 'localhost', port: 6379 },
      },
      {
        name: 'IN_APP_MESSAGE_QUEUE',
        connection: { host: 'localhost', port: 6379 },
      },
    ),
  ],
})
export class NotificationModule {}
