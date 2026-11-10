import { Model } from 'mongoose';
import { OrderService } from './order.service';
import { Order, OrderSchema } from '../schema/order.schema';
import { PaymentService } from './payment.service';
import { BillboardService } from 'src/billboard/service/billboard.service';
import { CreateOrderPaymentDTO } from '../dto/order.dto';
import { PaymentStatusEnum, PaymentType } from '../enum/payment.enum';
import { Booking } from '../schema/booking.schema';

jest.mock('src/billboard/service/billboard.service', () => ({
  BillboardService: class {},
}));

describe('Order payment routing', () => {
  const billboardId = '507f1f77bcf86cd799439011';
  const bankAccount = {
    reference: 'bank-transfer-reference',
    bankName: 'Test Bank',
    accountName: 'VAAD',
    accountNumber: '0123456789',
    expiresAt: new Date(Date.now() + 3600000),
  };

  it.each([PaymentType.PAY_LATER, PaymentType.INSTANT])(
    'persists payment instructions for %s',
    async (paymentType) => {
      const save = jest.fn().mockImplementation(function (this: Order) {
        return Promise.resolve(this);
      });
      const orderModel = jest
        .fn()
        .mockImplementation((data) => ({ ...data, save }));
      const payments = {
        initializeBankTransfer: jest.fn().mockResolvedValue(bankAccount),
        initializePayment: jest
          .fn()
          .mockResolvedValue('https://checkout.paystack.com/test'),
      };
      const billboards = {
        getBillboardsByIds: jest
          .fn()
          .mockResolvedValue([{ _id: billboardId, price: 100 }]),
      };
      const service = new OrderService(
        orderModel as unknown as Model<Order>,
        billboards as unknown as BillboardService,
        payments as unknown as PaymentService,
        {
          insertMany: jest.fn().mockImplementation(async (items) => items),
        } as unknown as Model<Booking>,
      );
      const order = await service.initiateOrderPayment(
        'user-id',
        {
          paymentType,
          orderItems: [{ billboardId, durationInMonths: 2 }],
        } as CreateOrderPaymentDTO,
        'user@example.com',
      );
      expect(order.totalAmount).toBe(200);
      expect(order.status).toBe(PaymentStatusEnum.PENDING);
      expect(save).toHaveBeenCalledTimes(
        paymentType === PaymentType.PAY_LATER ? 3 : 2,
      );
      expect(order.paymentLink).toBe('https://checkout.paystack.com/test');
      expect(payments.initializePayment).toHaveBeenCalledWith(
        'user@example.com',
        200,
        order.reference,
      );
      if (paymentType === PaymentType.PAY_LATER) {
        expect(order.bankAccount).toEqual(bankAccount);
        expect(payments.initializeBankTransfer).toHaveBeenCalledWith(
          'user@example.com',
          200,
          `${order.reference}-transfer`,
        );
      } else {
        expect(order.paymentLink).toBe('https://checkout.paystack.com/test');
        expect(order.bankAccount).toBeUndefined();
        expect(payments.initializeBankTransfer).not.toHaveBeenCalled();
      }
    },
  );

  it('stores bank accounts as a typed nested schema', () => {
    const path = OrderSchema.path('bankAccount');
    expect(path.schema?.path('accountNumber').instance).toBe('String');
    expect(path.schema?.path('expiresAt').instance).toBe('Date');
  });
});
