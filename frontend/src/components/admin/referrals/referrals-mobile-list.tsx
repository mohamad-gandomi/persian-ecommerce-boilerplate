'use client';

import * as React from 'react';
import { Gift, Share2, UserCheck, Calendar, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ReferralItem } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ReferralsMobileListProps {
  referrals: ReferralItem[];
}

export function ReferralsMobileList({ referrals }: ReferralsMobileListProps) {
  if (referrals.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 md:hidden font-sans" dir="rtl">
      {referrals.map((item) => {
        const isCompleted = item.status === 'COMPLETED';
        const isPending = item.status === 'PENDING';

        return (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3.5 text-right font-sans hover:border-primary/40 transition-colors"
          >
            {/* Top row: Code Badge and Status */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20 dir-ltr font-sans">
                  <Share2 className="w-3 h-3 text-primary" />
                  <span>{item.referralCode?.code || 'کد معرف'}</span>
                </span>
              </div>

              <Badge
                variant={isCompleted ? 'success' : isPending ? 'secondary' : 'outline'}
                className="text-[10px] font-sans"
              >
                {isCompleted ? 'تکمیل‌شده (واریز پاداش)' : isPending ? 'در انتظار تکمیل' : 'لغوشده'}
              </Badge>
            </div>

            {/* Middle: Parties involved (Referrer and Referee) */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">معرف (کاربر ارجاع‌دهنده)</span>
                <span className="font-semibold text-foreground truncate block">
                  {item.referrer?.firstName} {item.referrer?.lastName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate block dir-ltr text-right">
                  {item.referrer?.email}
                </span>
              </div>

              <div className="space-y-0.5 border-r border-border/50 pr-2.5">
                <span className="text-[10px] text-muted-foreground block">خریدار دعوت‌شده</span>
                <span className="font-semibold text-foreground truncate block">
                  {item.referee?.firstName} {item.referee?.lastName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate block dir-ltr text-right">
                  {item.referee?.email}
                </span>
              </div>
            </div>

            {/* Bottom: Rewards & Order Details */}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground">پاداش معرف</span>
                <div className="font-bold text-purple-600 dark:text-purple-400 font-sans flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  <span>{formatCurrency(item.rewardAmountReferrer)}</span>
                </div>
              </div>

              <div className="space-y-0.5 text-right">
                <span className="text-[10px] text-muted-foreground">پاداش خریدار</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 font-sans flex items-center gap-1 justify-end">
                  <Gift className="w-3 h-3" />
                  <span>{formatCurrency(item.rewardAmountReferee)}</span>
                </div>
              </div>

              <div className="space-y-0.5 text-left">
                <span className="text-[10px] text-muted-foreground">تاریخ ثبت</span>
                <div className="text-[11px] text-muted-foreground font-sans flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </div>

            {item.orders && item.orders.length > 0 && (
              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3 text-primary" />
                  <span>سفارش متصل:</span>
                  <span className="font-semibold text-foreground font-sans dir-ltr">
                    {item.orders[0].orderNumber}
                  </span>
                </span>
                <span className="font-sans">
                  مبلغ: {formatCurrency(item.orders[0].totalAmount)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
