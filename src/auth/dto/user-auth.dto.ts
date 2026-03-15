import { PickType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserSingUpDto {
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsBoolean()
  termsAndCondition: boolean;
}

export class ForgetPasswordDto extends PickType(UserSingUpDto, ['email']) {}

export class ResetPasswordDto extends PickType(UserSingUpDto, ['password']) {}

export class GenerateTokenDto extends PickType(UserSingUpDto, ['email']) {
  @IsNotEmpty()
  @IsString()
  token: string;
}
