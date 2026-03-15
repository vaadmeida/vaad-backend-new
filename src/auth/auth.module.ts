import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from '../users/users.module';
import { OtpModule } from '../../libs/util/src/otp/otp.module';

@Module({
  controllers: [AuthController],
  imports: [UsersModule, OtpModule],
})
export class AuthModule {}
