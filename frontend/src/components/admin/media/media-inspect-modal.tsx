'use client';

import * as React from 'react';
import { Image as ImageIcon, ExternalLink, Copy, Check, Trash2, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MediaItem } from '@/types';
import { formatBytes } from './media-utils';

interface MediaInspectModalProps {
  item: MediaItem | null;
  copiedId: string | null;
  isUpdating: boolean;
  onClose: () => void;
  onCopyUrl: (url: string, id: string) => void;
  onDelete: (item: MediaItem) => void;
  onSave: (id: string, data: { altText?: string; caption?: string }) => void;
}

export function MediaInspectModal({
  item,
  copiedId,
  isUpdating,
  onClose,
  onCopyUrl,
  onDelete,
  onSave,
}: MediaInspectModalProps) {
  const [altText, setAltText] = React.useState('');
  const [caption, setCaption] = React.useState('');

  React.useEffect(() => {
    if (item) {
      setAltText(item.altText || '');
      setCaption(item.caption || '');
    }
  }, [item]);

  if (!item) return null;

  return (
    <Dialog open={Boolean(item)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle className="text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>مشاهده مشخصات و ویرایش متاداده</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            بررسی مشخصات فنی، درج متن جایگزین برای سئو و کپی نشانی عمومی فایل.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Asset Preview */}
          <div className="aspect-video w-full rounded-xl bg-muted border border-border overflow-hidden flex items-center justify-center relative">
            <img
              src={item.url}
              alt={item.altText || item.originalName}
              className="w-full h-full object-contain"
            />
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-2 left-2 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-md text-xs inline-flex items-center gap-1 backdrop-blur-xs transition-colors shadow-2xs font-sans"
              title="مشاهده فایل اصلی در زبانه جدید"
            >
              <ExternalLink className="w-3 h-3" />
              <span>مشاهده اندازه اصلی</span>
            </a>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/80 text-xs text-right font-sans">
            <div>
              <span className="text-[10px] text-muted-foreground block">حجم فایل</span>
              <span className="font-semibold text-foreground">{formatBytes(item.size)}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">قالب فایل</span>
              <span className="font-semibold text-foreground truncate block dir-ltr text-right">{item.mimeType}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">ابعاد تصویر</span>
              <span className="font-semibold text-foreground dir-ltr text-right">
                {item.width && item.height ? `${item.width}×${item.height}` : 'خودکار'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">تاریخ ایجاد</span>
              <span className="font-semibold text-foreground">
                {new Date(item.createdAt).toLocaleDateString('fa-IR')}
              </span>
            </div>
          </div>

          {/* Public URL Field */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-foreground">پیوند مستقیم پرونده</label>
            <div className="flex items-center gap-2">
              <Input readOnly value={item.url} className="text-xs font-sans bg-muted/30 text-left dir-ltr" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onCopyUrl(item.url, item.id)}
                className="shrink-0 text-xs h-9 gap-1.5 font-sans"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">کپی شد</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی لینک</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Alt Text & Caption Form */}
          <div className="space-y-3 pt-1 text-right">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>متن جایگزین (Alt Text)</span>
                <span className="text-[10px] text-muted-foreground">توصیه‌شده برای سئو و خوانایی</span>
              </label>
              <Input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="مثال: تصویر شاخص محصول با کیفیت بالا"
                className="text-xs text-right"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">عنوان یا توضیح زیر تصویر</label>
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="مثال: نمای محصول در زاویه ۴۵ درجه"
                className="text-xs text-right"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDelete(item)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 text-xs h-9 gap-1.5 font-sans"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف رسانه</span>
          </Button>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-9 font-sans">
              بستن
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onSave(item.id, { altText, caption })}
              disabled={isUpdating}
              className="text-xs h-9 font-semibold gap-1.5 shadow-xs font-sans"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isUpdating ? 'در حال ذخیره...' : 'ذخیره تغییرات'}</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
