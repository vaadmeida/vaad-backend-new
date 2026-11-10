import {
  Controller,
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
import { OrderStatusEnum } from '../enum/order.enum';

@ApiTags('Admin Orders')
@Controller('orders/admins')
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}
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
