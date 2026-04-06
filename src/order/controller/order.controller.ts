import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderPaymentDTO } from '../dto/order.dto';
import { Token } from '@app/util';
import type { TokenDto } from '@app/util/auth/dto/token.dto';
import { PaymentService } from '../service/payment.service';

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
