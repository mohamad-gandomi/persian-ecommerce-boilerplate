'use client';

import * as React from 'react';
import { Pencil, Trash2, Calendar, Gift, Zap, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FlashDeal } from '@/types';
import { formatJalali, toPersianDigits } from '@/lib/jalali';
import { formatCurrency } from '@/lib/utils';

interface FlashDealsMobileListProps {
  deals: FlashDeal[];
  isLoading: boolean;
  onEdit: (deal: FlashDeal) => void;
  onDelete: (deal: FlashDeal) => void;
  onToggleActive: (deal: FlashDeal) => void;
}

export function FlashDealsMobileList({
  deals,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: FlashDealsMobileListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3 md:hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl md:hidden font-sans">
        هیچ پیشنهاد شگفت‌انگیزی در این دسته‌بندی یافت نشد.
      </div>
    );
  }

  return (
    <div className="space-y-3 md:hidden font-sans" dir="rtl">
      {deals.map((deal) => (
        <div
          key={deal.id}
          className="bg-card border border-border/80 rounded-xl p-4 space-y-3 shadow-2xs hover:border-primary/40 transition-colors"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-foreground">{deal.title}</span>
                {deal.badgeText && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1 text-primary">
                    {deal.badgeText}
                  </Badge>
                )}
              </div>
              {deal.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">{deal.description}</p>
              )}
            </div>

            <Badge
              variant={deal.isCurrentlyActive ? 'default' : 'outline'}
              className={`text-[10px] shrink-0 ${
                deal.isCurrentlyActive ? 'bg-emerald-600' : 'text-muted-foreground'
              }`}
            >
              {deal.isCurrentlyActive ? 'در حال برگزاری' : deal.isUpcoming ? 'آینده' : 'منقضی‌شده'}
            </Badge>
          </div>

          {/* Details */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
            <span className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              <span>{toPersianDigits(deal.itemsCount || deal.items?.length || 0)} کالا</span>
            </span>

            <div className="flex items-center gap-2">
              {deal.defaultCashback && Number(deal.defaultCashback) > 0 && (
                <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
                  <Gift className="w-3.5 h-3.5" />
                  <span>{formatCurrency(deal.defaultCashback)}</span>
                </span>
              )}
              {deal.defaultReferrerReward && Number(deal.defaultReferrerReward) > 0 && (
                <span className="flex items-center gap-1 font-bold text-indigo-700 dark:text-indigo-400">
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1 rounded">معرف</span>
                  <span>{formatCurrency(deal.defaultReferrerReward)}</span>
                </span>
              )}
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground">
            مهلت: {formatJalali(deal.startDate, 'short')} تا {formatJalali(deal.endDate, 'short')}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={deal.isActive}
                onChange={() => onToggleActive(deal)}
                className="rounded border-input text-primary focus:ring-primary w-3.5 h-3.5"
              />
              <span className="text-[11px] text-muted-foreground">فعال بودن</span>
            </label>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(deal)}
                className="h-7 px-2 text-xs font-sans text-muted-foreground hover:text-foreground"
              >
                <Pencil className="w-3 h-3 ml-1" />
                <span>ویرایش</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(deal)}
                className="h-7 px-2 text-xs font-sans text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
