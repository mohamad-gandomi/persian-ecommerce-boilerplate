'use client';

import * as React from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryImageFieldProps {
  selectedImageUrl?: string;
  onClearImage: () => void;
  onOpenMediaPicker: () => void;
}

export function CategoryImageField({
  selectedImageUrl,
  onClearImage,
  onOpenMediaPicker,
}: CategoryImageFieldProps) {
  return (
    <div className="p-3 sm:p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-3 w-full min-w-0 overflow-hidden font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 shrink-0">
          <ImageIcon className="w-3.5 h-3.5 text-primary shrink-0" />
          تصویر شاخص دسته‌بندی
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs h-8 sm:h-7 gap-1 w-full sm:w-auto shrink-0 font-sans"
          onClick={onOpenMediaPicker}
        >
          <Plus className="w-3 h-3 shrink-0" />
          انتخاب از رسانه‌ها
        </Button>
      </div>

      {selectedImageUrl ? (
        <div className="flex items-center justify-between gap-2.5 p-2 rounded-lg border border-border bg-card w-full min-w-0 overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0 shadow-2xs">
              <img src={selectedImageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p className="text-xs font-medium text-foreground truncate">تصویر شاخص انتخاب‌شده</p>
              <p className="text-[10px] text-muted-foreground truncate font-sans dir-ltr" title={selectedImageUrl}>
                {selectedImageUrl}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearImage}
            className="text-xs text-destructive hover:bg-destructive/10 h-7 shrink-0 font-sans"
          >
            حذف تصویر
          </Button>
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground text-right">
          راهنمایی: استفاده از تصاویر با نسبت استاندارد جلوه فروشگاه را ارتقا می‌دهد.
        </p>
      )}
    </div>
  );
}
