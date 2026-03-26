import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class File {
  @Prop({ type: String })
  url: string;

  @Prop({ type: String })
  key: string;

  @Prop({ type: String })
  contentType: string;

  @Prop({ type: Boolean, select: false, default: false })
  deleted: boolean;
}

export const FileSchema = SchemaFactory.createForClass(File);
