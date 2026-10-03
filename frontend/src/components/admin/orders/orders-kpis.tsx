'use client';

import * as React from 'react';
import { ShoppingBag, Clock, Truck, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface OrdersKpisProps {
  stats: any;
}

export function OrdersKpis({ stats }: OrdersKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans" dir="rtl">
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">کل سفارش‌ها</p>
            <p className="text-xl font-bold text-foreground font-sans">{stats?.totalOrders || 0}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">نیازمند بررسی</p>
            <p className="text-xl font-bold text-amber-700 dark:text-amber-400 font-sans">
              {stats?.pendingCount || 0}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">در حال ساخت و ارسال</p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-400 font-sans">
              {(stats?.processingCount || 0) + (stats?.shippedCount || 0)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">فروش ناخالص</p>
            <p className="text-xl font-bold text-emerald-600 font-sans">
              {formatCurrency(stats?.totalRevenue || 0)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
