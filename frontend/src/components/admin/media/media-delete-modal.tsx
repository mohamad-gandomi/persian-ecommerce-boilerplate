'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { MediaItem } from '@/types';
import { formatBytes } from './media-utils';

interface MediaDeleteModalProps {
  item: MediaItem | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (item: MediaItem) => void;
}

export function MediaDeleteModal({
  item,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: MediaDeleteModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)] font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            حذف پرونده رسانه؟
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2 text-xs sm:text-sm text-right">
            <p>
              آیا از حذف دائمی پرونده <strong className="text-foreground">«{item.originalName}»</strong> اطمینان دارید؟
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-destructive/20 bg-destructive/5 text-xs text-right">
              <div className="w-12 h-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={item.url}
                  alt={item.altText || item.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="font-semibold text-foreground truncate">{item.originalName}</p>
                <p className="text-muted-foreground text-[11px] font-sans">
                  {formatBytes(item.size)} • {item.mimeType}
                </p>
              </div>
            </div>
            <p className="text-destructive/90 font-medium text-xs">
              این عملیات غیرقابل بازگشت است. فایل رسانه هم از دیسک سرور و هم از پایگاه‌داده حذف خواهد شد.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
          <Button variant="outline" className="w-full sm:w-auto font-sans" onClick={onClose} disabled={isPending}>
            انصراف
          </Button>
          <HoldToDeleteButton
            className="w-full sm:w-auto font-semibold font-sans"
            onTrigger={() => onConfirm(item)}
            isPending={isPending}
            label="تأیید و حذف دائمی"
            pendingLabel="در حال حذف..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
