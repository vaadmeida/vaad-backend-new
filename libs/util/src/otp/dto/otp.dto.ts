import { Otp } from '../models/otp.model';

export class OtpDto {
  code: number;
}

export type VerifyOtpByEmailDto = Pick<Otp, 'email' | 'code'>;

export enum OtpTypeEnum {
  SIGN_UP = 'SU',
  FORGET_PASSWORD = 'FP',
}
