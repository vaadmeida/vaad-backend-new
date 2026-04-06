import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ForgetPasswordDto,
  GenerateTokenDto,
  LoginDto,
  RefreshTokenDto,
  ResetPasswordDto,
  UserSingUpDto,
} from '../dto/user-auth.dto';
import { UsersService } from '../../users/service/users.service';
import {
  AuthService,
  base64Encode,
  randomDigits,
  Token,
} from '../../../libs/util/src';
import type { TokenDto } from '../../../libs/util/src/auth/dto/token.dto';
import mongoose from 'mongoose';
import { OtpService } from '../../../libs/util/src/otp/services/otp.service';
import { OtpTypeEnum } from '@app/util/otp/dto/otp.dto';
import { UserStatusEnum } from 'src/users/dto/user.dto';
import { RolesEnum } from '@app/util/auth/enum/roles.enum';
import { NotificationService } from 'src/notification/service/notification.service';
import { UserTemplateService } from '../service/user-template.service';
import type { Response } from 'express';
import { addCookieResponse } from '../helper/add-cookies.helper';

const role = RolesEnum.USER;

@ApiTags('User Auth')
@Controller('auth/users')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly FRONTEND_USER_BASEURL: string;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly otpService: OtpService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
    private readonly userTemplateService: UserTemplateService,
  ) {
    this.FRONTEND_USER_BASEURL = configService.getOrThrow(
      'FRONTEND_USER_BASEURL',
    );
  }

  @Post('sign-up')
  async userSignUp(@Body() { password, ...signUpData }: UserSingUpDto) {
    const session = await this.userService.UserModel.startSession();
    return session.withTransaction(async () => {
      const user = await this.userService.createUser(signUpData, session);

      await this.authService.signUp(user._id.toString(), password);

      const token = randomDigits(10);

      await this.otpService.hashAndSaveOtp({
        email: user.email,
        code: token,
        type: OtpTypeEnum.SIGN_UP,
      });

      //TODO send sign up email to user
      const encodedEmailData = base64Encode(
        JSON.stringify({ token, email: signUpData.email }),
      );

      const link = `${this.FRONTEND_USER_BASEURL}/auth/verify-email?data=${encodedEmailData}`;

      await this.notificationService.sendEmail({
        email: user.email,
        subject: 'Verify your email',
        template: this.userTemplateService.getSignUp(link),
      });

      return { profile: user };
    });
  }

  @Post('login')
  async login(
    @Res() response: Response,
    @Body() { password, email }: LoginDto,
  ) {
    try {
      const user = await this.userService.findOne({ email });
      const tokens = await this.authService.login(
        user._id.toString(),
        password,
        {
          email,
          role,
        },
      );

      if (user.status !== UserStatusEnum.ACTIVE) {
        throw new BadRequestException('User is not active');
      }

      addCookieResponse(response, tokens, { profile: user });
    } catch (error) {
      this.logger.warn(error);
      throw new UnauthorizedException('Email or password is not valid');
    }
  }

  @Post('/verify-email')
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

  @Post('/forget-password')
  async forgetPassword(@Body() { email }: ForgetPasswordDto) {
    try {
      const user = await this.userService.findOne({ email });
      const token = randomDigits(10);

      this.logger.debug(JSON.stringify({ token }));

      await this.otpService.hashAndSaveOtp({
        email: user.email,
        code: token,
        type: OtpTypeEnum.SIGN_UP,
      });

      //TODO send email to user

      // const emailData = { token, email };
      // const frontend = '';

      return { success: true };
    } catch (error) {
      this.logger.error(error.message);
      return;
    }
  }

  @Post('/generate-tokens')
  async generateTokens(
    @Res() response: Response,
    @Body() { token, email }: GenerateTokenDto,
  ) {
    try {
      await this.otpService.verifyHashedOtp({
        email,
        code: token,
        type: OtpTypeEnum.SIGN_UP,
      });
      const user = await this.userService.findOne({ email });
      user.status = UserStatusEnum.ACTIVE;
      await user.save();
      const tokens = await this.authService.generateTokens(
        user._id.toString(),
        {
          email,
          role,
        },
      );

      addCookieResponse(response, tokens, { profile: user });
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('/refresh-tokens')
  async refreshTokens(
    @Res() response: Response,
    @Body() { refreshToken }: RefreshTokenDto,
  ) {
    try {
      const { identifier, ...tokens } =
        await this.authService.refreshToken(refreshToken);

      const user = await this.userService.UserModel.findById(identifier);

      addCookieResponse(response, tokens, { profile: user });
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() { password }: ResetPasswordDto,
    @Token() { identifier }: TokenDto,
  ) {
    try {
      const user = await this.userService.findOne({ id: identifier });

      await this.authService.changePassword(user._id.toString(), password);

      return { success: true };
    } catch (error) {
      this.logger.error(error.message);
      return;
    }
  }
}
