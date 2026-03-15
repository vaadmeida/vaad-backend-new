import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Otp {
  @Prop({ index: true })
  email: string;

  @Prop()
  code: string;

  @Prop()
  expirationDate: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
