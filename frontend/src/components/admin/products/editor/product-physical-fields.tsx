'use client';

import * as React from 'react';
import { Scale, Maximize2, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProductPhysicalFieldsProps {
  dimensions: string;
  onDimensionsChange: (val: string) => void;
  weight: string;
  onWeightChange: (val: string) => void;
  primaryImage?: { url: string; altText?: string | null };
  totalImagesCount: number;
  onOpenCoverPicker: () => void;
  onGoToMediaTab: () => void;
}

export function ProductPhysicalFields({
  dimensions,
  onDimensionsChange,
  weight,
  onWeightChange,
  primaryImage,
  totalImagesCount,
  onOpenCoverPicker,
  onGoToMediaTab,
}: ProductPhysicalFieldsProps) {
  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      <Card>
        <CardHeader className="text-right">
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span>مشخصات فیزیکی پایه</span>
          </CardTitle>
          <CardDescription className="text-xs">
            ابعاد استاندارد و وزن تقریبی برای محاسبه حمل و نقل.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span>ابعاد (طول × عرض × ارتفاع)</span>
            </label>
            <Input
              value={dimensions}
              onChange={(e) => onDimensionsChange(e.target.value)}
              placeholder="مثلاً: ۲۰۰ × ۸۰ × ۷۵ سانتی‌متر"
              className="text-xs font-sans text-right"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-muted-foreground" />
              <span>وزن خالص (کیلوگرم)</span>
            </label>
            <Input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => onWeightChange(e.target.value)}
              placeholder="۴۵.۰"
              className="text-xs font-sans text-center"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="text-right">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>پیش‌نمایش تصویر شاخص</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="aspect-video rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center relative">
            {primaryImage?.url ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.altText || 'کاور محصول'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                <span className="text-xs">تصویر شاخصی تعیین نشده</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="truncate max-w-[140px] font-sans">
              {primaryImage?.altText || 'کاور اصلی'}
            </span>
            <div className="flex items-center gap-2 shrink-0 font-sans">
              <button
                type="button"
                onClick={onOpenCoverPicker}
                className="text-primary hover:underline font-medium text-xs flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>انتخاب کاور</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={onGoToMediaTab}
                className="text-primary hover:underline font-medium text-xs"
              >
                گالری ({totalImagesCount})
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
