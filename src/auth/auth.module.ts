import { Module } from '@nestjs/common';
import { AuthController } from './controller/user-auth.controller';
import { UsersModule } from '../users/users.module';
import { OtpModule } from '../../libs/util/src/otp/otp.module';
import { MediaAuthController } from './controller/media-partner-auth.controller';
import { MediaPartnerModule } from 'src/media-partner/media-partner.module';

@Module({
  controllers: [AuthController, MediaAuthController],
  imports: [UsersModule, OtpModule, MediaPartnerModule],
})
export class AuthModule {}
