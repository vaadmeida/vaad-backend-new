import { ForbiddenException } from '@nestjs/common';
import { Model } from 'mongoose';
import { RolesEnum } from '@app/util/auth/enum/roles.enum';
import { TokenDto } from '@app/util/auth/dto/token.dto';
import { BillboardService } from 'src/billboard/service/billboard.service';
import { AdminOrderController } from '../controller/admin-order.controller';
import { Booking } from '../schema/booking.schema';
import { Order } from '../schema/order.schema';
import { OrderService } from './order.service';
import { PaymentService } from './payment.service';

jest.mock('src/billboard/service/billboard.service', () => ({
  BillboardService: class {},
}));

describe('Weekly booking comparison', () => {
  let countDocuments: jest.Mock;
  let service: OrderService;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-10T12:00:00Z'));
    countDocuments = jest.fn();
    service = new OrderService(
      {} as Model<Order>,
      {} as BillboardService,
      {} as PaymentService,
      { countDocuments } as unknown as Model<Booking>,
    );
  });

  afterEach(() => jest.useRealTimers());

  it.each([
    [15, 10, 5, 50],
    [5, 10, -5, -50],
    [0, 0, 0, 0],
    [3, 0, 3, null],
    [0, 10, -10, -100],
  ])(
    'compares %i bookings with %i previous bookings',
    async (current, previous, difference, percentageChange) => {
      countDocuments
        .mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(current) })
        .mockReturnValueOnce({ exec: jest.fn().mockResolvedValue(previous) });
      expect(await service.getWeeklyBookingComparison()).toMatchObject({
        thisWeek: { total: current },
        lastWeek: { total: previous },
        difference,
        percentageChange,
      });
      expect(countDocuments.mock.calls).toEqual([
        [
          {
            createdAt: {
              $gte: new Date('2026-11-08T23:00:00Z'),
              $lt: new Date('2026-11-10T12:00:00Z'),
            },
          },
        ],
        [
          {
            createdAt: {
              $gte: new Date('2026-11-01T23:00:00Z'),
              $lt: new Date('2026-11-08T23:00:00Z'),
            },
          },
        ],
      ]);
    },
  );

  it('uses the new week at Monday midnight in Lagos across a year boundary', async () => {
    jest.setSystemTime(new Date('2027-01-03T23:00:00Z'));
    countDocuments.mockReturnValue({ exec: jest.fn().mockResolvedValue(0) });
    const result = await service.getWeeklyBookingComparison();
    expect(result.thisWeek.start).toEqual(new Date('2027-01-03T23:00:00Z'));
    expect(result.lastWeek.start).toEqual(new Date('2026-12-27T23:00:00Z'));
    expect(result.thisWeek.end).toEqual(result.thisWeek.start);
  });

  it('allows admins and rejects other roles before querying', async () => {
    const controller = new AdminOrderController(service);
    const analytics = jest
      .spyOn(service, 'getWeeklyBookingComparison')
      .mockResolvedValue({} as never);
    for (const role of [RolesEnum.USER, RolesEnum.MEDIA_PARTNER, undefined]) {
      expect(() =>
        controller.getWeeklyBookingComparison({ data: { role } } as TokenDto),
      ).toThrow(ForbiddenException);
    }
    expect(analytics).not.toHaveBeenCalled();
    await controller.getWeeklyBookingComparison({
      data: { role: RolesEnum.ADMIN },
    } as TokenDto);
    expect(analytics).toHaveBeenCalledTimes(1);
  });
});
