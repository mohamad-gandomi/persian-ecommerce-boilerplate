'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, Tag, Palette, ArrowLeft } from 'lucide-react';

export function DashboardShortcuts() {
  return (
    <div className="space-y-3 font-sans" dir="rtl">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-muted-foreground">
          دسترسی‌های سریع پیشخوان
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Link
          href="/products"
          className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/50 hover:border-border transition-all flex items-start gap-3.5 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-105 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-xs text-foreground flex items-center justify-between">
              <span>کاتالوگ محصولات</span>
              <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-light">
              محصولات ساده و متغیر، قیمت‌گذاری و مشخصات فنی کالا.
            </p>
          </div>
        </Link>

        <Link
          href="/orders"
          className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/50 hover:border-border transition-all flex items-start gap-3.5 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0 border border-amber-200/50 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-xs text-foreground flex items-center justify-between">
              <span>سفارش‌ها و مرسولات</span>
              <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-light">
              بررسی و تأیید پرداخت‌ها، پردازش و ارسال مرسولات مشتریان.
            </p>
          </div>
        </Link>

        <Link
          href="/coupons"
          className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/50 hover:border-border transition-all flex items-start gap-3.5 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 flex items-center justify-center shrink-0 border border-purple-200/50 group-hover:scale-105 transition-transform">
            <Tag className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-xs text-foreground flex items-center justify-between">
              <span>کدهای تخفیف</span>
              <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-light">
              تعریف کوپن‌های درصدی یا ثابت با تاریخ انقضا و سقف مجاز استفاده.
            </p>
          </div>
        </Link>

        <Link
          href="/attributes"
          className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/50 hover:border-border transition-all flex items-start gap-3.5 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 flex items-center justify-center shrink-0 border border-emerald-200/50 group-hover:scale-105 transition-transform">
            <Palette className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-xs text-foreground flex items-center justify-between">
              <span>ویژگی‌ها و متغیرها</span>
              <ArrowLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:-translate-x-0.5 transition-all" />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed font-light">
              مدیریت تنوع کالا، رنگ‌ها، سایزها و مشخصات فنی.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
