'use client';

import * as React from 'react';
import { DollarSign, Scale } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProductPricingTabProps {
  basePrice: string;
  onBasePriceChange: (val: string) => void;
  salePrice: string;
  onSalePriceChange: (val: string) => void;
  stockQuantity: number;
  onStockQuantityChange: (val: number) => void;
  manageStock: boolean;
  onManageStockChange: (val: boolean) => void;
}

export function ProductPricingTab({
  basePrice,
  onBasePriceChange,
  salePrice,
  onSalePriceChange,
  stockQuantity,
  onStockQuantityChange,
  manageStock,
  onManageStockChange,
}: ProductPricingTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans text-right" dir="rtl">
      {/* Pricing Card */}
      <Card>
        <CardHeader className="text-right">
          <CardTitle className="text-base flex items-center gap-2 font-bold">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>ساختار قیمت‌گذاری کالا</span>
          </CardTitle>
          <CardDescription className="text-xs">
            تعیین قیمت پایه کاتالوگ و قیمت تخفیف‌خورده برای جشنواره‌ها و حراجی‌ها.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">قیمت پایه و اصلی (تومان) *</label>
            <Input
              type="number"
              step="1000"
              required
              value={basePrice}
              onChange={(e) => onBasePriceChange(e.target.value)}
              placeholder="مثلاً: ۱۵,۰۰۰,۰۰۰"
              className="font-sans text-xs text-left dir-ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              قیمت تخفیف‌خورده / حراجی (تومان)
            </label>
            <Input
              type="number"
              step="1000"
              value={salePrice}
              onChange={(e) => onSalePriceChange(e.target.value)}
              placeholder="اختیاری — مثلاً: ۱۲,۵۰۰,۰۰۰"
              className="font-sans text-xs text-left dir-ltr"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Card */}
      <Card>
        <CardHeader className="text-right">
          <CardTitle className="text-base flex items-center gap-2 font-bold">
            <Scale className="w-4 h-4 text-blue-600" />
            <span>مدیریت موجودی انبار</span>
          </CardTitle>
          <CardDescription className="text-xs">
            کنترل تعداد آماده ارسال و کسر خودکار پس از ثبت نهایی فاکتور.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">تعداد موجود در انبار (عدد)</label>
            <Input
              type="number"
              value={stockQuantity}
              onChange={(e) => onStockQuantityChange(parseInt(e.target.value, 10) || 0)}
              className="font-sans text-xs text-center"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium font-sans">
              <input
                type="checkbox"
                className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
                checked={manageStock}
                onChange={(e) => onManageStockChange(e.target.checked)}
              />
              <span>مدیریت خودکار انبار (کسر هوشمند موجودی هنگام خرید موفق مشتری)</span>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
