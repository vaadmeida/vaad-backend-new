import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Otp } from '../models/otp.model';
import { hash, verifyHash } from '../../general/function/password.function';
import { EnvConfigEnum } from '../../config/env.enum';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectModel(Otp.name)
    private readonly otpModel: Model<Otp>,
    private readonly configService: ConfigService,
  ) {}

  async hashAndSaveOtp(
    { email, code, type }: Pick<Otp, 'email' | 'code' | 'type'>,
    expireInMin?: number,
    session?: ClientSession,
  ) {
    const [hashCode] = await Promise.all([
      hash(code),
      this.otpModel.deleteMany({ email }, { session }),
    ]);

    const payload: Partial<Otp> = {
      email,
      type,
      code: hashCode,
    };

    if (expireInMin) {
      const date = new Date();
      payload.expirationDate = new Date(date.getTime() + expireInMin * 60000);
    }

    return this.otpModel.create([payload], { session });
  }

  async verifyHashedOtp(
    { email, code, type }: Pick<Otp, 'email' | 'code' | 'type'>,
    canExpire = true,
  ) {
    const foundCode = await this.otpModel
      .findOne({ email, type })
      .sort({ createdAt: -1 });

    if (!foundCode) {
      throw new NotFoundException(`no OTP is associated with ${email}`);
    }

    if (canExpire) {
      const expiryTime = new Date(foundCode.expirationDate).getTime();
      const currentTime = new Date().getTime();

      if (currentTime > expiryTime) {
        await this.otpModel.deleteMany({ email });
        throw new BadRequestException(
          'OTP has expired, please generate a new one',
        );
      }
    }
    const isValid = await verifyHash(foundCode.code, code);
    if (!isValid) {
      await this.otpModel.deleteMany({ email });
      throw new BadRequestException('invalid OTP, please generate a new one');
    }
    await this.otpModel.deleteMany({ email });
    return isValid;
  }

  voidForProductionEnv(value: any) {
    this.logger.debug({
      environment: this.configService.getOrThrow(EnvConfigEnum.NODE_ENV),
    });
    const code =
      this.configService.getOrThrow(EnvConfigEnum.NODE_ENV) === 'production'
        ? undefined
        : value;

    return code;
  }
}
