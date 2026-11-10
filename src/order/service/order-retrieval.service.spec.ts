import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { BillboardService } from 'src/billboard/service/billboard.service';
import { PaymentType } from '../enum/payment.enum';
import { Order } from '../schema/order.schema';
import { Booking } from '../schema/booking.schema';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';

jest.mock('src/billboard/service/billboard.service', () => ({
  BillboardService: class {},
}));

describe('Order retrieval', () => {
  const userId = '507f1f77bcf86cd799439011';
  const id = '507f1f77bcf86cd799439012';
  let service: OrderService;
  let model: { find: jest.Mock; findOne: jest.Mock };
  let exec: jest.Mock;
  let sort: jest.Mock;

  beforeEach(() => {
    exec = jest.fn();
    sort = jest.fn().mockReturnValue({ exec });
    model = {
      find: jest.fn().mockReturnValue({ sort }),
      findOne: jest.fn().mockReturnValue({ exec }),
    };
    service = new OrderService(
      model as unknown as Model<Order>,
      {} as BillboardService,
      {} as PaymentService,
      {} as Model<Booking>,
    );
  });

  it('filters pay-later orders by owner and sorts newest first', async () => {
    const orders = [{ _id: id, userId, paymentType: PaymentType.PAY_LATER }];
    exec.mockResolvedValue(orders);
    expect(await service.getPayLaterOrders(userId)).toEqual(orders);
    expect(model.find).toHaveBeenCalledWith({
      userId,
      paymentType: PaymentType.PAY_LATER,
    });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1, _id: -1 });
  });

  it('returns an empty list when no pay-later orders match', async () => {
    exec.mockResolvedValue([]);
    expect(await service.getPayLaterOrders(userId)).toEqual([]);
  });

  it('retrieves an order of any payment type belonging to the user', async () => {
    const order = { _id: id, userId, paymentType: PaymentType.INSTANT };
    exec.mockResolvedValue(order);
    expect(await service.getOrderById(id, userId)).toEqual(order);
    expect(model.findOne).toHaveBeenCalledWith({ _id: id, userId });
  });

  it('rejects invalid IDs before querying the database', async () => {
    await expect(service.getOrderById('invalid', userId)).rejects.toThrow(
      BadRequestException,
    );
    expect(model.findOne).not.toHaveBeenCalled();
  });

  it('returns not found when the ID does not match an order owned by the user', async () => {
    exec.mockResolvedValue(null);
    await expect(service.getOrderById(id, userId)).rejects.toThrow(
      NotFoundException,
    );
    expect(model.findOne).toHaveBeenCalledWith({ _id: id, userId });
  });
});
