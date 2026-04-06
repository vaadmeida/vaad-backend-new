import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { PaymentStatusEnum } from '../enum/order.enum';
import { randomDigits } from '@app/util';
import { OrderItem } from './order-item.schema';

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ default: () => randomDigits(14) })
  reference: string;

  @Prop({ type: [OrderItem], required: true })
  orderItems: OrderItem[];

  @Prop()
  amount: number;

  @Prop({
    type: String,
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.INITIATED,
  })
  status: PaymentStatusEnum;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
