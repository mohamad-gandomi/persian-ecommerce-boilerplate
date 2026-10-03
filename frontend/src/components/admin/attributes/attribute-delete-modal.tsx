'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { Attribute } from '@/types';

interface AttributeDeleteModalProps {
  attribute: Attribute | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (attribute: Attribute) => void;
}

export function AttributeDeleteModal({
  attribute,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: AttributeDeleteModalProps) {
  if (!attribute) return null;

  const valuesCount = attribute.values?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)] font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            حذف ویژگی «{attribute.name}»؟
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-1 text-xs sm:text-sm text-right">
            <p>
              آیا از حذف دائمی ویژگی <strong className="text-foreground">«{attribute.name}»</strong> اطمینان دارید؟
            </p>
            <p className="text-destructive/90 font-medium text-xs">
              توجه: با حذف این ویژگی، تمامی <span className="underline">{valuesCount} گزینه و کالیته زیرمجموعه آن</span> نیز برای همیشه حذف خواهند شد.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
          <Button variant="outline" className="w-full sm:w-auto font-sans" onClick={onClose} disabled={isPending}>
            انصراف
          </Button>
          <HoldToDeleteButton
            className="w-full sm:w-auto font-semibold font-sans"
            onTrigger={() => onConfirm(attribute)}
            isPending={isPending}
            label="تأیید و حذف ویژگی"
            pendingLabel="در حال حذف..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
