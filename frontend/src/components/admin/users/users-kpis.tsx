'use client';

import * as React from 'react';
import { Users, UserCheck, Sparkles, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface UsersKpisProps {
  total: number;
  customers: number;
  active: number;
  admins: number;
}

export function UsersKpis({
  total,
  customers,
  active,
  admins,
}: UsersKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans" dir="rtl">
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">کل حساب‌های کاربری</p>
            <p className="text-xl font-bold text-foreground font-sans">{total}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">مشتریان فروشگاه</p>
            <p className="text-xl font-bold text-wood-700 dark:text-wood-300 font-sans">{customers}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-wood-100 dark:bg-wood-950/40 text-wood-700 dark:text-wood-300 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">حساب‌های فعال</p>
            <p className="text-xl font-bold text-emerald-600 font-sans">{active}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">مدیران سیستم</p>
            <p className="text-xl font-bold text-foreground font-sans">{admins}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
