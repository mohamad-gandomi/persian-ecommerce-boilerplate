import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Role, NotificationType, NotificationPriority, OrderStatus } from '@prisma/client';
import { NotificationsService } from './notifications.service';
import { SmsService } from '../sms/sms.service';
import { NotificationEventConfig } from './notifications.constants';

function interpolate(template: string, params: Record<string, any>): string {
  let res = template || '';
  for (const [key, value] of Object.entries(params)) {
    res = res.replace(new RegExp(`{${key}}`, 'g'), String(value ?? ''));
  }
  return res;
}

@Injectable()
export class NotificationsListener {
  private readonly logger = new Logger(NotificationsListener.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly smsService: SmsService,
  ) {}

  /**
   * Helper to dispatch in-app and SMS based on event settings
   */
  private async dispatchEvent(
    eventKey: string,
    params: {
      userId?: string | null;
      userPhone?: string | null;
      title: string;
      defaultMessage?: string;
      defaultUserMessage?: string;
      defaultAdminMessage?: string;
      link?: string | null;
      type: NotificationType;
      priority?: NotificationPriority;
      metadata?: any;
      templateVariables: Record<string, any>;
    },
  ) {
    try {
      const settings = await this.notificationsService.getSettings();
      const eventConfig: NotificationEventConfig = settings.events?.[eventKey];

      const userRawText =
        eventConfig?.userCustomText ||
        eventConfig?.customText ||
        params.defaultUserMessage ||
        params.defaultMessage ||
        '';
      const adminRawText =
        eventConfig?.adminCustomText ||
        params.defaultAdminMessage ||
        eventConfig?.customText ||
        params.defaultMessage ||
        '';

      const userFormattedMessage = interpolate(userRawText, params.templateVariables);
      const adminFormattedMessage = interpolate(adminRawText, params.templateVariables);

      // 1. In-App Notification for User
      if (eventConfig?.userInApp && params.userId) {
        await this.notificationsService.create({
          userId: params.userId,
          title: params.title,
          message: userFormattedMessage,
          link: params.link,
          type: params.type,
          priority: params.priority || NotificationPriority.NORMAL,
          metadata: params.metadata,
        });
      }

      // 2. In-App Notification for Admin
      if (eventConfig?.adminInApp) {
        await this.notificationsService.create({
          role: Role.ADMIN,
          title: `[مدیریت] ${params.title}`,
          message: adminFormattedMessage,
          link: params.link,
          type: params.type,
          priority: params.priority || NotificationPriority.NORMAL,
          metadata: params.metadata,
        });
      }

      // 3. SMS for User
      if (settings.sms.enabled && eventConfig?.userSms && params.userPhone) {
        const smsParams: Record<string, string> = {};
        for (const [k, v] of Object.entries(params.templateVariables)) {
          smsParams[k] = String(v ?? '');
        }

        this.smsService
          .sendEventSms(params.userPhone, eventKey, smsParams, userFormattedMessage, 'CUSTOMER')
          .catch((err) => this.logger.error(`Failed to send User SMS for ${eventKey}: ${err.message}`));
      }

      // 4. SMS for Admin Alert Numbers
      if (
        settings.sms.enabled &&
        eventConfig?.adminSms &&
        settings.sms.adminAlertPhones &&
        settings.sms.adminAlertPhones.length > 0
      ) {
        const smsParams: Record<string, string> = {};
        for (const [k, v] of Object.entries(params.templateVariables)) {
          smsParams[k] = String(v ?? '');
        }

        for (const adminPhone of settings.sms.adminAlertPhones) {
          if (adminPhone && adminPhone.trim()) {
            this.smsService
              .sendEventSms(adminPhone.trim(), eventKey, smsParams, adminFormattedMessage, 'ADMIN')
              .catch((err) => this.logger.error(`Failed to send Admin SMS for ${eventKey}: ${err.message}`));
          }
        }
      }
    } catch (err: any) {
      this.logger.error(`Error in dispatchEvent for ${eventKey}: ${err.message}`, err.stack);
    }
  }

  // ----------------------------------------------------
  // Event: Order Created
  // ----------------------------------------------------
  @OnEvent('order.created')
  async handleOrderCreated(payload: { order: any }) {
    const { order } = payload;
    const customerPhone = order.customerPhone || order.shippingAddress?.phone;
    const formattedAmount = Number(order.totalAmount).toLocaleString('fa-IR');

    await this.dispatchEvent('order_created', {
      userId: order.userId,
      userPhone: customerPhone,
      title: `سفارش جدید ${order.orderNumber}`,
      defaultMessage: `${order.customerName} عزیز، سفارش شما با شماره ${order.orderNumber} به مبلغ ${formattedAmount} تومان با موفقیت ثبت شد.`,
      link: `/orders/${order.id}`,
      type: NotificationType.ORDER,
      priority: NotificationPriority.HIGH,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      templateVariables: {
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        totalAmount: formattedAmount,
      },
    });
  }

  // ----------------------------------------------------
  // Event: Order Status Changed
  // ----------------------------------------------------
  @OnEvent('order.status_changed')
  async handleOrderStatusChanged(payload: {
    order: any;
    oldStatus: OrderStatus;
    newStatus: OrderStatus;
    note?: string;
  }) {
    const { order, newStatus } = payload;
    const customerPhone = order.customerPhone || order.shippingAddress?.phone;

    switch (newStatus) {
      case OrderStatus.PROCESSING: {
        await this.dispatchEvent('order_processing', {
          userId: order.userId,
          userPhone: customerPhone,
          title: `پردازش سفارش ${order.orderNumber}`,
          defaultMessage: `سفارش ${order.orderNumber} وارد مرحله آماده‌سازی و پردازش شد.`,
          link: `/orders/${order.id}`,
          type: NotificationType.ORDER,
          templateVariables: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
          },
        });
        break;
      }
      case OrderStatus.SHIPPED: {
        const carrier = order.shippingCarrier || order.shippingMethod || 'پست / باربری';
        const tracking = order.trackingNumber || 'ثبت نشده';
        await this.dispatchEvent('order_shipped', {
          userId: order.userId,
          userPhone: customerPhone,
          title: `سفارش ${order.orderNumber} ارسال شد`,
          defaultMessage: `سفارش ${order.orderNumber} تحویل ${carrier} شد. کد رهگیری: ${tracking}`,
          link: `/orders/${order.id}`,
          type: NotificationType.ORDER,
          templateVariables: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            carrier,
            trackingNumber: tracking,
          },
        });
        break;
      }
      case OrderStatus.DELIVERED: {
        await this.dispatchEvent('order_delivered', {
          userId: order.userId,
          userPhone: customerPhone,
          title: `سفارش ${order.orderNumber} تحویل داده شد`,
          defaultMessage: `سفارش ${order.orderNumber} با موفقیت تحویل داده شد. از خرید شما سپاسگزاریم.`,
          link: `/orders/${order.id}`,
          type: NotificationType.ORDER,
          templateVariables: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
          },
        });
        break;
      }
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED: {
        const reason = payload.note || (newStatus === OrderStatus.CANCELLED ? 'لغو سفارش' : 'استرداد وجه');
        await this.dispatchEvent('order_cancelled', {
          userId: order.userId,
          userPhone: customerPhone,
          title: `سفارش ${order.orderNumber} لغو گردید`,
          defaultMessage: `سفارش ${order.orderNumber} لغو شد (${reason}). در صورت کسر وجه، مبلغ به کیف پول شما واریز گردید.`,
          link: `/orders/${order.id}`,
          type: NotificationType.ORDER,
          priority: NotificationPriority.HIGH,
          templateVariables: {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            reason,
          },
        });
        break;
      }
      default:
        break;
    }
  }

  // ----------------------------------------------------
  // Event: Wallet Credited / Debited
  // ----------------------------------------------------
  @OnEvent('wallet.credited')
  async handleWalletCredited(payload: {
    userId: string;
    amount: number;
    balanceAfter: number;
    description?: string;
    userPhone?: string;
  }) {
    const formattedAmount = payload.amount.toLocaleString('fa-IR');
    const formattedBalance = payload.balanceAfter.toLocaleString('fa-IR');

    await this.dispatchEvent('wallet_credited', {
      userId: payload.userId,
      userPhone: payload.userPhone,
      title: 'افزایش موجودی کیف پول',
      defaultMessage: `مبلغ ${formattedAmount} تومان به کیف پول شما واریز شد (${payload.description || 'شارژ حساب'}). موجودی فعلی: ${formattedBalance} تومان.`,
      link: '/wallets',
      type: NotificationType.WALLET,
      templateVariables: {
        amount: formattedAmount,
        balance: formattedBalance,
        reason: payload.description || 'واریز به حساب',
      },
    });
  }

  @OnEvent('wallet.debited')
  async handleWalletDebited(payload: {
    userId: string;
    amount: number;
    balanceAfter: number;
    description?: string;
    userPhone?: string;
    orderNumber?: string;
  }) {
    const formattedAmount = payload.amount.toLocaleString('fa-IR');
    const formattedBalance = payload.balanceAfter.toLocaleString('fa-IR');

    await this.dispatchEvent('wallet_debited', {
      userId: payload.userId,
      userPhone: payload.userPhone,
      title: 'کسر از موجودی کیف پول',
      defaultMessage: `مبلغ ${formattedAmount} تومان بابت ${payload.description || 'خرید'} از کیف پول شما کسر شد. موجودی جدید: ${formattedBalance} تومان.`,
      link: '/wallets',
      type: NotificationType.WALLET,
      templateVariables: {
        amount: formattedAmount,
        balance: formattedBalance,
        orderNumber: payload.orderNumber || '',
      },
    });
  }

  @OnEvent('wallet.expired')
  async handleWalletExpired(payload: {
    userId: string;
    amount: number;
    days: number;
    lastDepositDate?: string;
    userPhone?: string;
    customerName?: string;
  }) {
    const formattedAmount = payload.amount.toLocaleString('fa-IR');
    const formattedDays = payload.days.toLocaleString('fa-IR');

    await this.dispatchEvent('wallet_expired', {
      userId: payload.userId,
      userPhone: payload.userPhone,
      title: 'انقضای موجودی کیف پول',
      defaultMessage: `موجودی کیف پول شما به مبلغ ${formattedAmount} تومان به دلیل عدم فعالیت پس از ${formattedDays} روز منقضی گردید.`,
      link: '/wallets',
      type: NotificationType.WALLET,
      templateVariables: {
        amount: formattedAmount,
        days: formattedDays,
        lastDepositDate: payload.lastDepositDate || '—',
        customerName: payload.customerName || 'کاربر گرامی',
      },
    });
  }

  // ----------------------------------------------------
  // Event: Low Stock Alert
  // ----------------------------------------------------
  @OnEvent('inventory.low_stock')
  async handleLowStock(payload: {
    productId: string;
    productName: string;
    sku?: string;
    stockQuantity: number;
  }) {
    await this.dispatchEvent('inventory_low_stock', {
      title: `هشدار موجودی انبار: ${payload.productName}`,
      defaultMessage: `موجودی کالای "${payload.productName}" (SKU: ${payload.sku || '---'}) به ${payload.stockQuantity} عدد رسید.`,
      link: `/products/${payload.productId}`,
      type: NotificationType.INVENTORY,
      priority: NotificationPriority.HIGH,
      templateVariables: {
        productName: payload.productName,
        sku: payload.sku || '',
        stockQuantity: payload.stockQuantity,
      },
    });
  }

  // ----------------------------------------------------
  // Event: Blog Post Published
  // ----------------------------------------------------
  @OnEvent('blog.post_published')
  async handleBlogPostPublished(payload: { post: any }) {
    const { post } = payload;
    await this.dispatchEvent('blog_post_published', {
      title: `مقاله جدید: ${post.title}`,
      defaultMessage: `مقاله جدید "${post.title}" در مجله آنلاین فروشگاه منتشر شد.`,
      link: `/blog/${post.slug}`,
      type: NotificationType.BLOG,
      templateVariables: {
        postTitle: post.title,
        slug: post.slug,
        categoryName: post.category?.name || 'عمومی',
      },
    });
  }
}
