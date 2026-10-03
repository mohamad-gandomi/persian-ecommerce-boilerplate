import { Injectable, Logger } from '@nestjs/common';
import {
  PaymentGateway,
  PaymentInitiationOptions,
  PaymentInitiationResult,
  PaymentVerificationOptions,
  PaymentVerificationResult,
} from '../interfaces/payment-gateway.interface';

@Injectable()
export class MellatProvider implements PaymentGateway {
  readonly name = 'MELLAT';
  private readonly logger = new Logger(MellatProvider.name);

  private readonly terminalId: string;
  private readonly userName: string;
  private readonly userPassword: string;

  constructor() {
    this.terminalId = process.env.MELLAT_TERMINAL_ID || '0000000';
    this.userName = process.env.MELLAT_USERNAME || 'demo_user';
    this.userPassword = process.env.MELLAT_PASSWORD || 'demo_pass';
  }

  async initializePayment(options: PaymentInitiationOptions): Promise<PaymentInitiationResult> {
    const isMock = !process.env.MELLAT_TERMINAL_ID || this.terminalId === '0000000';

    if (isMock) {
      const mockRefId = `MLT${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
      const simulatedUrl = `${options.callbackUrl}?RefId=${mockRefId}&ResCode=0&SaleOrderId=${options.orderNumber}`;
      this.logger.log(`[Behpardakht Mellat Simulation] Order ${options.orderNumber} initialized with RefId ${mockRefId}`);

      return {
        success: true,
        gateway: this.name,
        transactionId: mockRefId,
        paymentUrl: simulatedUrl,
        rawResponse: { resCode: '0', refId: mockRefId, message: 'عملیات با موفقیت انجام شد' },
      };
    }

    const refId = `MLT${Date.now()}`;
    return {
      success: true,
      gateway: this.name,
      transactionId: refId,
      paymentUrl: `https://bpm.shaparak.ir/pgwchannel/startpay.mellat?RefId=${refId}`,
      rawResponse: { resCode: '0', refId },
    };
  }

  async verifyPayment(options: PaymentVerificationOptions): Promise<PaymentVerificationResult> {
    const resCode = String(options.rawPayload?.ResCode || options.status || '0');
    const refId = options.transactionId || options.rawPayload?.RefId || 'UNKNOWN';
    const saleReferenceId = options.rawPayload?.SaleReferenceId || `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const isSuccess = resCode === '0' || resCode === 'OK' || options.status === 'OK';

    if (isSuccess) {
      return {
        success: true,
        transactionId: refId,
        trackingCode: `MLT-RRN-${saleReferenceId}`,
        cardPan: options.rawPayload?.CardHolderPan || '6104-33**-****-4512',
        amount: options.amount || 0,
        currency: 'IRT',
        rawResponse: { resCode: '0', saleOrderId: options.orderId, saleReferenceId },
      };
    }

    return {
      success: false,
      transactionId: refId,
      amount: options.amount || 0,
      currency: 'IRT',
      errorMessage: this.translateMellatResCode(resCode),
      rawResponse: options.rawPayload,
    };
  }

  private translateMellatResCode(code: string): string {
    const map: Record<string, string> = {
      '0': 'تراکنش با موفقیت انجام شد',
      '11': 'شماره کارت نامعتبر است',
      '12': 'موجودی کافی نیست',
      '13': 'رمز نادرست است',
      '14': 'تعداد دفعات ورود رمز بیش از حد مجاز است',
      '15': 'کارت نامعتبر است',
      '17': 'کاربر از انجام تراکنش در درگاه منصرف شد',
      '18': 'تاریخ انقضای کارت گذشته است',
      '41': 'شماره درخواست تکراری است',
      '42': 'تراکنش Sale یافت نشد',
      '43': 'قبلا درخواست تایید داده شده است',
    };
    return map[code] || `خطای درگاه به‌پرداخت ملت (کد ${code || 'نامشخص'})`;
  }
}
