'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { PersianDatePicker } from '@/components/ui/persian-date-picker';
import { DiscountType } from '@/types';

interface CouponFormFieldsProps {
  code: string; setCode: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  discountType: DiscountType; setDiscountType: (v: DiscountType) => void;
  discountValue: string; setDiscountValue: (v: string) => void;
  minOrderAmount: string; setMinOrderAmount: (v: string) => void;
  maxDiscountAmount: string; setMaxDiscountAmount: (v: string) => void;
  startDate: Date | null; setStartDate: (v: Date | null) => void;
  endDate: Date | null; setEndDate: (v: Date | null) => void;
  usageLimit: string; setUsageLimit: (v: string) => void;
  isActive: boolean; setIsActive: (v: boolean) => void;
}

export function CouponFormFields(props: CouponFormFieldsProps) {
  const {
    code, setCode, description, setDescription, discountType, setDiscountType,
    discountValue, setDiscountValue, minOrderAmount, setMinOrderAmount,
    maxDiscountAmount, setMaxDiscountAmount, startDate, setStartDate,
    endDate, setEndDate, usageLimit, setUsageLimit, isActive, setIsActive,
  } = props;

  return (
    <div className="space-y-3 font-sans">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">کد تخفیف (لاتین) *</label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="مثلاً DISCOUNT10"
            className="h-9 text-xs font-sans text-left"
            dir="ltr"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">نوع تخفیف</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as DiscountType)}
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs font-sans text-right"
          >
            <option value="PERCENTAGE">درصدی (٪)</option>
            <option value="FIXED_AMOUNT">مبلغ ثابت (تومان)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">مقدار تخفیف *</label>
          <Input
            type="number"
            min="0"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            placeholder="10"
            className="h-9 text-xs font-sans text-left"
            dir="ltr"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">حداقل مبلغ سفارش</label>
          <Input
            type="number"
            min="0"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
            placeholder="اختیاری"
            className="h-9 text-xs font-sans text-left"
            dir="ltr"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">سقف تخفیف (تومان)</label>
          <Input
            type="number"
            min="0"
            value={maxDiscountAmount}
            onChange={(e) => setMaxDiscountAmount(e.target.value)}
            placeholder="اختیاری"
            className="h-9 text-xs font-sans text-left"
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">تاریخ آغاز اعتبار (شمسی)</label>
          <PersianDatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder="آغاز اعتبار (اختیاری)..."
            startYear={1400}
            endYear={1415}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">تاریخ پایان اعتبار (شمسی)</label>
          <PersianDatePicker
            value={endDate}
            onChange={setEndDate}
            minDate={startDate || undefined}
            placeholder="پایان اعتبار (اختیاری)..."
            startYear={1400}
            endYear={1415}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">سقف مجاز تعداد استفاده</label>
        <Input
          type="number"
          min="1"
          value={usageLimit}
          onChange={(e) => setUsageLimit(e.target.value)}
          placeholder="مثلاً ۱۰۰ بار در کل (خالی = نامحدود)"
          className="h-9 text-xs font-sans text-left"
          dir="ltr"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-foreground">عنوان یا توضیح عمومی</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="مثلاً تخفیف ویژه افتتاحیه..."
          className="h-9 text-xs text-right"
        />
      </div>

      <div className="pt-1">
        <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-input text-primary focus:ring-primary"
          />
          <span>کد تخفیف فعال و قابل استفاده باشد</span>
        </label>
      </div>
    </div>
  );
}
