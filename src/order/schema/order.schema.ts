import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Billboard } from 'src/billboard/schema/billboard.schema';
import { MediaPartner } from 'src/media-partner/schema/media-partner.schema';
import { OrderStatusEnum } from '../enum/order.enum';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Billboard' })
  billboard: Billboard;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'MediaPartner' })
  mediaPartner: MediaPartner;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({
    type: String,
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  status: OrderStatusEnum;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
