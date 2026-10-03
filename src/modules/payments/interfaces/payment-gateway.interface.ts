export interface PaymentInitiationOptions {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  callbackUrl: string;
  description?: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  gateway: string;
  transactionId: string; // Gateway authority token or charge ID
  paymentUrl: string;    // Gateway redirection URL (e.g. Shaparak StartPay or Checkout)
  rawResponse?: any;
  errorMessage?: string;
}

export interface PaymentVerificationOptions {
  transactionId?: string; // Authority token or charge ID
  status?: string;        // Gateway status param ('OK', 'NOK', etc.)
  orderId?: string;
  amount?: number;
  rawPayload?: any;
}

export interface PaymentVerificationResult {
  success: boolean;
  transactionId: string;
  trackingCode?: string; // Shaparak RRN / SaleReferenceId / Stripe Charge
  cardPan?: string;      // Masked card number (e.g. 6037-99**-****-1234)
  amount: number;
  currency: string;
  errorMessage?: string;
  rawResponse?: any;
}

export interface PaymentGateway {
  readonly name: string;
  initializePayment(options: PaymentInitiationOptions): Promise<PaymentInitiationResult>;
  verifyPayment(options: PaymentVerificationOptions): Promise<PaymentVerificationResult>;
}

export interface GatewayMetadata {
  id: string;
  name: string;
  type: 'IRANIAN_SHAPARAK' | 'INTERNATIONAL_CARD' | 'OFFLINE';
  description: string;
  currencies: string[];
  logo?: string;
  isActive: boolean;
}

