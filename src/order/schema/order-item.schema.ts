import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Billboard } from 'src/billboard/schema/billboard.schema';

@Schema({ timestamps: false })
export class OrderItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Billboard' })
  billboard: Billboard | string;

  @Prop()
  startDate: Date;

  @Prop()
  durationInMonths: number;
}
