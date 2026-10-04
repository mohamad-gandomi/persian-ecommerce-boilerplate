'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FlashDeal } from '@/types';

interface FlashDealDeleteModalProps {
  deal: FlashDeal | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
  isPending: boolean;
}

export function FlashDealDeleteModal({
  deal,
  isOpen,
  onOpenChange,
  onConfirm,
  isPending,
}: FlashDealDeleteModalProps) {
  if (!deal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md font-sans" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-base text-destructive">
            حذف پیشنهاد شگفت‌انگیز
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground leading-relaxed text-right py-2">
          آیا از حذف کمپین شگفت‌انگیز «<strong className="text-foreground">{deal.title}</strong>» اطمینان دارید؟
          با این کار تمام محصولات از این تخفیف ویژه خارج می‌شوند و به قیمت عادی بازمی‌گردند.
        </p>

        <DialogFooter className="pt-2 flex-row-reverse justify-start gap-2.5">
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => onConfirm(deal.id)}
            className="h-9 text-xs"
          >
            {isPending ? 'در حال حذف...' : 'بله، حذف شود'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="h-9 text-xs"
          >
            انصراف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
