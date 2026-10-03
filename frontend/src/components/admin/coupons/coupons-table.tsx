'use client';

import * as React from 'react';
import { Copy, Check, Pencil, Trash2, Clock, Calendar, Tag } from 'lucide-react';
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
import { formatCurrency, formatDate } from '@/lib/utils';
import { Coupon } from '@/types';

interface CouponsTableProps {
  coupons: Coupon[];
  isLoading: boolean;
  copiedCode: string | null;
  onCopy: (code: string) => void;
  onEdit: (c: Coupon) => void;
  onDeleteClick: (c: Coupon) => void;
  onToggleActive: (c: Coupon) => void;
}

export function CouponsTable(props: CouponsTableProps) {
  const {
    coupons,
    isLoading,
    copiedCode,
    onCopy,
    onEdit,
    onDeleteClick,
    onToggleActive,
  } = props;

  const renderValidity = (start?: string | null, end?: string | null) => {
    const now = new Date();
    if (end && now > new Date(end)) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
          <Clock className="w-3 h-3" /> منقضی شده
        </span>
      );
    }
    if (start && now < new Date(start)) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
          <Clock className="w-3 h-3" /> آغاز در آینده
        </span>
      );
    }
    if (end) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
          <Calendar className="w-3 h-3" /> تا {formatDate(end)}
        </span>
      );
    }
    return <span className="text-[11px] text-muted-foreground">نامحدود</span>;
  };

  return (
    <Card className="hidden md:block overflow-hidden font-sans shadow-xs border-border/80" dir="rtl">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[160px] text-right">کد تخفیف</TableHead>
              <TableHead className="text-right">نوع و مقدار</TableHead>
              <TableHead className="text-right">محدودیت‌ها و سقف</TableHead>
              <TableHead className="text-right">اعتبار زمانی</TableHead>
              <TableHead className="text-center">تعداد استفاده</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead className="text-left pl-4">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                  در حال بارگذاری کدهای تخفیف...
                </TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Tag className="w-8 h-8 text-muted-foreground/50" />
                    <p className="font-semibold text-foreground text-sm">هیچ کد تخفیفی یافت نشد</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-muted/40">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary font-sans text-xs">{coupon.code}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => onCopy(coupon.code)}
                        title="کپی کردن کد"
                      >
                        {copiedCode === coupon.code ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                    {coupon.description && <p className="text-[11px] text-muted-foreground truncate max-w-[160px] mt-0.5">{coupon.description}</p>}
                  </TableCell>

                  <TableCell className="text-xs">
                    <Badge variant={coupon.discountType === 'PERCENTAGE' ? 'default' : 'secondary'} className="text-[10px] font-sans">
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}٪ تخفیف` : `${formatCurrency(coupon.discountValue)} تخفیف`}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-[11px] text-muted-foreground space-y-0.5">
                    {coupon.minOrderAmount ? <div>حداقل سفارش: <span className="font-sans font-semibold text-foreground">{formatCurrency(coupon.minOrderAmount)}</span></div> : <div>بدون حداقل مبلغ</div>}
                    {coupon.maxDiscountAmount ? <div>سقف: <span className="font-sans font-semibold text-foreground">{formatCurrency(coupon.maxDiscountAmount)}</span></div> : null}
                  </TableCell>

                  <TableCell>{renderValidity(coupon.startDate, coupon.endDate)}</TableCell>

                  <TableCell className="text-center text-xs font-sans">
                    <span className="font-bold">{coupon.usageCount}</span>
                    {coupon.usageLimit && <span className="text-muted-foreground"> / {coupon.usageLimit}</span>}
                  </TableCell>

                  <TableCell className="text-center">
                    <button type="button" onClick={() => onToggleActive(coupon)} className="cursor-pointer" title="تغییر وضعیت">
                      <Badge variant={coupon.isActive ? 'default' : 'outline'} className={`text-[10px] ${coupon.isActive ? 'bg-emerald-600' : 'text-muted-foreground'}`}>
                        {coupon.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </button>
                  </TableCell>

                  <TableCell className="text-left pl-4">
                    <div className="flex items-center justify-start gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => onEdit(coupon)} title="ویرایش کد تخفیف">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => onDeleteClick(coupon)} title="حذف کد تخفیف">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
