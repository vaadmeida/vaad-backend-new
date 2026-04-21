import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuthController } from './controller/user-auth.controller';
import { UsersModule } from '../users/users.module';
import { OtpModule } from '../../libs/util/src/otp/otp.module';
import { MediaAuthController } from './controller/media-partner-auth.controller';
import { MediaPartnerModule } from 'src/media-partner/media-partner.module';
import { AdminAuthController } from './controller/auth-admin.controller';
import { AdminModule } from 'src/admin/admin.module';
import { NotificationModule } from 'src/notification/notification.module';
import { UserTemplateService } from './service/user-template.service';
import { FileModule } from 'src/file/file.module';

@Module({
  providers: [UserTemplateService],
  controllers: [AuthController, MediaAuthController, AdminAuthController],
  imports: [
    BullModule.registerQueue({
      name: 'EMAIL_QUEUE',
    }),
    UsersModule,
    OtpModule,
    MediaPartnerModule,
    AdminModule,
    NotificationModule,
    FileModule,
  ],
})
export class AuthModule {}
