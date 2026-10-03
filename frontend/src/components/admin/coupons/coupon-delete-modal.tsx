'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { Coupon } from '@/types';

interface CouponDeleteModalProps {
  coupon: Coupon | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => void;
  isPending: boolean;
}

export function CouponDeleteModal(props: CouponDeleteModalProps) {
  const { coupon, onClose, onConfirmDelete, isPending } = props;

  return (
    <Dialog open={Boolean(coupon)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md font-sans" dir="rtl">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2 mx-auto sm:mx-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogTitle className="text-right">حذف کد تخفیف</DialogTitle>
          <DialogDescription className="text-right leading-relaxed font-light">
            آیا از حذف دائمی کد تخفیف{' '}
            <strong className="text-foreground font-sans">{coupon?.code}</strong> اطمینان دارید؟
            این عملیات غیرقابل بازگشت است و مشتریان دیگر قادر به استفاده از آن نخواهند بود.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2.5 sm:gap-3 flex-row-reverse justify-start">
          <HoldToDeleteButton
            onTrigger={() => {
              if (coupon) {
                onConfirmDelete(coupon.id);
              }
            }}
            isPending={isPending}
            label="نگه دارید تا حذف شود"
            pendingLabel="در حال حذف کد تخفیف..."
          />
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="text-xs h-9"
          >
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
