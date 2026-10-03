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

interface OrderDetailDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

export function OrderDetailDeleteModal(props: OrderDetailDeleteModalProps) {
  const { isOpen, onClose, orderNumber, onConfirmDelete, isDeleting } = props;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md font-sans" dir="rtl">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2 mx-auto sm:mx-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogTitle className="text-right">حذف سفارش از سامانه</DialogTitle>
          <DialogDescription className="text-right leading-relaxed font-light">
            آیا از حذف دائمی سفارش شماره{' '}
            <strong className="text-foreground font-sans">{orderNumber}</strong> اطمینان دارید؟
            این عملیات غیرقابل بازگشت بوده و کلیه سوابق پرداختی و لاگ‌های پردازش آن پاک خواهد شد.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2.5 sm:gap-3 flex-row-reverse justify-start">
          <HoldToDeleteButton
            onTrigger={onConfirmDelete}
            isPending={isDeleting}
            label="نگه دارید تا حذف شود"
            pendingLabel="در حال حذف سفارش..."
          />
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="text-xs h-9"
          >
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
