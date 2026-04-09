import { Body, Controller, Post } from '@nestjs/common';
import { Token } from '@app/util';
import type { TokenDto } from '@app/util/auth/dto/token.dto';
import { OrderService } from '../service/order.service';
import { CreateOrderPaymentDTO } from '../dto/order.dto';
import { PaymentService } from '../service/payment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('/initiate-payments')
  initiateOrderPayment(
    @Body() { orderItems }: CreateOrderPaymentDTO,
    @Token() { identifier }: TokenDto,
  ) {
    return this.paymentService.initiateOrderPayment(
      identifier,
      orderItems.map((item) => ({
        ...item,
        billboard: item.billboardId,
      })),
    );
  }
}
