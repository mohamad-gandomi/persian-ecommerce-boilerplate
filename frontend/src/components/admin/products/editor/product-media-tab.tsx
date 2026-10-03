'use client';

import * as React from 'react';
import { Image as ImageIcon, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProductImageItem {
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

interface ProductMediaTabProps {
  images: ProductImageItem[];
  onOpenMediaLibrary: () => void;
  onAddImageByUrl: (url: string, altText: string) => void;
  onSetPrimary: (index: number) => void;
  onRemoveImage: (index: number) => void;
}

export function ProductMediaTab({
  images,
  onOpenMediaLibrary,
  onAddImageByUrl,
  onSetPrimary,
  onRemoveImage,
}: ProductMediaTabProps) {
  const [newUrl, setNewUrl] = React.useState('');
  const [newAlt, setNewAlt] = React.useState('');

  const handleSubmitUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    onAddImageByUrl(newUrl.trim(), newAlt.trim());
    setNewUrl('');
    setNewAlt('');
  };

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      {/* Upload & Attach Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-right">
          <div>
            <CardTitle className="text-base flex items-center gap-2 font-bold">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span>افزودن تصویر به گالری محصول</span>
            </CardTitle>
            <CardDescription className="text-xs">
              عکس‌های زوایای مختلف و جزئیات کالا را انتخاب یا بارگذاری نمایید.
            </CardDescription>
          </div>
          <Button
            type="button"
            onClick={onOpenMediaLibrary}
            className="gap-2 shrink-0 font-sans font-semibold text-xs h-9"
          >
            <ImageIcon className="w-4 h-4" />
            <span>انتخاب از کتابخانه رسانه</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="pt-2 border-t border-border/60">
            <span className="text-xs text-muted-foreground block mb-2 font-medium">
              یا تصویر خارجی را مستقیماً از طریق نشانی (URL) اضافه کنید:
            </span>
            <form onSubmit={handleSubmitUrl} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="https://images.unsplash.com/..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 font-sans text-xs dir-ltr text-left"
                required
              />
              <Input
                placeholder="توضیح تصویر (Alt text)"
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                className="sm:w-64 font-sans text-xs text-right"
              />
              <Button type="submit" variant="secondary" className="gap-1.5 shrink-0 text-xs font-sans">
                <Plus className="w-3.5 h-3.5" />
                <span>پیوست تصویر</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid Card */}
      <Card>
        <CardHeader className="text-right">
          <CardTitle className="text-base flex items-center gap-2 font-bold">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>گالری تصاویر محصول ({images.length} تصویر)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs font-sans border-2 border-dashed rounded-xl">
              هنوز تصویری برای این اثر ثبت نشده است. از دکمه انتخاب از کتابخانه در بالا استفاده کنید.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`group rounded-xl border p-2 bg-card overflow-hidden shadow-xs space-y-2 relative transition-all ${
                    img.isPrimary ? 'border-primary ring-1 ring-primary' : 'border-border'
                  }`}
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
                    <img
                      src={img.url}
                      alt={img.altText || 'تصویر محصول'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {img.isPrimary && (
                      <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 font-sans">
                        <Check className="w-2.5 h-2.5" />
                        <span>تصویر شاخص</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border/60 text-xs font-sans">
                    {!img.isPrimary ? (
                      <button
                        type="button"
                        onClick={() => onSetPrimary(idx)}
                        className="text-[11px] font-medium text-primary hover:underline"
                      >
                        تعیین به عنوان شاخص
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        کاور اصلی فروشگاه
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onRemoveImage(idx)}
                      className="text-[11px] text-rose-600 hover:text-rose-700 hover:underline"
                    >
                      حذف از گالری
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
