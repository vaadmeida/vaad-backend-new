import {
  Body,
  Controller,
  Logger,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ForgetPasswordDto,
  GenerateTokenDto,
  ResetPasswordDto,
  UserSingUpDto,
} from '../dto/user-auth.dto';
import { UsersService } from '../../users/service/users.service';
import { AuthService, randomDigits, Token } from '../../../libs/util/src';
import type { TokenDto } from '../../../libs/util/src/auth/dto/token.dto';
import mongoose from 'mongoose';
import { OtpService } from '../../../libs/util/src/otp/services/otp.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  @Post('user/sign-up')
  async userSignUp(@Body() { password, ...signUpData }: UserSingUpDto) {
    const session = await mongoose.startSession();
    return session.withTransaction(async () => {
      const user = await this.userService.createUser(signUpData, session);

      const tokens = await this.authService.signUp(
        user._id.toString(),
        password,
      );

      return { profile: user, ...tokens };
    });
  }

  @Post('user/verify-email')
  async verifySignUpEmail(@Body() { password, ...signUpData }: UserSingUpDto) {
    const session = await mongoose.startSession();
    return session.withTransaction(async () => {
      const user = await this.userService.createUser(signUpData, session);

      const tokens = await this.authService.signUp(
        user._id.toString(),
        password,
      );

      return { profile: user, ...tokens };
    });
  }

  @Post('user/forget-passwprd')
  async forgetPassword(@Body() { email }: ForgetPasswordDto) {
    try {
      const user = await this.userService.findOneUser(email);
      const token = randomDigits(10);

      this.logger.debug(JSON.stringify({ token }));

      await this.otpService.hashAndSaveOtp({ email: user.email, code: token });

      //TODO send email to user
    } catch (error) {
      this.logger.error(error.message);
      return;
    }
  }

  @Post('/generate-tokens')
  async generateTokens(@Body() { token, email }: GenerateTokenDto) {
    try {
      await this.otpService.verifyHashedOtp({ email, code: token });

      return this.authService.generateTokens(email, {});
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('user/reset-passwprd')
  async resetPassword(
    @Body() { password }: ResetPasswordDto,
    @Token() { identifier }: TokenDto,
  ) {
    try {
      const user = await this.userService.findOneUser(identifier);

      await this.authService.changePassword(user._id.toString(), password);

      //TODO send email to user
    } catch (error) {
      this.logger.error(error.message);
      return;
    }
  }
}
