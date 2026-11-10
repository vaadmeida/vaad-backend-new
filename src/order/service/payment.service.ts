import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import type { OrderBankAccount } from '../schema/order.schema';

interface PaystackInitialization {
  status: boolean;
  data?: { authorization_url: string; reference: string };
}

interface PaystackBankTransfer {
  status: boolean;
  data?: {
    reference: string;
    status: string;
    account_name: string;
    account_number: string;
    bank: { name: string };
    account_expires_at: string;
  };
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private readonly configService: ConfigService) {}

  async initializePayment(
    email: string,
    totalAmount: number,
    reference: string,
  ) {
    const { amount, secretKey } = this.paymentParameters(email, totalAmount);

    try {
      const { data } = await axios.post<PaystackInitialization>(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount,
          currency: 'NGN',
          reference,
          callback_url: this.configService.get<string>('PAYSTACK_CALLBACK_URL'),
        },
        {
          headers: { Authorization: `Bearer ${secretKey}` },
          timeout: 15000,
        },
      );
      if (
        !data.status ||
        !data.data?.authorization_url ||
        data.data.reference !== reference
      ) {
        const error = new Error('Invalid initialization response');
        this.logger.error(
          error instanceof Error ? error.message : String(error),
          error instanceof Error ? error.stack : undefined,
        );
        throw error;
      }
      return data.data.authorization_url;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        this.logger.error(error.response.data);
      }
      this.logger.error(
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadGatewayException(
        'Unable to initialize payment. Please try again later',
      );
    }
  }

  async initializeBankTransfer(
    email: string,
    totalAmount: number,
    reference: string,
  ): Promise<OrderBankAccount> {
    const { amount, secretKey } = this.paymentParameters(email, totalAmount);
    try {
      const { data } = await axios.post<PaystackBankTransfer>(
        'https://api.paystack.co/charge',
        {
          email,
          amount,
          currency: 'NGN',
          reference,
          bank_transfer: { account_expires_at: null },
        },
        { headers: { Authorization: `Bearer ${secretKey}` }, timeout: 15000 },
      );
      const transfer = data.data;
      const expiresAt = new Date(transfer?.account_expires_at ?? '');
      if (
        !data.status ||
        transfer?.status !== 'pending_bank_transfer' ||
        transfer.reference !== reference ||
        !transfer.bank?.name ||
        !transfer.account_name ||
        !transfer.account_number ||
        !Number.isFinite(expiresAt.getTime()) ||
        expiresAt.getTime() <= Date.now()
      ) {
        const error = new Error('Invalid bank transfer response');
        this.logger.error(
          error instanceof Error ? error.message : String(error),
          error instanceof Error ? error.stack : undefined,
        );
        throw error;
      }
      return {
        reference: transfer.reference,
        bankName: transfer.bank.name,
        accountName: transfer.account_name,
        accountNumber: transfer.account_number,
        expiresAt,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        this.logger.error(error.response.data);
      }
      this.logger.error(
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined,
      );

      throw new BadGatewayException(
        'Unable to create a bank transfer account. Please try again later',
      );
    }
  }

  private paymentParameters(email: string, totalAmount: number) {
    const amount = Math.round(totalAmount * 100);
    if (!email || !Number.isSafeInteger(amount) || amount <= 0) {
      const error = new BadRequestException(
        'A customer email and positive payment amount are required',
      );
      this.logger.error(
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
    const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!secretKey) {
      const error = new ServiceUnavailableException(
        'Payment service is not configured',
      );
      this.logger.error(
        error instanceof Error ? error.message : String(error),
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }

    return { amount, secretKey };
  }
}
