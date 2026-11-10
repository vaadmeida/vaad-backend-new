import {
  BadGatewayException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PaymentService } from './payment.service';

jest.mock('axios');
const post = jest.mocked(axios.post);

describe('PaymentService', () => {
  const service = new PaymentService(
    new ConfigService({
      PAYSTACK_SECRET_KEY: 'test-secret',
      PAYSTACK_CALLBACK_URL: 'https://example.com/payment',
    }),
  );

  beforeEach(() => jest.resetAllMocks());

  it('converts NGN to kobo and returns the checkout link', async () => {
    post.mockResolvedValue({
      data: {
        status: true,
        data: {
          reference: 'INV-test',
          authorization_url: 'https://checkout.paystack.com/test',
        },
      },
    });
    await expect(
      service.initializePayment('user@example.com', 123.45, 'INV-test'),
    ).resolves.toBe('https://checkout.paystack.com/test');
    expect(post).toHaveBeenCalledWith(
      'https://api.paystack.co/transaction/initialize',
      expect.objectContaining({
        amount: 12345,
        currency: 'NGN',
        reference: 'INV-test',
        email: 'user@example.com',
      }),
      expect.objectContaining({
        timeout: 15000,
        headers: { Authorization: 'Bearer test-secret' },
      }),
    );
  });

  it.each([0, -1, NaN, Infinity])(
    'rejects invalid total %s without contacting Paystack',
    async (amount) => {
      await expect(
        service.initializePayment('user@example.com', amount, 'ref'),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(post).not.toHaveBeenCalled();
    },
  );

  it('fails clearly when the secret is missing', async () => {
    const unconfigured = new PaymentService(new ConfigService({}));
    await expect(
      unconfigured.initializePayment('user@example.com', 10, 'ref'),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('does not expose upstream errors', async () => {
    post.mockRejectedValue(new Error('secret provider details'));
    await expect(
      service.initializePayment('user@example.com', 10, 'ref'),
    ).rejects.toThrow('Unable to initialize payment');
  });

  it('rejects mismatched references', async () => {
    post.mockResolvedValue({
      data: {
        status: true,
        data: {
          reference: 'wrong',
          authorization_url: 'https://checkout.paystack.com/test',
        },
      },
    });
    await expect(
      service.initializePayment('user@example.com', 10, 'ref'),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });
});

describe('Paystack bank transfer', () => {
  const service = new PaymentService(
    new ConfigService({ PAYSTACK_SECRET_KEY: 'test-secret' }),
  );
  const transfer = () => ({
    reference: 'INV-transfer',
    status: 'pending_bank_transfer',
    account_name: 'VAAD',
    account_number: '0123456789',
    bank: { name: 'Test Bank' },
    account_expires_at: new Date(Date.now() + 3600000).toISOString(),
  });
  beforeEach(() => jest.resetAllMocks());

  it('requests a transfer account and preserves its details and expiry', async () => {
    const details = transfer();
    post.mockResolvedValue({ data: { status: true, data: details } });
    await expect(
      service.initializeBankTransfer(
        'user@example.com',
        123.45,
        'INV-transfer',
      ),
    ).resolves.toEqual({
      reference: 'INV-transfer',
      bankName: 'Test Bank',
      accountName: 'VAAD',
      accountNumber: '0123456789',
      expiresAt: new Date(details.account_expires_at),
    });
    expect(post).toHaveBeenCalledWith(
      'https://api.paystack.co/charge',
      {
        email: 'user@example.com',
        amount: 12345,
        currency: 'NGN',
        reference: 'INV-transfer',
        bank_transfer: { account_expires_at: null },
      },
      expect.objectContaining({
        headers: { Authorization: 'Bearer test-secret' },
      }),
    );
  });

  it.each([
    { reference: 'wrong' },
    { status: 'success' },
    { account_number: '' },
    { bank: null },
    { account_expires_at: 'invalid' },
    { account_expires_at: '2020-01-01T00:00:00Z' },
  ])('rejects unusable account details: %j', async (override) => {
    post.mockResolvedValue({
      data: { status: true, data: { ...transfer(), ...override } },
    });
    await expect(
      service.initializeBankTransfer('user@example.com', 10, 'INV-transfer'),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('handles provider failures without exposing details', async () => {
    post.mockRejectedValue(new Error('private details'));
    await expect(
      service.initializeBankTransfer('user@example.com', 10, 'INV-transfer'),
    ).rejects.toThrow('Unable to create a bank transfer account');
  });
});
