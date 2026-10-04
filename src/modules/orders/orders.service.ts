import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CouponsService } from '@/modules/coupons/coupons.service';
import { ShippingService } from '@/modules/shipping/shipping.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrdersDto } from './dto/filter-orders.dto';
import { OrderStatus, PaymentStatus, TransactionStatus, Role, WalletTransactionType } from '@prisma/client';
import { WalletService } from '@/modules/wallet/wallet.service';
import { ReferralService } from '@/modules/referral/referral.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private couponsService: CouponsService,
    private shippingService: ShippingService,
    private walletService: WalletService,
    private referralService: ReferralService,
  ) {}

  async findAll(filters: FilterOrdersDto) {
    const { skip, limit, status, paymentStatus, search, startDate, endDate } = filters;
    const where: any = {};

    if (status && (status as any) !== 'ALL') {
      where.status = status;
    }

    if (paymentStatus && (paymentStatus as any) !== 'ALL') {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { trackingNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          coupon: {
            select: { code: true, discountType: true, discountValue: true },
          },
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: { items: true, transactions: true },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page: filters.page || 1,
        limit: limit || 10,
        totalPages: Math.ceil(total / (limit || 10)),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
        coupon: true,
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, productType: true },
            },
            variant: {
              select: { id: true, sku: true },
            },
          },
        },
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }

    return order;
  }

  async findByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, email: true },
    });

    const conditions: any[] = [{ userId }];
    if (user?.phone) {
      conditions.push({ customerPhone: user.phone });
    }
    if (user?.email) {
      conditions.push({ customerEmail: user.email });
    }

    return this.prisma.order.findMany({
      where: {
        OR: conditions,
      },
      include: {
        items: true,
        timeline: {
          orderBy: { createdAt: 'desc' },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const [allOrders, paidOrders, totalCount, statusCounts] = await Promise.all([
      this.prisma.order.findMany({
        select: { totalAmount: true, status: true, paymentStatus: true, createdAt: true },
      }),
      this.prisma.order.aggregate({
        where: { paymentStatus: PaymentStatus.PAID },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.order.count(),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    const totalRevenue = Number(paidOrders._sum.totalAmount || 0);
    const paidCount = paidOrders._count || 0;
    const averageOrderValue = paidCount > 0 ? totalRevenue / paidCount : 0;

    const countByStatus: Record<string, number> = {};
    for (const sc of statusCounts) {
      countByStatus[sc.status] = sc._count.id;
    }

    // Recent 5 orders for dashboard
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: totalCount,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      pendingCount: countByStatus[OrderStatus.PENDING] || 0,
      processingCount: countByStatus[OrderStatus.PROCESSING] || 0,
      shippedCount: countByStatus[OrderStatus.SHIPPED] || 0,
      deliveredCount: countByStatus[OrderStatus.DELIVERED] || 0,
      cancelledCount: countByStatus[OrderStatus.CANCELLED] || 0,
      recentOrders,
    };
  }

  async create(dto: CreateOrderDto, userId?: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Resolve or auto-register guest customer by phone or email
    let resolvedUserId = userId;
    if (!resolvedUserId) {
      const cleanPhone = dto.customerPhone?.trim() || null;
      const cleanEmail = dto.customerEmail?.toLowerCase()?.trim() || null;

      // 1. Try finding existing user by phone
      if (cleanPhone) {
        const userByPhone = await this.prisma.user.findFirst({
          where: { phone: cleanPhone },
        });
        if (userByPhone) resolvedUserId = userByPhone.id;
      }

      // 2. Try finding existing user by email
      if (!resolvedUserId && cleanEmail) {
        const userByEmail = await this.prisma.user.findUnique({
          where: { email: cleanEmail },
        });
        if (userByEmail) resolvedUserId = userByEmail.id;
      }

      // 3. Auto-create guest user if not registered yet
      if (!resolvedUserId && (cleanPhone || cleanEmail)) {
        const nameParts = (dto.customerName || 'Customer').trim().split(/\s+/);
        const firstName = nameParts[0] || 'Customer';
        const lastName = nameParts.slice(1).join(' ') || '';

        const effectiveEmail = cleanEmail
          ? cleanEmail
          : cleanPhone
          ? `${cleanPhone.replace(/\D/g, '')}@guest.store.internal`
          : `guest-${Date.now()}@guest.store.internal`;

        const salt = await bcrypt.genSalt(10);
        const dummyPasswordHash = await bcrypt.hash(`Guest@${Date.now()}`, salt);

        try {
          const newUser = await this.prisma.user.create({
            data: {
              email: effectiveEmail,
              phone: cleanPhone,
              firstName,
              lastName,
              passwordHash: dummyPasswordHash,
              role: Role.CUSTOMER,
            },
          });
          resolvedUserId = newUser.id;

          // If shipping address was provided, save address for this new user
          if (dto.shippingAddress) {
            await this.prisma.address.create({
              data: {
                userId: newUser.id,
                title: 'Primary Delivery Address',
                recipientName: dto.shippingAddress.recipientName || dto.customerName,
                phone: dto.shippingAddress.phone || cleanPhone || '',
                street: dto.shippingAddress.street,
                city: dto.shippingAddress.city,
                province: dto.shippingAddress.province,
                postalCode: dto.shippingAddress.postalCode,
                isDefaultShipping: true,
                isDefaultBilling: true,
              },
            });
          }
        } catch {
          // If collision or unique constraint on email, fallback lookup
          const fallbackUser = await this.prisma.user.findFirst({
            where: {
              OR: [
                ...(cleanPhone ? [{ phone: cleanPhone }] : []),
                { email: effectiveEmail },
              ],
            },
          });
          if (fallbackUser) resolvedUserId = fallbackUser.id;
        }
      }
    }

    // Validate and snapshot line items
    const preparedItems: any[] = [];
    let subtotal = 0;

    for (const itemInput of dto.items) {
      if (itemInput.variantId) {
        const variant = await this.prisma.productVariant.findUnique({
          where: { id: itemInput.variantId },
          include: {
            product: { include: { images: true } },
            attributeValues: {
              include: {
                attributeValue: { include: { attribute: true } },
              },
            },
          },
        });

        if (!variant) {
          throw new NotFoundException(`Product variant "${itemInput.variantId}" not found`);
        }

        if (variant.product.manageStock && variant.stockQuantity < itemInput.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${variant.product.name}" (${variant.sku}). Available: ${variant.stockQuantity}`,
          );
        }

        const price = Number(variant.salePrice || variant.price);
        const lineTotal = Math.round(price * itemInput.quantity * 100) / 100;
        subtotal += lineTotal;

        const selectedAttrs: Record<string, string> = {};
        for (const av of variant.attributeValues) {
          selectedAttrs[av.attributeValue.attribute.name] = av.attributeValue.name;
        }

        const primaryImage =
          variant.image ||
          variant.product.images.find((img) => img.isPrimary)?.url ||
          variant.product.images[0]?.url;

        preparedItems.push({
          productId: variant.productId,
          variantId: variant.id,
          productName: variant.product.name,
          productSku: variant.sku,
          variantName: Object.values(selectedAttrs).join(' / '),
          productImage: primaryImage,
          unitPrice: price,
          quantity: itemInput.quantity,
          totalPrice: lineTotal,
          selectedAttributes: selectedAttrs,
        });

        // Decrement stock
        if (variant.product.manageStock) {
          await this.prisma.productVariant.update({
            where: { id: variant.id },
            data: { stockQuantity: { decrement: itemInput.quantity } },
          });
        }
      } else if (itemInput.productId) {
        const product = await this.prisma.product.findUnique({
          where: { id: itemInput.productId },
          include: { images: true },
        });

        if (!product) {
          throw new NotFoundException(`Product "${itemInput.productId}" not found`);
        }

        if (product.manageStock && product.stockQuantity < itemInput.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}". Available: ${product.stockQuantity}`,
          );
        }

        const price = Number(product.salePrice || product.basePrice);
        const lineTotal = Math.round(price * itemInput.quantity * 100) / 100;
        subtotal += lineTotal;

        const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

        preparedItems.push({
          productId: product.id,
          variantId: null,
          productName: product.name,
          productSku: product.sku || null,
          variantName: null,
          productImage: primaryImage,
          unitPrice: price,
          quantity: itemInput.quantity,
          totalPrice: lineTotal,
          selectedAttributes: null,
        });

        // Decrement stock
        if (product.manageStock) {
          await this.prisma.product.update({
            where: { id: product.id },
            data: { stockQuantity: { decrement: itemInput.quantity } },
          });
        }
      }
    }

    subtotal = Math.round(subtotal * 100) / 100;

    // Coupon calculation
    let discountAmount = 0;
    let couponId: string | null = null;
    let couponCode: string | null = null;

    if (dto.couponCode) {
      const validation = await this.couponsService.validateCoupon(dto.couponCode, subtotal);
      if (validation.valid) {
        discountAmount = validation.discountAmount;
        couponId = validation.coupon.id;
        couponCode = validation.coupon.code;
        await this.couponsService.incrementUsage(couponId);
      }
    }

    // Shipping calculation
    let shippingAmount = 50.0;
    let shippingMethodName = dto.shippingMethod || 'Standard Furniture Freight';
    let carrierName = dto.shippingCarrier || 'Chapar / Old Dominion';

    if (dto.shippingMethod) {
      const allMethods = await this.shippingService.findAll();
      const matchingMethod = allMethods.find(
        (m) => m.name.toLowerCase() === dto.shippingMethod?.toLowerCase() || m.id === dto.shippingMethod,
      );
      if (matchingMethod) {
        shippingAmount = matchingMethod.price;
        shippingMethodName = matchingMethod.name;
        carrierName = dto.shippingCarrier || matchingMethod.carrier;
      }
    }

    // 8% tax on taxable subtotal
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * 0.08 * 100) / 100;
    const totalAmount = Math.round((taxableAmount + shippingAmount + taxAmount) * 100) / 100;

    // Generate readable orderNumber e.g. "SW-1007"
    const orderCount = await this.prisma.order.count();
    const orderNumber = `SW-${1000 + orderCount + 1}`;

    // Resolve referral association if applicable
    let referralId: string | null = null;
    if (resolvedUserId) {
      if (dto.referralCode) {
        try {
          const bound = await this.referralService.bindReferee(resolvedUserId, dto.referralCode);
          if (bound) referralId = bound.id;
        } catch {
          // If code is invalid or self-referral, proceed without breaking checkout
        }
      }
      if (!referralId) {
        const existingRef = await this.prisma.referral.findUnique({
          where: { refereeId: resolvedUserId },
        });
        if (existingRef) referralId = existingRef.id;
      }
    }

    // Wallet balance payment / partial payment
    let walletAmountPaid = 0;
    let cashAmountPaid = totalAmount;
    let initialPaymentStatus: PaymentStatus = PaymentStatus.PENDING;
    let paidAt: Date | null = null;

    if (dto.useWalletBalance && resolvedUserId) {
      const walletInfo = await this.walletService.getBalance(resolvedUserId);
      if (walletInfo.isActive && walletInfo.balance > 0) {
        if (walletInfo.balance >= totalAmount) {
          // Full payment via wallet
          await this.walletService.debit({
            userId: resolvedUserId,
            amount: totalAmount,
            type: WalletTransactionType.ORDER_PAYMENT,
            description: `پرداخت کامل سفارش ${orderNumber} از موجودی کیف پول`,
            referenceId: orderNumber,
          });
          walletAmountPaid = totalAmount;
          cashAmountPaid = 0;
          initialPaymentStatus = PaymentStatus.PAID;
          paidAt = new Date();
        } else {
          // Partial payment via wallet
          const partial = walletInfo.balance;
          await this.walletService.debit({
            userId: resolvedUserId,
            amount: partial,
            type: WalletTransactionType.ORDER_PARTIAL_PAYMENT,
            description: `پرداخت بخشی از مبلغ سفارش ${orderNumber} از موجودی کیف پول`,
            referenceId: orderNumber,
          });
          walletAmountPaid = partial;
          cashAmountPaid = Math.round((totalAmount - partial) * 100) / 100;
        }
      }
    }

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId: resolvedUserId || null,
        customerName: dto.customerName,
        customerEmail:
          dto.customerEmail?.toLowerCase()?.trim() ||
          (dto.customerPhone
            ? `${dto.customerPhone.replace(/\D/g, '')}@guest.store.internal`
            : `guest-${Date.now()}@guest.store.internal`),
        customerPhone: dto.customerPhone || null,
        status: initialPaymentStatus === PaymentStatus.PAID ? OrderStatus.PROCESSING : OrderStatus.PENDING,
        paymentStatus: initialPaymentStatus,
        paymentMethod: walletAmountPaid === totalAmount ? 'WALLET' : dto.paymentMethod || 'CREDIT_CARD',
        walletAmountPaid,
        cashAmountPaid,
        paidAt,
        referralId,
        subtotal,
        discountAmount,
        shippingAmount,
        taxAmount,
        totalAmount,
        currency: dto.currency || 'USD',
        couponId,
        couponCode,
        shippingAddress: dto.shippingAddress as any,
        billingAddress: (dto.billingAddress || dto.shippingAddress) as any,
        shippingMethod: shippingMethodName,
        shippingCarrier: carrierName,
        customerNotes: dto.customerNotes || null,
        items: {
          create: preparedItems,
        },
        transactions: {
          create: [
            {
              gateway: walletAmountPaid === totalAmount ? 'WALLET' : dto.paymentMethod || 'CREDIT_CARD',
              status: initialPaymentStatus === PaymentStatus.PAID ? TransactionStatus.SUCCESS : TransactionStatus.PENDING,
              amount: cashAmountPaid > 0 ? cashAmountPaid : totalAmount,
              currency: dto.currency || 'USD',
              errorMessage: null,
            },
          ],
        },
        timeline: {
          create: [
            {
              status: OrderStatus.PENDING,
              note: walletAmountPaid > 0
                ? `سفارش ${orderNumber} ثبت شد. مبلغ ${walletAmountPaid.toLocaleString()} از کیف پول پرداخت شد.`
                : `سفارش ${orderNumber} ثبت شد. مبلغ کل: ${totalAmount.toLocaleString()}`,
            },
          ],
        },
      },
      include: {
        items: true,
        timeline: true,
        transactions: true,
      },
    });

    return order;
  }

  async updateStatus(id: string, newStatus: OrderStatus, note?: string) {
    const order = await this.findOne(id);

    // If order was cancelled, replenish product / variant stock
    if (newStatus === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      for (const item of order.items) {
        if (item.variantId) {
          await this.prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        } else if (item.productId) {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
      }
    }

    const defaultNotes: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Order marked as pending',
      [OrderStatus.PROCESSING]: 'Order is in production / fulfillment preparation',
      [OrderStatus.SHIPPED]: 'Order has been handed over to freight/courier carrier',
      [OrderStatus.DELIVERED]: 'Order successfully delivered to customer',
      [OrderStatus.CANCELLED]: 'Order cancelled by store administrator or customer',
      [OrderStatus.REFUNDED]: 'Order payment refunded to customer',
    };

    const statusNote = note || defaultNotes[newStatus] || `Status updated to ${newStatus}`;

    const updateData: any = { status: newStatus };
    if (newStatus === OrderStatus.SHIPPED && !order.shippedAt) {
      updateData.shippedAt = new Date();
    }
    if (newStatus === OrderStatus.DELIVERED && !order.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        ...updateData,
        timeline: {
          create: [{ status: newStatus, note: statusNote }],
        },
      },
      include: {
        items: true,
        timeline: { orderBy: { createdAt: 'asc' } },
        transactions: { orderBy: { createdAt: 'desc' } },
      },
    });

    // 1. Release referral rewards when order is DELIVERED
    if (newStatus === OrderStatus.DELIVERED) {
      try {
        await this.referralService.releaseOrderReward(order.id);
      } catch (err) {
        console.error('Failed to release referral reward for order', order.id, err);
      }
    }

    // 2. Automatically refund wallet balance if order was cancelled or refunded
    if (
      (newStatus === OrderStatus.CANCELLED || newStatus === OrderStatus.REFUNDED) &&
      Number(order.walletAmountPaid) > 0 &&
      order.userId
    ) {
      const existingRefund = await this.prisma.walletTransaction.findFirst({
        where: {
          referenceId: order.orderNumber,
          type: WalletTransactionType.REFUND,
        },
      });

      if (!existingRefund) {
        try {
          await this.walletService.credit({
            userId: order.userId,
            amount: Number(order.walletAmountPaid),
            type: WalletTransactionType.REFUND,
            description: `استرداد وجه کیف پول بابت لغو سفارش ${order.orderNumber}`,
            referenceId: order.orderNumber,
          });
        } catch (err) {
          console.error('Failed to refund wallet balance for order', order.id, err);
        }
      }
    }

    return updated;
  }

  async update(id: string, dto: UpdateOrderDto) {
    await this.findOne(id);

    const updateData: any = { ...dto };
    if (dto.paymentStatus === PaymentStatus.PAID) {
      updateData.paidAt = new Date();
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        timeline: { orderBy: { createdAt: 'asc' } },
        transactions: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
