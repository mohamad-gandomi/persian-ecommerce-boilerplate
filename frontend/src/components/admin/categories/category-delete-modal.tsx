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
import { Category } from '@/types';

interface CategoryDeleteModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: Category) => void;
  isPending: boolean;
}

export function CategoryDeleteModal({
  category,
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: CategoryDeleteModalProps) {
  if (!category) return null;

  const hasChildren = category.children && category.children.length > 0;
  const productCount = category._count?.products || 0;

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
              آیا از حذف همیشگی دسته‌بندی <strong className="text-foreground">«{category.name}»</strong> اطمینان دارید؟
            </p>

            {hasChildren && (
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive space-y-1">
                <p className="font-semibold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  هشدار حذف زنجیره‌ای زیردسته‌ها:
                </p>
                <p className="text-xs">
                  این دسته‌بندی شامل <strong>{category.children!.length} زیردسته</strong> است (
                  {category.children!.map((c) => c.name).join('، ')}). تمام زیردسته‌ها نیز همراه آن حذف خواهند شد!
                </p>
              </div>
            )}

            {productCount > 0 && (
              <p className="text-destructive/90 font-medium text-xs">
                توجه: در حال حاضر {productCount} محصول در این دسته‌بندی قرار دارد.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
          <Button
            variant="outline"
            className="w-full sm:w-auto font-sans"
            onClick={onClose}
            disabled={isPending}
          >
            انصراف
          </Button>
          <HoldToDeleteButton
            className="w-full sm:w-auto font-semibold font-sans"
            onTrigger={() => onConfirm(category)}
            isPending={isPending}
            label="تأیید و حذف دائمی"
            pendingLabel="در حال حذف..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
