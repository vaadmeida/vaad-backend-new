import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class ContactUs {
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  replied: boolean;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
