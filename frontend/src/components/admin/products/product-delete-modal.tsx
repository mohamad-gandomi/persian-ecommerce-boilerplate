'use client';

import * as React from 'react';
import { AlertTriangle, PackageX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { Product } from '@/types';

interface ProductDeleteModalProps {
  product: Product | null;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (product: Product) => void;
}

export function ProductDeleteModal({
  product,
  isOpen,
  isPending,
  onClose,
  onConfirm,
}: ProductDeleteModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)] font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            حذف محصول «{product.name}»؟
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-1 text-xs sm:text-sm text-right">
            <p>
              آیا از حذف دائمی محصول{' '}
              <strong className="text-foreground">«{product.name}»</strong> با شناسه کالا{' '}
              <span className="font-sans dir-ltr text-xs text-muted-foreground">{product.sku || 'بدون شناسه'}</span>{' '}
              اطمینان کامل دارید؟
            </p>

            <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive space-y-1 text-xs text-right">
              <p className="font-semibold flex items-center gap-1.5">
                <PackageX className="w-3.5 h-3.5 shrink-0" />
                هشدار عملیات غیرقابل بازگشت:
              </p>
              <p>
                با حذف این محصول، تمامی تنوع‌ها، ویژگی‌های فنی، قیمت‌گذاری‌ها و گالری تصاویر آن به طور کامل از فروشگاه حذف خواهند شد.
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
            onTrigger={() => onConfirm(product)}
            isPending={isPending}
            label="تأیید و حذف محصول"
            pendingLabel="در حال حذف محصول..."
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
