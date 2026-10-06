'use client';

import * as React from 'react';
import { AlertTriangle, BellOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { NotificationItem } from '@/lib/api';

interface NotificationDeleteModalProps {
  notification: NotificationItem | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (notification: NotificationItem) => void;
}

export function NotificationDeleteModal({
  notification,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: NotificationDeleteModalProps) {
  if (!notification) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)] font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            حذف اعلان «{notification.title}»؟
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-1 text-xs sm:text-sm text-right">
            <p>
              آیا از حذف دائمی این اعلان با عنوان{' '}
              <strong className="text-foreground">«{notification.title}»</strong> اطمینان دارید؟
            </p>

            <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive space-y-1 text-xs text-right">
              <p className="font-semibold flex items-center gap-1.5">
                <BellOff className="w-3.5 h-3.5 shrink-0" />
                هشدار عملیات غیرقابل بازگشت:
              </p>
              <p>
                این اعلان برای همیشه از بایگانی تاریخچه اعلان‌های مدیریت حذف خواهد شد.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
          <Button variant="outline" className="w-full sm:w-auto font-sans" onClick={onClose} disabled={isPending}>
            انصراف
          </Button>
          <HoldToDeleteButton
            className="w-full sm:w-auto font-semibold font-sans"
            onTrigger={() => onConfirm(notification)}
            isPending={isPending}
            label="تأیید و حذف اعلان"
            pendingLabel="در حال حذف اعلان..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
