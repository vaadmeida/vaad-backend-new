import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../schema/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly OrderModel: Model<Order>,
  ) {}

  createOrder(payload: Partial<Order>) {
    return this.OrderModel.create(payload);
  }
}
