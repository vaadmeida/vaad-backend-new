import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Billboard } from 'src/billboard/schema/billboard.schema';

@Schema({ timestamps: false })
export class Cart {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Billboard', required: true })
  billboard: Billboard | string;

  @Prop()
  startDate: Date;

  @Prop()
  durationInMonths: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
