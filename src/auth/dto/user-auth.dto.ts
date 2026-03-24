import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserSingUpDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'A strong password for the user',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'The phone number of the user',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    example: true,
    description: 'Whether the user accepts terms and conditions',
  })
  @IsNotEmpty()
  @IsBoolean()
  termsAndCondition: boolean;
}

export class ForgetPasswordDto extends PickType(UserSingUpDto, [
  'email',
] as const) {}

export class ResetPasswordDto extends PickType(UserSingUpDto, [
  'password',
] as const) {}

export class GenerateTokenDto extends PickType(UserSingUpDto, [
  'email',
] as const) {
  @ApiProperty({
    example: '123456',
    description: 'The OTP token sent to the user email',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'A strong password for the user',
  })
  @IsString()
  password: string;
}

export class MediaPartnerSingUpDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'A strong password for the user',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: 'Epe' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Nigeria' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'John Doe Enterprises' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: 'https://example.com/logo.png' })
  @IsString()
  @IsNotEmpty()
  logo: string;

  @ApiProperty({
    example: true,
    description: 'Whether the user accepts terms and conditions',
  })
  @IsNotEmpty()
  @IsBoolean()
  termsAndCondition: boolean;
}
