'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Coupon, DiscountType } from '@/types';
import { CouponFormFields } from './coupon-form-fields';

interface CouponFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCoupon: Coupon | null;
  onSubmit: (payload: any) => void;
  isPending: boolean;
  errorMsg?: string;
}

export function CouponFormModal(props: CouponFormModalProps) {
  const { isOpen, onOpenChange, editingCoupon, onSubmit, isPending, errorMsg } = props;

  const [code, setCode] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [discountType, setDiscountType] = React.useState<DiscountType>('PERCENTAGE');
  const [discountValue, setDiscountValue] = React.useState('');
  const [minOrderAmount, setMinOrderAmount] = React.useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [usageLimit, setUsageLimit] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (editingCoupon) {
      setCode(editingCoupon.code);
      setDescription(editingCoupon.description || '');
      setDiscountType(editingCoupon.discountType);
      setDiscountValue(String(editingCoupon.discountValue));
      setMinOrderAmount(editingCoupon.minOrderAmount ? String(editingCoupon.minOrderAmount) : '');
      setMaxDiscountAmount(editingCoupon.maxDiscountAmount ? String(editingCoupon.maxDiscountAmount) : '');
      setStartDate(editingCoupon.startDate ? new Date(editingCoupon.startDate) : null);
      setEndDate(editingCoupon.endDate ? new Date(editingCoupon.endDate) : null);
      setUsageLimit(editingCoupon.usageLimit ? String(editingCoupon.usageLimit) : '');
      setIsActive(editingCoupon.isActive);
    } else {
      setCode('');
      setDescription('');
      setDiscountType('PERCENTAGE');
      setDiscountValue('10');
      setMinOrderAmount('');
      setMaxDiscountAmount('');
      setStartDate(null);
      setEndDate(null);
      setUsageLimit('');
      setIsActive(true);
    }
  }, [editingCoupon, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(discountValue);
    onSubmit({
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      discountType,
      discountValue: val,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      usageLimit: usageLimit ? parseInt(usageLimit, 10) : null,
      isActive,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg font-sans" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingCoupon ? 'ویرایش کد تخفیف' : 'تعریف کد تخفیف جدید'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}

          <CouponFormFields
            code={code} setCode={setCode}
            description={description} setDescription={setDescription}
            discountType={discountType} setDiscountType={setDiscountType}
            discountValue={discountValue} setDiscountValue={setDiscountValue}
            minOrderAmount={minOrderAmount} setMinOrderAmount={setMinOrderAmount}
            maxDiscountAmount={maxDiscountAmount} setMaxDiscountAmount={setMaxDiscountAmount}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            usageLimit={usageLimit} setUsageLimit={setUsageLimit}
            isActive={isActive} setIsActive={setIsActive}
          />

          <DialogFooter className="pt-2 flex-row-reverse justify-start gap-2.5 sm:gap-3">
            <Button type="submit" disabled={isPending} className="h-9 text-xs">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCoupon ? 'ذخیره تغییرات' : 'ثبت کد تخفیف'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs">
              انصراف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
