'use client';

import * as React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShippingMethodOption } from '@/types';

interface ShippingMethodDeleteModalProps {
  method: ShippingMethodOption | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function ShippingMethodDeleteModal({
  method,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: ShippingMethodDeleteModalProps) {
  if (!method) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md font-sans" dir="rtl">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2 mx-auto sm:mx-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogTitle className="text-right">حذف روش ارسال</DialogTitle>
          <DialogDescription className="text-right leading-relaxed font-light">
            آیا از حذف روش ارسال{' '}
            <strong className="text-foreground font-sans">«{method.name}»</strong> اطمینان دارید؟
            این عملیات غیرقابل بازگشت است و تعرفه مربوطه از محاسبات سبد خرید خارج خواهد شد.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto font-sans"
            onClick={onClose}
            disabled={isPending}
          >
            انصراف
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full sm:w-auto font-semibold font-sans"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال حذف...
              </span>
            ) : (
              'حذف روش ارسال'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
