'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  ordersToFulfill: number;
}

export function DashboardHeader({ ordersToFulfill }: DashboardHeaderProps) {
  const todayFormatted = React.useMemo(() => {
    return new Intl.DateTimeFormat('fa-IR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 font-sans">
      <div className="space-y-1 text-right">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>عملیات زنده فروشگاه</span>
          <span className="text-border">•</span>
          <span>{todayFormatted}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-serif">
          مدیریت فروشگاه آنلاین
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
          کاتالوگ محصولات، خط پردازش سفارشات مشتریان و پایش پیوسته موجودی انبار.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
        <Link href="/products/new">
          <Button size="sm" className="gap-1.5 text-xs shadow-2xs font-semibold">
            <Plus className="w-3.5 h-3.5" />
            <span>ثبت محصول جدید</span>
          </Button>
        </Link>
        <Link href="/orders">
          <Button size="sm" variant="outline" className="gap-1.5 text-xs shadow-2xs bg-card hover:bg-accent">
            <ShoppingBag className="w-3.5 h-3.5 text-primary" />
            <span>سفارش‌ها ({ordersToFulfill})</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
