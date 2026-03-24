import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Blog' })
  blogId: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  message: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
