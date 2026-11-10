import {
  Logger,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../schema/order.schema';
import { Model, Types } from 'mongoose';
import { PaymentService } from './payment.service';
import { PaymentStatusEnum, PaymentType } from '../enum/payment.enum';
import { CreateOrderPaymentDTO } from '../dto/order.dto';
import { BillboardService } from 'src/billboard/service/billboard.service';
import { Booking } from '../schema/booking.schema';
import { DateTime } from 'luxon';
import { OrderStatusEnum } from '../enum/order.enum';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private readonly OrderModel: Model<Order>,
    private readonly billboardService: BillboardService,
    private readonly paymentService: PaymentService,
    @InjectModel(Booking.name) private readonly BookingModel: Model<Booking>,
  ) {}

  async getWeeklyBookingComparison(status?: OrderStatusEnum) {
    const statusFilter = status === undefined ? {} : { status };
    const now = DateTime.now().setZone('Africa/Lagos');
    const thisWeekStart = now.startOf('week').toJSDate();
    const lastWeekStart = now.startOf('week').minus({ weeks: 1 }).toJSDate();
    const asOf = now.toJSDate();
    const [thisWeekTotal, lastWeekTotal] = await Promise.all([
      this.BookingModel.countDocuments({
        ...statusFilter,
        createdAt: { $gte: thisWeekStart, $lt: asOf },
      }).exec(),
      this.BookingModel.countDocuments({
        ...statusFilter,
        createdAt: { $gte: lastWeekStart, $lt: thisWeekStart },
      }).exec(),
    ]);
    const difference = thisWeekTotal - lastWeekTotal;

    return {
      timezone: 'Africa/Lagos',
      thisWeek: { start: thisWeekStart, end: asOf, total: thisWeekTotal },
      lastWeek: {
        start: lastWeekStart,
        end: thisWeekStart,
        total: lastWeekTotal,
      },
      difference,
      percentageChange:
        lastWeekTotal === 0
          ? thisWeekTotal === 0
            ? 0
            : null
          : Number(((difference / lastWeekTotal) * 100).toFixed(2)),
    };
  }

  async getPayLaterOrders(userId: string): Promise<Order[]> {
    return this.OrderModel.find({ userId, paymentType: PaymentType.PAY_LATER })
      .sort({ createdAt: -1, _id: -1 })
      .exec();
  }

  async getOrderById(id: string, userId: string): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) {
      const error = new BadRequestException('Invalid order ID');
      this.logger.error(
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }

    const order = await this.OrderModel.findOne({ _id: id, userId }).exec();
    if (!order) {
      const error = new NotFoundException('Order not found');
      this.logger.error(
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
    return order;
  }

  async initiateOrderPayment(
    userId: string,
    { orderItems, ...createOrderDto }: CreateOrderPaymentDTO,
    email: string,
  ): Promise<Order> {
    if (
      !orderItems?.length ||
      orderItems.some(
        (item) =>
          !Types.ObjectId.isValid(item.billboardId) ||
          !Number.isFinite(item.durationInMonths) ||
          item.durationInMonths <= 0,
      )
    ) {
      const error = new BadRequestException('Valid order items are required');
      this.logger.error(
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }

    const billboardIds = orderItems.map((item) => item.billboardId);

    const billboards =
      await this.billboardService.getBillboardsByIds(billboardIds);

    const pricesById = new Map(
      billboards.map((billboard) => [
        billboard._id.toString(),
        billboard.price,
      ]),
    );
    const totalAmount = orderItems.reduce((amount, item) => {
      const price = pricesById.get(
        new Types.ObjectId(item.billboardId).toString(),
      );
      if (price === undefined || !Number.isFinite(price) || price <= 0) {
        const error = new BadRequestException(
          'A billboard is unavailable or has an invalid price',
        );
        this.logger.error(
          error instanceof Error ? error.message : String(error),
          error instanceof Error ? error.stack : undefined,
        );
        throw error;
      }

      return amount + price * item.durationInMonths;
    }, 0);

    if (
      !Number.isSafeInteger(Math.round(totalAmount * 100)) ||
      totalAmount <= 0
    ) {
      const error = new BadRequestException('Invalid order total');
      this.logger.error(
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }

    const oderId = new Types.ObjectId();

    const session = await this.OrderModel.startSession();
    try {
      session.startTransaction();
      const bookings = await this.BookingModel.insertMany(
        orderItems.map(({ billboardId, ...item }) => ({
          ...item,
          billboard: billboardId,
          user: userId,
          order: oderId,
        })),
        { session },
      );

      const order = new this.OrderModel({
        _id: oderId,
        ...createOrderDto,
        userId,
        bookings,
        totalAmount,
      });

      await order.save({ session });

      if (order.paymentType === PaymentType.PAY_LATER) {
        order.bankAccount = await this.paymentService.initializeBankTransfer(
          email,
          order.totalAmount,
          `BT_${order.reference}`,
        );
        await order.save({ session });
      }
      order.paymentLink = await this.paymentService.initializePayment(
        email,
        order.totalAmount,
        order.reference,
      );
      order.status = PaymentStatusEnum.PENDING;

      await order.save({ session });
      await order.populate({
        path: 'bookings.billboard',
        options: { session },
      });
      await session.commitTransaction();
      return order;
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
