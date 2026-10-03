'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';

interface UserAddressDeleteModalProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UserAddressDeleteModal({
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: UserAddressDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)] font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            حذف نشانی ذخیره‌شده؟
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm pt-1 text-right">
            آیا از حذف این نشانی از حساب کاربری اطمینان دارید؟
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
          <Button variant="outline" className="w-full sm:w-auto font-sans" onClick={onClose} disabled={isPending}>
            انصراف
          </Button>
          <HoldToDeleteButton
            className="w-full sm:w-auto font-semibold font-sans"
            onTrigger={onConfirm}
            isPending={isPending}
            label="تأیید و حذف نشانی"
            pendingLabel="در حال حذف..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
