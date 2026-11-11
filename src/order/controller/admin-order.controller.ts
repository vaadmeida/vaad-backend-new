import {
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  ParseEnumPipe,
  Query,
} from '@nestjs/common';
import { Token } from '@app/util';
import type { TokenDto } from '@app/util/auth/dto/token.dto';
import { OrderService } from '../service/order.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RolesEnum } from '@app/util/auth/enum/roles.enum';
import { BookingPeriodEnum, OrderStatusEnum } from '../enum/order.enum';

@ApiTags('Admin Orders')
@Controller('orders/admins')
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/bookings')
  @ApiQuery({ name: 'status', enum: OrderStatusEnum, required: false })
  @ApiOperation({
    summary: 'List all bookings, optionally filtered by status',
    description:
      'Returns bookings newest first with populated user and order references.',
  })
  async getBookings(
    @Token() token: TokenDto,
    @Query('status', new ParseEnumPipe(OrderStatusEnum, { optional: true }))
    status?: OrderStatusEnum,
  ) {
    // if (token?.data?.role !== RolesEnum.ADMIN) {
    //   throw new ForbiddenException('Admin access required');
    // }

    return { bookings: await this.orderService.getBookings(status) };
  }

  @Get('/bookings/totals')
  @ApiQuery({
    name: 'period',
    enum: BookingPeriodEnum,
    required: false,
    description: 'Grouping period. Defaults to week.',
  })
  @ApiOperation({
    summary: 'Get total bookings grouped by week, month, or year',
    description:
      'Groups all bookings by creation date in Africa/Lagos, sorted oldest first. Weeks start Monday. Returns { period, timezone, groups: [{ start, total }] }. Only periods containing bookings are returned; start is an ISO date identifying the period boundary.',
  })
  getBookingTotals(
    @Token() token: TokenDto,
    @Query(
      'period',
      new DefaultValuePipe(BookingPeriodEnum.WEEK),
      new ParseEnumPipe(BookingPeriodEnum),
    )
    period: BookingPeriodEnum = BookingPeriodEnum.WEEK,
  ) {
    // if (token?.data?.role !== RolesEnum.ADMIN) {
    //   throw new ForbiddenException('Admin access required');
    // }

    return this.orderService.getBookingTotals(period);
  }

  @Get('/bookings/weekly-comparison')
  @ApiQuery({ name: 'status', enum: OrderStatusEnum, required: false })
  @ApiOperation({
    summary:
      'Compare booking counts for this week so far and the previous full week',
    description:
      'Counts bookings by creation date, optionally filtered by booking status. Weeks start Monday in Africa/Lagos. Period ends are exclusive. Percentage change is null when only the previous total is zero.',
  })
  getWeeklyBookingComparison(
    @Token() token: TokenDto,
    @Query('status', new ParseEnumPipe(OrderStatusEnum, { optional: true }))
    status?: OrderStatusEnum,
  ) {
    // if (token?.data?.role !== RolesEnum.ADMIN) {
    //   throw new ForbiddenException('Admin access required');
    // }

    return this.orderService.getWeeklyBookingComparison(status);
  }
}
