import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { PaymentService } from './service/payment.service';
import { BillboardModule } from 'src/billboard/billboard.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PaymentService],
  imports: [
    BillboardModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
})
export class OrderModule {}
