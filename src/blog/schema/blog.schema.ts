import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  image: string;

  @Prop({ required: true, index: 'text' })
  headline: string;

  @Prop({ required: true, index: 'text' })
  subHeadline: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ required: true, index: 'text' })
  body: string;

  @Prop({ default: 0 })
  views: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
