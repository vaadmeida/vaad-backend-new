import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Newsletter {
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ default: true })
  active: boolean;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
