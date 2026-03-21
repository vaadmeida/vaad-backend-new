import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ConsultationRequest {
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ default: false })
  replied: boolean;
}

export const ConsultationRequestSchema =
  SchemaFactory.createForClass(ConsultationRequest);
