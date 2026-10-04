'use client';

import * as React from 'react';
import { Zap, Flame, Clock, Archive } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toPersianDigits } from '@/lib/jalali';

interface FlashDealsKpisProps {
  total: number;
  active: number;
  upcoming: number;
  expired: number;
}

export function FlashDealsKpis({
  total,
  active,
  upcoming,
  expired,
}: FlashDealsKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans" dir="rtl">
      {/* 1. Total Deals */}
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">کل جشنواره‌ها</p>
            <p className="text-xl font-bold text-foreground font-sans">
              {toPersianDigits(total)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Zap className="w-4 h-4 fill-primary/20" />
          </div>
        </CardContent>
      </Card>

      {/* 2. Active Deals */}
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">در حال برگزاری (فعال)</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-sans">
              {toPersianDigits(active)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-emerald-500/20" />
          </div>
        </CardContent>
      </Card>

      {/* 3. Upcoming Deals */}
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">در انتظار شروع (آینده)</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-sans">
              {toPersianDigits(upcoming)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      {/* 4. Expired Deals */}
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">منقضی‌شده</p>
            <p className="text-xl font-bold text-wood-700 dark:text-wood-300 font-sans">
              {toPersianDigits(expired)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-wood-100 dark:bg-wood-950/40 text-wood-700 dark:text-wood-300 flex items-center justify-center">
            <Archive className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
