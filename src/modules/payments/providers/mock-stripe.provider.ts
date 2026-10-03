import { Injectable } from '@nestjs/common';
import {
  PaymentGateway,
  PaymentInitiationOptions,
  PaymentInitiationResult,
  PaymentVerificationOptions,
  PaymentVerificationResult,
} from '../interfaces/payment-gateway.interface';

@Injectable()
export class MockStripeProvider implements PaymentGateway {
  readonly name = 'STRIPE';

  async initializePayment(options: PaymentInitiationOptions): Promise<PaymentInitiationResult> {
    const chargeId = `ch_live_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const redirectUrl = `${options.callbackUrl}?session_id=${chargeId}&status=success`;

    return {
      success: true,
      gateway: this.name,
      transactionId: chargeId,
      paymentUrl: redirectUrl,
      rawResponse: { object: 'checkout.session', id: chargeId, status: 'open' },
    };
  }

  async verifyPayment(options: PaymentVerificationOptions): Promise<PaymentVerificationResult> {
    const isSuccess = options.status !== 'failed' && options.status !== 'cancel';
    const txId = options.transactionId || `ch_${Date.now()}`;

    if (isSuccess) {
      return {
        success: true,
        transactionId: txId,
        trackingCode: `STRIPE-AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
        cardPan: '4242-****-****-4242',
        amount: options.amount || 0,
        currency: 'USD',
        rawResponse: { status: 'succeeded', paid: true, outcome: { network_status: 'approved_by_network' } },
      };
    } else {
      return {
        success: false,
        transactionId: txId,
        amount: options.amount || 0,
        currency: 'USD',
        errorMessage: 'Card payment was declined by the issuing bank.',
        rawResponse: { status: 'failed', failure_code: 'card_declined' },
      };
    }
  }
}
