'use client';

import * as React from 'react';
import { Pencil, Trash2, Calendar, Gift, Zap, Clock, Package, Share2, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FlashDeal } from '@/types';
import { formatJalali, toPersianDigits } from '@/lib/jalali';
import { formatCurrency } from '@/lib/utils';

interface FlashDealsTableProps {
  deals: FlashDeal[];
  isLoading: boolean;
  onEdit: (deal: FlashDeal) => void;
  onDelete: (deal: FlashDeal) => void;
  onToggleActive: (deal: FlashDeal) => void;
}

export function FlashDealsTable({
  deals,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
}: FlashDealsTableProps) {
  if (isLoading) {
    return (
      <Card className="hidden md:block overflow-hidden shadow-2xs border-border/80 font-sans" dir="rtl">
        <CardContent className="p-12 text-center text-sm text-muted-foreground">
          در حال بارگذاری لیست جشنواره‌های شگفت‌انگیز...
        </CardContent>
      </Card>
    );
  }

  if (deals.length === 0) {
    return (
      <Card className="hidden md:block overflow-hidden shadow-2xs border-border/80 font-sans" dir="rtl">
        <CardContent className="p-12 text-center text-muted-foreground space-y-2">
          <Zap className="w-9 h-9 mx-auto text-muted-foreground/50" />
          <p className="text-sm font-semibold text-foreground">هیچ پیشنهاد شگفت‌انگیزی در این دسته‌بندی یافت نشد.</p>
          <p className="text-xs text-muted-foreground">با کلیک روی «تعریف پیشنهاد شگفت‌انگیز جدید» اولین کمپین را بسازید.</p>
        </CardContent>
      </Card>
    );
  }

  const renderStatus = (deal: FlashDeal) => {
    if (!deal.isActive) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full border border-border">
          غیرفعال دستی
        </span>
      );
    }
    if (deal.isExpired) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
          <Clock className="w-3 h-3" /> منقضی‌شده
        </span>
      );
    }
    if (deal.isUpcoming) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/50">
          <Calendar className="w-3 h-3" /> در انتظار شروع
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/50">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        در حال برگزاری
      </span>
    );
  };

  return (
    <Card className="hidden md:block overflow-hidden shadow-2xs border-border/80 font-sans" dir="rtl">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[320px] text-right text-xs font-bold text-foreground py-3.5">عنوان و مشخصات کمپین</TableHead>
              <TableHead className="text-right text-xs font-bold text-foreground py-3.5">وضعیت</TableHead>
              <TableHead className="text-right text-xs font-bold text-foreground py-3.5">بازه اعتبار (شمسی)</TableHead>
              <TableHead className="text-right text-xs font-bold text-foreground py-3.5">تعداد کالا</TableHead>
              <TableHead className="text-right text-xs font-bold text-foreground py-3.5">پاداش خریدار</TableHead>
              <TableHead className="text-right text-xs font-bold text-foreground py-3.5">پاداش معرف</TableHead>
              <TableHead className="text-center text-xs font-bold text-foreground py-3.5">فعال / غیرفعال</TableHead>
              <TableHead className="text-left text-xs font-bold text-foreground py-3.5 pl-6">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => {
              const itemsCount = deal.itemsCount || deal.items?.length || 0;
              return (
                <TableRow
                  key={deal.id}
                  onClick={() => onEdit(deal)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors group"
                >
                  {/* Title, Badge & Slogan */}
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 shrink-0 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>

                      <div className="space-y-0.5 min-w-0 text-right">
                        <div className="font-bold text-sm text-foreground flex items-center gap-2 group-hover:text-primary transition-colors truncate">
                          <span className="truncate">{deal.title}</span>
                          {deal.badgeText && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-primary border-primary/30 shrink-0 font-sans">
                              {deal.badgeText}
                            </Badge>
                          )}
                        </div>
                        {deal.description ? (
                          <p className="text-xs text-muted-foreground line-clamp-1">{deal.description}</p>
                        ) : (
                          <span className="text-xs text-muted-foreground">بدون توضیحات تکمیلی</span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-3 text-right">{renderStatus(deal)}</TableCell>

                  {/* Date range in Jalali */}
                  <TableCell className="py-3 text-right text-xs font-sans">
                    <div className="space-y-1 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">از:</span>
                        <span className="font-semibold text-foreground">{formatJalali(deal.startDate, 'short')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">تا:</span>
                        <span className="font-semibold text-foreground">{formatJalali(deal.endDate, 'short')}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Item count */}
                  <TableCell className="py-3 text-right font-sans">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted/70 text-foreground border border-border/80 whitespace-nowrap">
                      <Package className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{toPersianDigits(itemsCount)} کالا</span>
                    </span>
                  </TableCell>

                  {/* Cashback Amount */}
                  <TableCell className="py-3 text-right font-sans">
                    {deal.defaultCashback && Number(deal.defaultCashback) > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/70 whitespace-nowrap">
                        <Gift className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{formatCurrency(deal.defaultCashback)}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>

                  {/* Referrer Reward */}
                  <TableCell className="py-3 text-right font-sans">
                    {deal.defaultReferrerReward && Number(deal.defaultReferrerReward) > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/70 whitespace-nowrap">
                        <Share2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>{formatCurrency(deal.defaultReferrerReward)}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>

                  {/* Active Toggle Switch */}
                  <TableCell className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={deal.isActive}
                      onChange={() => onToggleActive(deal)}
                      className="rounded border-input text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      title={deal.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 text-left pl-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(deal)}
                        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground font-sans"
                      >
                        <Pencil className="w-3.5 h-3.5 ml-1" />
                        <span>ویرایش</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(deal)}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-sans"
                        title="حذف جشنواره"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
