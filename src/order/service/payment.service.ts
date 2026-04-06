import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from '../schema/payment.schema';
import { OrderItem } from '../schema/order-item.schema';
import { BillboardService } from 'src/billboard/service/billboard.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private readonly PaymentModel: Model<Payment>,
    private readonly billboardService: BillboardService,
  ) {}

  async initiateOrderPayment(userId: string, orderItems: OrderItem[]) {
    const payment = new this.PaymentModel({ orderItems, userId });

    const billboardIds = orderItems.map((item) => item.billboard as string);

    const billboards =
      await this.billboardService.getBillboardsByIds(billboardIds);

    let amount = 0;

    for (const item of orderItems) {
      const billboard = billboards.find(
        (b) => b._id.toString() === (item.billboard as string),
      );
      amount += (billboard?.rate || 0) * item.durationInMonths;
    }

    payment.amount = amount;

    return payment.save();
  }
}
