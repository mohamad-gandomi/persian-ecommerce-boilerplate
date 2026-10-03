'use client';

import * as React from 'react';
import { Copy, Check, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Coupon } from '@/types';

interface CouponsMobileListProps {
  coupons: Coupon[];
  isLoading: boolean;
  copiedCode: string | null;
  onCopy: (code: string) => void;
  onEdit: (c: Coupon) => void;
  onDeleteClick: (c: Coupon) => void;
}

export function CouponsMobileList(props: CouponsMobileListProps) {
  const { coupons, isLoading, copiedCode, onCopy, onEdit, onDeleteClick } = props;

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground text-sm font-sans">در حال بارگذاری کدهای تخفیف...</div>;
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-border rounded-xl font-sans">
        هیچ کد تخفیفی یافت نشد.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:hidden font-sans" dir="rtl">
      {coupons.map((coupon) => (
        <div key={coupon.id} className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-primary font-sans">{coupon.code}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground" onClick={() => onCopy(coupon.code)}>
                  {copiedCode === coupon.code ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              {coupon.description && <p className="text-xs text-muted-foreground mt-0.5">{coupon.description}</p>}
            </div>
            <Badge variant={coupon.isActive ? 'default' : 'outline'} className={`text-[10px] ${coupon.isActive ? 'bg-emerald-600' : 'text-muted-foreground'}`}>
              {coupon.isActive ? 'فعال' : 'غیرفعال'}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
            <span className="font-semibold text-foreground">
              {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}٪ تخفیف` : `${formatCurrency(coupon.discountValue)} تخفیف`}
            </span>
            <span className="text-muted-foreground font-sans">{coupon.usageCount} بار استفاده</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
            <span>{coupon.endDate ? `معتبر تا ${formatDate(coupon.endDate)}` : 'اعتبار نامحدود'}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => onEdit(coupon)} title="ویرایش">
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => onDeleteClick(coupon)} title="حذف">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
