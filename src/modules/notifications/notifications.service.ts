import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { PrismaService } from '@/database/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { SmsService } from '../sms/sms.service';
import { Role, NotificationType, NotificationPriority, Prisma } from '@prisma/client';
import {
  NOTIFICATION_SETTINGS_KEY,
  DEFAULT_NOTIFICATION_SETTINGS,
  NotificationSettingsData,
} from './notifications.constants';
import { FilterNotificationsDto } from './dto/filter-notifications.dto';
import { TestSmsDto, UpdateNotificationSettingsDto } from './dto/notification-settings.dto';

export interface CreateNotificationParams {
  userId?: string | null;
  role?: Role | null;
  title: string;
  message: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  link?: string | null;
  metadata?: any;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly stream$ = new Subject<{ event: string; data: any }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
    private readonly smsService: SmsService,
  ) {}

  /**
   * SSE Stream for real-time notification delivery
   */
  getEventStream(): Observable<{ event: string; data: any }> {
    return this.stream$.asObservable();
  }

  /**
   * Creates an in-app notification and dispatches to SSE stream
   */
  async create(params: CreateNotificationParams) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: params.userId || null,
        role: params.role || null,
        title: params.title,
        message: params.message,
        type: params.type || NotificationType.SYSTEM,
        priority: params.priority || NotificationPriority.NORMAL,
        link: params.link || null,
        metadata: params.metadata ? (params.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });

    // Push to realtime stream
    try {
      this.stream$.next({
        event: 'notification',
        data: notification,
      });
    } catch (err: any) {
      this.logger.warn(`Failed to push notification to SSE stream: ${err.message}`);
    }

    return notification;
  }

  /**
   * Customer notifications query
   */
  async findForUser(userId: string, filters: FilterNotificationsDto) {
    const { page = 1, limit = 20, type, unreadOnly, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      userId,
    };

    if (type) {
      where.type = type;
    }

    if (unreadOnly) {
      where.isRead = false;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin notifications query (notifications sent to ADMIN role or store-wide)
   */
  async findForAdmin(filters: FilterNotificationsDto) {
    const { page = 1, limit = 20, type, unreadOnly, search } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      role: Role.ADMIN,
    };

    if (type) {
      where.type = type;
    }

    if (unreadOnly) {
      where.isRead = false;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get unread count for user
   */
  async getUserUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Get unread count for admin
   */
  async getAdminUnreadCount(): Promise<number> {
    return this.prisma.notification.count({
      where: {
        role: Role.ADMIN,
        isRead: false,
      },
    });
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(id: string, userId?: string, isAdmin = false) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('اعلان مورد نظر یافت نشد');
    }

    if (!isAdmin && notification.userId !== userId) {
      throw new NotFoundException('دسترسی به این اعلان مجاز نیست');
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId?: string, isAdmin = false) {
    if (isAdmin) {
      return this.prisma.notification.updateMany({
        where: {
          role: Role.ADMIN,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
    }

    if (userId) {
      return this.prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string, userId?: string, isAdmin = false) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('اعلان مورد نظر یافت نشد');
    }

    if (!isAdmin && notification.userId !== userId) {
      throw new NotFoundException('دسترسی به این اعلان مجاز نیست');
    }

    return this.prisma.notification.delete({
      where: { id },
    });
  }

  /**
   * Get combined notification settings with fallback defaults
   */
  async getSettings(): Promise<NotificationSettingsData> {
    const stored = await this.settingsService.get(NOTIFICATION_SETTINGS_KEY);
    if (!stored) {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }

    // Deep merge events and providers
    const mergedEvents: Record<string, any> = {};
    const allEventKeys = Array.from(
      new Set([
        ...Object.keys(DEFAULT_NOTIFICATION_SETTINGS.events),
        ...Object.keys(stored.events || {}),
      ]),
    );

    for (const key of allEventKeys) {
      const defaultEvent = DEFAULT_NOTIFICATION_SETTINGS.events[key] || ({} as any);
      const storedEvent = stored.events?.[key] || {};
      mergedEvents[key] = {
        ...defaultEvent,
        ...storedEvent,
        category:
          storedEvent.category ||
          defaultEvent.category ||
          (key.startsWith('order')
            ? 'orders'
            : key.startsWith('wallet')
              ? 'wallet'
              : key.startsWith('inventory')
                ? 'inventory'
                : key.startsWith('blog')
                  ? 'blog'
                  : 'orders'),
        sendMode: storedEvent.sendMode || defaultEvent.sendMode || 'pattern',
        userInApp: storedEvent.userInApp ?? defaultEvent.userInApp ?? true,
        adminInApp: storedEvent.adminInApp ?? defaultEvent.adminInApp ?? false,
        userSms: storedEvent.userSms ?? defaultEvent.userSms ?? false,
        adminSms: storedEvent.adminSms ?? defaultEvent.adminSms ?? false,
      };
    }

    return {
      sms: {
        ...DEFAULT_NOTIFICATION_SETTINGS.sms,
        ...(stored.sms || {}),
        providers: {
          kavenegar: {
            ...DEFAULT_NOTIFICATION_SETTINGS.sms.providers.kavenegar,
            ...(stored.sms?.providers?.kavenegar || {}),
          },
          melipayamak: {
            ...DEFAULT_NOTIFICATION_SETTINGS.sms.providers.melipayamak,
            ...(stored.sms?.providers?.melipayamak || {}),
          },
        },
      },
      events: mergedEvents,
    };
  }

  /**
   * Update notification settings
   */
  async updateSettings(dto: UpdateNotificationSettingsDto): Promise<NotificationSettingsData> {
    const current = await this.getSettings();

    const updated: NotificationSettingsData = {
      sms: {
        ...current.sms,
        ...(dto.sms || {}),
        providers: {
          kavenegar: {
            ...current.sms.providers.kavenegar,
            ...(dto.sms?.providers?.kavenegar || {}),
          },
          melipayamak: {
            ...current.sms.providers.melipayamak,
            ...(dto.sms?.providers?.melipayamak || {}),
          },
        },
      },
      events: {
        ...current.events,
        ...(dto.events || {}),
      },
    };

    await this.settingsService.set(NOTIFICATION_SETTINGS_KEY, updated);
    this.logger.log('Notification and SMS settings updated successfully');
    return updated;
  }

  /**
   * Test SMS connection
   */
  async testSms(dto: TestSmsDto) {
    const settings = await this.getSettings();
    const creds =
      dto.credentials ||
      settings.sms?.providers?.[dto.providerId as 'kavenegar' | 'melipayamak'] ||
      {};

    return this.smsService.testConnection(dto.providerId, creds, dto.phone);
  }
}
