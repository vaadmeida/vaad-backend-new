import { Module } from '@nestjs/common';
import { AuthController } from './controller/user-auth.controller';
import { UsersModule } from '../users/users.module';
import { OtpModule } from '../../libs/util/src/otp/otp.module';
import { MediaAuthController } from './controller/media-partner-auth.controller';
import { MediaPartnerModule } from 'src/media-partner/media-partner.module';
import { AdminAuthController } from './controller/auth-admin.controller';
import { AdminModule } from 'src/admin/admin.module';
import { NotificationModule } from 'src/notification/notification.module';
import { UserTemplateService } from './service/user-template.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  providers: [UserTemplateService],
  controllers: [AuthController, MediaAuthController, AdminAuthController],
  imports: [
    BullModule.registerQueue({
      // configKey: 'alternative-config',
      name: 'EMAIL_QUEUE',
    }),
    UsersModule,
    OtpModule,
    MediaPartnerModule,
    AdminModule,
    NotificationModule,
  ],
})
export class AuthModule {}
