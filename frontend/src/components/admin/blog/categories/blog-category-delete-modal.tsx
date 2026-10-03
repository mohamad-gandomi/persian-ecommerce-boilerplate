'use client';

import * as React from 'react';
import { AlertTriangle, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { BlogCategory } from '@/types';

interface BlogCategoryDeleteModalProps {
  category: BlogCategory | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (category: BlogCategory) => void;
}

export function BlogCategoryDeleteModal({
  category,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: BlogCategoryDeleteModalProps) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)] font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            حذف دسته‌بندی «{category.name}»؟
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-1 text-xs sm:text-sm text-right">
            <p>
              آیا از حذف دائمی دسته‌بندی موضوعی{' '}
              <strong className="text-foreground">«{category.name}»</strong> با نامک{' '}
              <span className="font-sans dir-ltr text-xs text-muted-foreground">/{category.slug}</span>{' '}
              اطمینان کامل دارید؟
            </p>

            <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive space-y-1 text-xs text-right">
              <p className="font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 shrink-0" />
                تأثیر بر مقالات و زیردسته‌ها:
              </p>
              <p>
                مقالات منتسب به این دسته حذف نخواهند شد و به عنوان بدون دسته‌بندی علامت‌گذاری می‌شوند. زیردسته‌های مرتبط نیز از این دسته جدا خواهند شد.
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
            onTrigger={() => onConfirm(category)}
            isPending={isPending}
            label="تأیید و حذف دسته‌بندی"
            pendingLabel="در حال حذف دسته‌بندی..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
