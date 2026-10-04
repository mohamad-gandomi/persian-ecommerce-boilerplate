'use client';

import * as React from 'react';
import { DollarSign, Scale, Gift } from 'lucide-react';
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
  rewardType?: 'INHERIT' | 'PERCENTAGE' | 'FIXED' | 'DISABLED';
  onRewardTypeChange?: (val: 'INHERIT' | 'PERCENTAGE' | 'FIXED' | 'DISABLED') => void;
  referrerRewardValue?: string;
  onReferrerRewardValueChange?: (val: string) => void;
  refereeRewardValue?: string;
  onRefereeRewardValueChange?: (val: string) => void;
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
  rewardType = 'INHERIT',
  onRewardTypeChange,
  referrerRewardValue = '',
  onReferrerRewardValueChange,
  refereeRewardValue = '',
  onRefereeRewardValueChange,
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

      {/* Referral & Rewards Card */}
      <Card className="lg:col-span-2 border-indigo-100 dark:border-indigo-950/60 bg-gradient-to-br from-card via-card to-indigo-50/20 dark:to-indigo-950/10">
        <CardHeader className="text-right">
          <CardTitle className="text-base flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-400">
            <Gift className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>تنظیمات پاداش و کمیسیون سیستم معرف (Referral & Rewards)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            تعیین پاداش اختصاصی برای ارجاع‌دهنده و خریدار این کالا، یا ارث‌بری از پیکربندی عمومی ماژول معرف سامانه.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">شیوه محاسبه پاداش</label>
              <select
                value={rewardType}
                onChange={(e) => onRewardTypeChange?.(e.target.value as any)}
                className="w-full text-xs h-9 rounded-md border border-input bg-background px-3 py-1 font-sans focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="INHERIT">ارث‌بری از تنظیمات سامانه (در صورت فعال بودن پاداش سراسری)</option>
                <option value="PERCENTAGE">درصد اختصاصی از مبلغ کالا (%)</option>
                <option value="FIXED">مبلغ ثابت به ازای هر خرید (تومان)</option>
                <option value="DISABLED">غیرفعال (عدم پرداخت پاداش برای این کالا)</option>
              </select>
            </div>

            {rewardType !== 'INHERIT' && rewardType !== 'DISABLED' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    پاداش معرف (کاربر ارجاع‌دهنده) {rewardType === 'PERCENTAGE' ? '(درصد ٪)' : '(تومان)'}
                  </label>
                  <Input
                    type="number"
                    step={rewardType === 'PERCENTAGE' ? '0.1' : '1000'}
                    value={referrerRewardValue}
                    onChange={(e) => onReferrerRewardValueChange?.(e.target.value)}
                    placeholder={rewardType === 'PERCENTAGE' ? 'مثلاً: ۵' : 'مثلاً: ۵۰,۰۰۰'}
                    className="font-sans text-xs text-left dir-ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    پاداش خریدار جدید {rewardType === 'PERCENTAGE' ? '(درصد ٪)' : '(تومان)'}
                  </label>
                  <Input
                    type="number"
                    step={rewardType === 'PERCENTAGE' ? '0.1' : '1000'}
                    value={refereeRewardValue}
                    onChange={(e) => onRefereeRewardValueChange?.(e.target.value)}
                    placeholder={rewardType === 'PERCENTAGE' ? 'مثلاً: ۳' : 'مثلاً: ۳۰,۰۰۰'}
                    className="font-sans text-xs text-left dir-ltr"
                  />
                </div>
              </>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground pt-1">
            * پاداش‌ها بلافاصله پس از تکمیل و تحویل نهایی سفارش (وضعیت DELIVERED) به صورت خودکار به کیف پول کاربران شارژ می‌شود. در صورتی که سامانه روی حالت «فقط پاداش اختصاصی» تنظیم شده باشد، صرفاً کالاهایی که درصد یا مبلغ اختصاصی دارند پاداش تولید می‌کنند.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
