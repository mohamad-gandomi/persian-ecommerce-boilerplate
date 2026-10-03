'use client';

import * as React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { User } from '@/types';

interface UserDeleteModalProps {
  user: User | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (user: User) => void;
}

export function UserDeleteModal({
  user,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: UserDeleteModalProps) {
  if (!user) return null;

  const addressCount = user._count?.addresses || user.addresses?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)] font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            حذف حساب کاربری «{user.firstName} {user.lastName}»؟
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-1 text-xs sm:text-sm text-right">
            <p>
              آیا از حذف دائمی حساب کاربری{' '}
              <strong className="text-foreground">
                {user.firstName} {user.lastName} ({user.email})
              </strong>{' '}
              اطمینان کامل دارید؟
            </p>

            <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive space-y-1 text-xs text-right">
              <p className="font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                هشدار عملیات غیرقابل بازگشت:
              </p>
              <p>
                با این اقدام، پروفایل کاربری، دسترسی‌های ورود و تمامی{' '}
                <strong>{addressCount} نشانی ارسال ثبت‌شده</strong> برای همیشه حذف خواهند شد.
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
            onTrigger={() => onConfirm(user)}
            isPending={isPending}
            label="تأیید و حذف حساب"
            pendingLabel="در حال حذف حساب..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
