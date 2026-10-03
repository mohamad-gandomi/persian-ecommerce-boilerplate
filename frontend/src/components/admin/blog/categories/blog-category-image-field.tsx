'use client';

import * as React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { MediaItem } from '@/types';

interface BlogCategoryImageFieldProps {
  image: string;
  onChange: (url: string) => void;
}

export function BlogCategoryImageField({ image, onChange }: BlogCategoryImageFieldProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);

  return (
    <>
      <div className="p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-3">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span>تصویر کاور دسته‌بندی</span>
        </label>
        <div className="flex items-center gap-3">
          {image ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border shrink-0">
              <img src={image} alt="پیش‌نمایش" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-[10px] font-sans"
              >
                حذف
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-muted/60 border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground shrink-0 gap-1">
              <ImageIcon className="w-5 h-5 opacity-40" />
              <span className="text-[9px] font-sans">بدون تصویر</span>
            </div>
          )}
          <div className="space-y-1.5 flex-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMediaPickerOpen(true)}
              className="gap-1.5 text-xs h-8 font-sans"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>انتخاب از کتابخانه رسانه</span>
            </Button>
          </div>
        </div>
      </div>

      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={(media: MediaItem) => {
          onChange(media.url);
          setIsMediaPickerOpen(false);
        }}
        title="انتخاب تصویر کاور دسته‌بندی"
      />
    </>
  );
}
