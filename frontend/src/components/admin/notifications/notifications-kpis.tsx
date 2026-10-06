'use client';

import * as React from 'react';
import { Bell, BellRing, ShoppingCart, Wallet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface NotificationsKpisProps {
  total: number;
  unread: number;
  orderCount: number;
  walletCount: number;
}

export function NotificationsKpis({
  total,
  unread,
  orderCount,
  walletCount,
}: NotificationsKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans" dir="rtl">
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">کل اعلان‌ها</p>
            <p className="text-xl font-bold text-foreground font-sans">{total}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">خوانده‌نشده</p>
            <p className="text-xl font-bold text-rose-600 dark:text-rose-400 font-sans">
              {unread}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/30 flex items-center justify-center">
            <BellRing className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">سفارش‌ها</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-sans">
              {orderCount}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">کیف‌پول و مالی</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-sans">
              {walletCount}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
