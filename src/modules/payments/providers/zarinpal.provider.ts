import { Injectable, Logger } from '@nestjs/common';
import {
  PaymentGateway,
  PaymentInitiationOptions,
  PaymentInitiationResult,
  PaymentVerificationOptions,
  PaymentVerificationResult,
} from '../interfaces/payment-gateway.interface';

@Injectable()
export class ZarinpalProvider implements PaymentGateway {
  readonly name = 'ZARINPAL';
  private readonly logger = new Logger(ZarinpalProvider.name);

  private readonly merchantId: string;
  private readonly isSandbox: boolean;
  private readonly baseUrl: string;
  private readonly startPayUrl: string;

  constructor() {
    this.merchantId = process.env.ZARINPAL_MERCHANT_ID || '00000000-0000-0000-0000-000000000000';
    this.isSandbox = process.env.ZARINPAL_SANDBOX === 'true' || this.merchantId.startsWith('0000');

    if (this.isSandbox) {
      this.baseUrl = 'https://sandbox.zarinpal.com/pg/v4/payment';
      this.startPayUrl = 'https://sandbox.zarinpal.com/pg/StartPay';
    } else {
      this.baseUrl = 'https://payment.zarinpal.com/pg/v4/payment';
      this.startPayUrl = 'https://payment.zarinpal.com/pg/StartPay';
    }
  }

  async initializePayment(options: PaymentInitiationOptions): Promise<PaymentInitiationResult> {
    const isMock = this.isSandbox && this.merchantId.startsWith('0000');

    // In local dev without live credentials, generate a valid simulated Authority
    if (isMock) {
      const mockAuthority = `A00000000000000000000000000${Math.floor(100000 + Math.random() * 900000)}`;
      const simulatedUrl = `${options.callbackUrl}?Authority=${mockAuthority}&Status=OK`;
      this.logger.log(`[Zarinpal Simulation] Payment initialized for Order ${options.orderNumber}. Authority: ${mockAuthority}`);

      return {
        success: true,
        gateway: this.name,
        transactionId: mockAuthority,
        paymentUrl: simulatedUrl,
        rawResponse: { code: 100, message: 'Simulation initialized successfully', authority: mockAuthority },
      };
    }

    try {
      // Zarinpal expects amount in Tomans (IRT)
      const amountInTomans = Math.round(options.amount);

      const response = await fetch(`${this.baseUrl}/request.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: this.merchantId,
          amount: amountInTomans,
          description: options.description || `Order #${options.orderNumber}`,
          callback_url: options.callbackUrl,
          metadata: {
            mobile: options.customerPhone || '',
            email: options.customerEmail || '',
            order_id: options.orderId,
          },
        }),
      });

      const json = await response.json();
      if (json?.data?.code === 100 && json?.data?.authority) {
        const authority = json.data.authority;
        return {
          success: true,
          gateway: this.name,
          transactionId: authority,
          paymentUrl: `${this.startPayUrl}/${authority}`,
          rawResponse: json,
        };
      } else {
        const errorMsg = this.translateErrorCode(json?.errors?.code || json?.data?.code);
        return {
          success: false,
          gateway: this.name,
          transactionId: '',
          paymentUrl: '',
          errorMessage: errorMsg,
          rawResponse: json,
        };
      }
    } catch (err: any) {
      this.logger.error(`Zarinpal request failed: ${err.message}`, err.stack);
      return {
        success: false,
        gateway: this.name,
        transactionId: '',
        paymentUrl: '',
        errorMessage: `Failed to connect to Zarinpal: ${err.message}`,
      };
    }
  }

  async verifyPayment(options: PaymentVerificationOptions): Promise<PaymentVerificationResult> {
    const isMock = this.isSandbox && this.merchantId.startsWith('0000');
    const authority = options.transactionId || 'UNKNOWN';

    if (isMock) {
      const isSuccess = options.status === 'OK';
      if (isSuccess) {
        const randomRefId = Math.floor(100000000 + Math.random() * 900000000);
        return {
          success: true,
          transactionId: authority,
          trackingCode: `ZP-RRN-${randomRefId}`,
          cardPan: '6037-99**-****-8812',
          amount: options.amount || 0,
          currency: 'USD',
          rawResponse: { code: 100, ref_id: randomRefId, card_pan: '603799******8812', fee: 1000 },
        };
      } else {
        return {
          success: false,
          transactionId: authority,
          amount: options.amount || 0,
          currency: 'USD',
          errorMessage: 'تراکنش توسط کاربر در شاپرک لغو شد (Payment cancelled by user)',
          rawResponse: { code: -51, message: 'User cancelled transaction' },
        };
      }
    }

    try {
      const amountInTomans = Math.round(options.amount || 0);

      const response = await fetch(`${this.baseUrl}/verify.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: this.merchantId,
          amount: amountInTomans,
          authority,
        }),
      });

      const json = await response.json();
      const code = json?.data?.code;

      if (code === 100 || code === 101) {
        return {
          success: true,
          transactionId: authority,
          trackingCode: `ZP-RRN-${json.data.ref_id}`,
          cardPan: json.data.card_pan || '****-****-****-****',
          amount: options.amount || 0,
          currency: 'USD',
          rawResponse: json,
        };
      } else {
        return {
          success: false,
          transactionId: authority,
          amount: options.amount || 0,
          currency: 'USD',
          errorMessage: this.translateErrorCode(code || json?.errors?.code),
          rawResponse: json,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        transactionId: authority,
        amount: options.amount || 0,
        currency: 'USD',
        errorMessage: `Verification request failed: ${err.message}`,
      };
    }
  }

  private translateErrorCode(code: number): string {
    const errorMap: Record<number, string> = {
      '-9': 'خطای اعتبارسنجی مقادیر ارسالی (Validation error)',
      '-10': 'مرچنت کد ارسالی نامعتبر یا غیرفعال است (Invalid Merchant ID)',
      '-11': 'مرچنت یافت نشد یا درگاه تایید نشده است (Terminal not found)',
      '-12': 'تلاش بیش از حد مجاز در بازه زمانی کوتاه (Too many attempts)',
      '-50': 'مبلغ پرداخت شده با مبلغ اعتبارسنجی مغایرت دارد (Amount mismatch)',
      '-51': 'تراکنش ناموفق است، توسط کاربر در درگاه شاپرک لغو شد (Transaction cancelled by user)',
      '-52': 'خطای غیرمنتظره در درگاه شاپرک (Shaparak gateway error)',
      '-53': 'اتوریتی نامعتبر است (Invalid authority)',
      '-54': 'اتوریتی منقضی شده است (Authority expired)',
      '101': 'تراکنش قبلا تایید شده است (Transaction already verified)',
    };
    return errorMap[code] || `خطای درگاه زرین‌پال (${code || 'Unknown error'})`;
  }
}
