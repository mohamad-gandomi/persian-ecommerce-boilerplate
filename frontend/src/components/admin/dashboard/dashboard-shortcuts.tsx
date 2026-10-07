'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  Tag,
  Palette,
  Wallet,
  Bell,
  Gift,
  Zap,
  Users,
  Settings,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';
import { useFeatures } from '@/lib/use-features';

interface ShortcutItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
}

export function DashboardShortcuts() {
  const { isEnabled } = useFeatures();

  const shortcuts = React.useMemo<ShortcutItem[]>(() => {
    const items: ShortcutItem[] = [
      {
        title: 'کاتالوگ محصولات',
        description: 'محصولات ساده و متغیر، قیمت‌گذاری و مشخصات فنی کالا.',
        href: '/products',
        icon: Package,
        iconBg: 'bg-primary/10 text-primary border-primary/20',
      },
      {
        title: 'سفارش‌ها و مرسولات',
        description: 'بررسی و تأیید پرداخت‌ها، پردازش و ارسال مرسولات مشتریان.',
        href: '/orders',
        icon: ShoppingBag,
        iconBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-200/50',
      },
    ];

    // Slot 3
    if (isEnabled('wallet')) {
      items.push({
        title: 'کیف‌پول‌ها و اعتبار',
        description: 'مدیریت اعتبار کاربران، گزارش تراکنش‌ها و انقضای شارژ.',
        href: '/wallets',
        icon: Wallet,
        iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-200/50',
      });
    } else if (isEnabled('coupons')) {
      items.push({
        title: 'کدهای تخفیف',
        description: 'تعریف کوپن‌های درصدی یا ثابت با تاریخ انقضا و سقف مجاز.',
        href: '/coupons',
        icon: Tag,
        iconBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 border-purple-200/50',
      });
    } else if (isEnabled('flashDeals')) {
      items.push({
        title: 'فروش شگفت‌انگیز',
        description: 'مدیریت حراج‌های زمان‌دار و پیشنهادات تخفیف ویژه.',
        href: '/flash-deals',
        icon: Zap,
        iconBg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-rose-200/50',
      });
    } else {
      items.push({
        title: 'کاربران و مشتریان',
        description: 'مدیریت اطلاعات و آدرس‌های مشتریان فروشگاه.',
        href: '/users',
        icon: Users,
        iconBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 border-indigo-200/50',
      });
    }

    // Slot 4
    if (isEnabled('notifications')) {
      items.push({
        title: 'مرکز اعلان‌ها و رویدادها',
        description: 'هشدارهای انبار، رویدادها، وضعیت ارسال و پیامک‌ها.',
        href: '/notifications',
        icon: Bell,
        iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-200/50',
      });
    } else if (isEnabled('referral')) {
      items.push({
        title: 'سیستم معرف و پاداش',
        description: 'مدیریت همکاران در فروش و کدهای معرف مشتریان.',
        href: '/referrals',
        icon: Gift,
        iconBg: 'bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-200 border-pink-200/50',
      });
    } else if (isEnabled('attributes')) {
      items.push({
        title: 'ویژگی‌ها و متغیرها',
        description: 'مدیریت تنوع کالا، رنگ‌ها، سایزها و مشخصات فنی.',
        href: '/attributes',
        icon: Palette,
        iconBg: 'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 border-teal-200/50',
      });
    } else {
      items.push({
        title: 'تنظیمات سامانه',
        description: 'پیکربندی هویت فروشگاه، درگاه‌های پرداخت و ماژول‌ها.',
        href: '/settings',
        icon: Settings,
        iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200/50',
      });
    }

    return items;
  }, [isEnabled]);

  return (
    <div className="space-y-3 font-sans" dir="rtl">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-muted-foreground">
          دسترسی‌های سریع پیشخوان
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/50 hover:border-border transition-all flex items-start gap-3.5 group shadow-2xs"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${item.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs text-foreground flex items-center justify-between">
                  <span>{item.title}</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
