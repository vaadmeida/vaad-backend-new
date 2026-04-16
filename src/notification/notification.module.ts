import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { NotificationController } from './controller/notification.controller';
import { SesService } from './service/ses.service';
import { EmailProcessor } from './processor/email.processor';

@Module({
  exports: [NotificationService],
  controllers: [NotificationController],
  providers: [NotificationService, SesService, EmailProcessor],
})
export class NotificationModule {}
