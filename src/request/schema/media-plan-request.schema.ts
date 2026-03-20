import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class MediaPlanRequest {
  @Prop()
  name: string;

  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  companyName: string;

  @Prop()
  location: string;

  @Prop()
  budget: number;

  @Prop()
  preferredTimeToCall: string;

  @Prop()
  interest: string;
}

export const MediaPlanRequestSchema =
  SchemaFactory.createForClass(MediaPlanRequest);
