import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OtpTypeEnum } from '../dto/otp.dto';

@Schema({ timestamps: true })
export class Otp {
  @Prop({ index: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, enum: OtpTypeEnum })
  type: OtpTypeEnum;

  @Prop({ required: true })
  code: string;

  @Prop()
  expirationDate: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
