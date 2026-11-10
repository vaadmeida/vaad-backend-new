import { randomDigits } from '@app/util/general/function/random.function';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Billboard } from 'src/billboard/schema/billboard.schema';
import { MediaPartner } from 'src/media-partner/schema/media-partner.schema';
import { OrderStatusEnum } from '../enum/order.enum';

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: String, enum: OrderStatusEnum, default: OrderStatusEnum.PENDING })
  status: OrderStatusEnum;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Billboard' })
  billboard: Billboard | string;

  @Prop({ default: () => randomDigits(14, 'ORD-') })
  reference: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Order' })
  order: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  user: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'MediaPartner' })
  mediaPartner: MediaPartner;

  @Prop()
  startDate: Date;

  @Prop()
  durationInMonths: number;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.index({ createdAt: 1 });
