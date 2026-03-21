import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class FavoriteBillboard {
  @Prop({ unique: true })
  userId: string;

  @Prop({ type: [String], default: [] })
  favorites: string[];
}

export const FavoriteBillboardSchema =
  SchemaFactory.createForClass(FavoriteBillboard);
