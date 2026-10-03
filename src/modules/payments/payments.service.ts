import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { ZarinpalProvider } from './providers/zarinpal.provider';
import { MellatProvider } from './providers/mellat.provider';
import { PaymentGateway, GatewayMetadata } from './interfaces/payment-gateway.interface';
import { AVAILABLE_GATEWAYS } from './constants/gateway.constants';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { OrderStatus, PaymentStatus, TransactionStatus } from '@prisma/client';

export { GatewayMetadata };

@Injectable()
export class PaymentsService {
  private providers: Map<string, PaymentGateway> = new Map();

  constructor(
    private prisma: PrismaService,
    private zarinpal: ZarinpalProvider,
    private mellat: MellatProvider,
  ) {
    this.providers.set('ZARINPAL', this.zarinpal);
    this.providers.set('MELLAT', this.mellat);
  }

  getAvailableGateways(): GatewayMetadata[] {
    return AVAILABLE_GATEWAYS;
  }

  async initiatePayment(dto: InitiatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { user: true },
    });

    if (!order) throw new NotFoundException(`Order "${dto.orderId}" not found`);
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException(`Order "${order.orderNumber}" is already paid`);
    }

    const gatewayName = dto.gateway.toUpperCase();
    const provider = this.providers.get(gatewayName);

    if (!provider) {
      const offlineTx = await this.prisma.orderTransaction.create({
        data: {
          orderId: order.id,
          gateway: gatewayName,
          status: TransactionStatus.PENDING,
          amount: order.totalAmount,
          currency: order.currency,
          gatewayResponse: { note: 'Awaiting manual bank transfer confirmation' },
        },
      });

      return {
        success: true,
        gateway: gatewayName,
        transactionId: offlineTx.id,
        paymentUrl: dto.callbackUrl || `http://localhost:4001/checkout/success/${order.id}`,
        isOffline: true,
      };
    }

    const callback = dto.callbackUrl || `http://localhost:4000/api/v1/payments/callback/${gatewayName}?orderId=${order.id}`;

    const initiation = await provider.initializePayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: Number(order.totalAmount),
      currency: order.currency,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone || undefined,
      callbackUrl: callback,
      description: `Order #${order.orderNumber}`,
    });

    await this.prisma.orderTransaction.create({
      data: {
        orderId: order.id,
        gateway: gatewayName,
        transactionId: initiation.transactionId,
        status: TransactionStatus.PENDING,
        amount: order.totalAmount,
        currency: order.currency,
        gatewayResponse: initiation.rawResponse || null,
        errorMessage: initiation.errorMessage || null,
      },
    });

    return initiation;
  }

  async verifyPayment(gatewayName: string, queryPayload: any) {
    const normalizedGateway = gatewayName.toUpperCase();
    const provider = this.providers.get(normalizedGateway);

    if (!provider) {
      throw new BadRequestException(`Unsupported gateway: ${normalizedGateway}`);
    }

    const transactionId = queryPayload.Authority || queryPayload.RefId || queryPayload.transactionId;
    const statusParam = queryPayload.Status || queryPayload.ResCode || queryPayload.status;
    const orderId = queryPayload.orderId || queryPayload.SaleOrderId;

    let transaction = transactionId
      ? await this.prisma.orderTransaction.findFirst({
          where: { transactionId },
          include: { order: true },
        })
      : null;

    if (!transaction && orderId) {
      transaction = await this.prisma.orderTransaction.findFirst({
        where: { orderId },
        orderBy: { createdAt: 'desc' },
        include: { order: true },
      });
    }

    if (!transaction) throw new NotFoundException('Matching order transaction was not found');

    const verification = await provider.verifyPayment({
      transactionId,
      status: statusParam,
      amount: Number(transaction.amount),
      rawPayload: queryPayload,
    });

    const isSuccess = verification.success;

    await this.prisma.orderTransaction.update({
      where: { id: transaction.id },
      data: {
        status: isSuccess ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
        trackingCode: verification.trackingCode || null,
        cardPan: verification.cardPan || null,
        errorMessage: verification.errorMessage || null,
        gatewayResponse: verification.rawResponse || null,
      },
    });

    if (isSuccess) {
      await this.prisma.order.update({
        where: { id: transaction.orderId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paymentMethod: normalizedGateway,
          transactionId: verification.transactionId || transactionId,
          paidAt: new Date(),
          status: transaction.order.status === OrderStatus.PENDING ? OrderStatus.PROCESSING : transaction.order.status,
        },
      });

      await this.prisma.orderTimeline.create({
        data: {
          orderId: transaction.orderId,
          status: OrderStatus.PROCESSING,
          note: `Payment verified via ${normalizedGateway}. Ref / Tracking: ${verification.trackingCode || 'N/A'}${
            verification.cardPan ? ` (Card: ${verification.cardPan})` : ''
          }`,
        },
      });
    } else {
      await this.prisma.orderTimeline.create({
        data: {
          orderId: transaction.orderId,
          status: transaction.order.status,
          note: `Payment attempt failed via ${normalizedGateway}: ${verification.errorMessage || 'Unknown error'}`,
        },
      });
    }

    return {
      orderId: transaction.orderId,
      orderNumber: transaction.order.orderNumber,
      success: isSuccess,
      gateway: normalizedGateway,
      trackingCode: verification.trackingCode,
      cardPan: verification.cardPan,
      errorMessage: verification.errorMessage,
    };
  }

  async getOrderTransactions(orderId: string) {
    return this.prisma.orderTransaction.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
