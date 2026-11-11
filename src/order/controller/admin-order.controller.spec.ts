import { ForbiddenException, ParseEnumPipe } from '@nestjs/common';
import { RolesEnum } from '@app/util/auth/enum/roles.enum';
import type { TokenDto } from '@app/util/auth/dto/token.dto';
import { BookingPeriodEnum } from '../enum/order.enum';
import { OrderService } from '../service/order.service';
import { AdminOrderController } from './admin-order.controller';

describe('Admin booking totals', () => {
  const token = (role: RolesEnum) => ({ data: { role } }) as TokenDto;
  const getBookingTotals = jest.fn().mockResolvedValue({ groups: [] });
  const controller = new AdminOrderController({
    getBookingTotals,
  } as unknown as OrderService);

  beforeEach(() => getBookingTotals.mockClear());

  it('defaults to weekly grouping', async () => {
    await expect(
      controller.getBookingTotals(token(RolesEnum.ADMIN)),
    ).resolves.toEqual({ groups: [] });
    expect(getBookingTotals).toHaveBeenCalledWith(BookingPeriodEnum.WEEK);
  });

  it.each(Object.values(BookingPeriodEnum))(
    'accepts %s grouping',
    async (period) => {
      await controller.getBookingTotals(token(RolesEnum.ADMIN), period);
      expect(getBookingTotals).toHaveBeenCalledWith(period);
    },
  );

  it('rejects unsupported periods', async () => {
    await expect(
      new ParseEnumPipe(BookingPeriodEnum).transform(
        'day' as unknown as typeof BookingPeriodEnum,
        {
          type: 'query',
          data: 'period',
        },
      ),
    ).rejects.toThrow();
  });

  it('rejects non-admins before querying bookings', () => {
    expect(() => controller.getBookingTotals(token(RolesEnum.USER))).toThrow(
      ForbiddenException,
    );
    expect(getBookingTotals).not.toHaveBeenCalled();
  });
});
