import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Token } from '@app/util';
import type { TokenDto } from '@app/util/auth/dto/token.dto';
import { OrderService } from '../service/order.service';
import { CreateOrderPaymentDTO } from '../dto/order.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/pay-later')
  async getPayLaterOrders(@Token() { identifier }: TokenDto) {
    return { orders: await this.orderService.getPayLaterOrders(identifier) };
  }

  @Get('/:id')
  getOrderById(@Param('id') id: string, @Token() { identifier }: TokenDto) {
    return this.orderService.getOrderById(id, identifier);
  }

  @Post('/initiate-payments')
  initiateOrderPayment(
    @Body() createOrderDto: CreateOrderPaymentDTO,
    @Token() { identifier, data }: TokenDto,
  ) {
    return this.orderService.initiateOrderPayment(
      identifier,
      createOrderDto,
      data.email,
    );
  }
}
