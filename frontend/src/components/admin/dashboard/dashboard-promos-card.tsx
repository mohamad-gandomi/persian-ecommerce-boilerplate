'use client';

import * as React from 'react';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Coupon } from '@/types';

interface DashboardPromosCardProps {
  couponsLoading: boolean;
  activeCoupons: Coupon[];
}

export function DashboardPromosCard({ couponsLoading, activeCoupons }: DashboardPromosCardProps) {
  return (
    <Card className="shadow-2xs border-border/70 font-sans" dir="rtl">
      <CardHeader className="pb-3 px-4 sm:px-6 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            <span>کدهای تخفیف فعال</span>
          </CardTitle>
          <CardDescription className="text-xs">
            تخفیف‌های فعال در سبد خرید مشتریان
          </CardDescription>
        </div>
        <Link href="/coupons">
          <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary h-7 px-2">
            مشاهده همه
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-5 space-y-2.5">
        {couponsLoading ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            در حال بارگذاری کدهای تخفیف...
          </div>
        ) : activeCoupons.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-border/70 text-center space-y-2">
            <Tag className="w-5 h-5 text-muted-foreground mx-auto" />
            <div className="text-xs font-semibold text-foreground">هیچ کد تخفیف فعالی وجود ندارد</div>
            <div className="text-[11px] text-muted-foreground">
              با ایجاد کد تخفیف جدید، فروش کالکشن‌های دست‌ساز را افزایش دهید.
            </div>
            <Link href="/coupons" className="inline-block pt-1">
              <Button size="sm" variant="outline" className="text-xs h-7">
                ایجاد کد تخفیف جدید
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {activeCoupons.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-card/60 hover:bg-accent/40 transition-colors text-xs"
              >
                <div className="min-w-0 pl-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-bold text-primary">{c.code}</span>
                    <span className="text-[10px] text-muted-foreground font-sans">({c.usageCount} بار استفاده)</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {c.endDate ? `معتبر تا ${formatDate(c.endDate)}` : 'بدون محدودیت زمانی'}
                  </div>
                </div>
                <Badge variant="wood" className="text-[10px] shrink-0 font-sans">
                  {c.discountType === 'PERCENTAGE'
                    ? `${c.discountValue}٪ تخفیف`
                    : `${formatCurrency(c.discountValue)} تخفیف`}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
