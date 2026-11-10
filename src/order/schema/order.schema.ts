import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { randomDigits } from '@app/util';
import { PaymentStatusEnum, PaymentType } from '../enum/payment.enum';
import { Booking } from '../schema/booking.schema';

@Schema({ _id: false })
export class OrderBankAccount {
  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  accountName: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const OrderBankAccountSchema =
  SchemaFactory.createForClass(OrderBankAccount);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ default: () => randomDigits(14, 'INV-') })
  reference: string;

  @Prop({ default: () => randomDigits(4, 'VAAD-BK-') })
  bookingRef: string;

  @Prop({ type: [Booking], required: true })
  bookings: Booking[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop()
  coupon: string;

  @Prop()
  discount: string;

  @Prop()
  paymentLink: string;

  @Prop({ type: OrderBankAccountSchema })
  bankAccount?: OrderBankAccount;

  @Prop({
    type: String,
    enum: PaymentType,
    required: true,
  })
  paymentType: PaymentType;

  @Prop({
    type: String,
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.INITIATED,
  })
  status: PaymentStatusEnum;

  @Prop()
  brandName: string;

  @Prop()
  industry: string;

  @Prop()
  campaignObjective: string;

  @Prop()
  additionalInfo: string;

  @Prop({ type: [String] })
  documents: string[];

  @Prop()
  couponCode: string;

  @Prop()
  acceptTermsAndConditions: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
