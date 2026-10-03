'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';

interface AttributeTermDeleteModalProps {
  target: { termId: string; termName: string; attributeName: string } | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (termId: string) => void;
}

export function AttributeTermDeleteModal({
  target,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: AttributeTermDeleteModalProps) {
  if (!target) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)] font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            حذف گزینه «{target.termName}»؟
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-1 text-xs sm:text-sm text-right">
            <p>
              آیا از حذف گزینه <strong className="text-foreground">«{target.termName}»</strong> از ویژگی{' '}
              <strong className="text-foreground">«{target.attributeName}»</strong> اطمینان دارید؟
            </p>
            <p className="text-destructive/90 font-medium text-xs">
              هشدار: تنوع‌های محصولاتی که از این گزینه استفاده می‌کنند ممکن است کالیته یا رنگ انتخابی خود را از دست بدهند.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
          <Button variant="outline" className="w-full sm:w-auto font-sans" onClick={onClose} disabled={isPending}>
            انصراف
          </Button>
          <HoldToDeleteButton
            className="w-full sm:w-auto font-semibold font-sans"
            onTrigger={() => onConfirm(target.termId)}
            isPending={isPending}
            label="تأیید و حذف گزینه"
            pendingLabel="در حال حذف..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
