'use client';

import * as React from 'react';
import { Plus, Sliders, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SpecificationRow, type SpecificationItem } from './specification-row';

export type { SpecificationItem };

const COMMON_LABEL_SUGGESTIONS = [
  'برند / تولیدکننده',
  'کشور سازنده',
  'جنس / متریال',
  'ابعاد',
  'وزن خالص',
  'رنگ‌بندی',
  'گارانتی و خدمات پس از فروش',
  'استانداردها',
  'اقلام همراه',
  'نحوه نگهداری و شستشو',
];

interface SpecificationRepeaterProps {
  specifications: SpecificationItem[];
  onAddRow: () => void;
  onUpdateRow: (index: number, field: 'label' | 'value', value: string) => void;
  onDeleteRow: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onSyncDefaultFields: () => void;
  onQuickInsert: (label: string) => void;
  onClearAll: () => void;
  defaultDimensions?: string;
  defaultWeight?: string;
}

export function SpecificationRepeater({
  specifications,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
  onMoveUp,
  onMoveDown,
  onSyncDefaultFields,
  onQuickInsert,
  onClearAll,
}: SpecificationRepeaterProps) {
  return (
    <Card className="border-border shadow-xs font-sans text-right" dir="rtl">
      <CardHeader className="pb-4 border-b border-border/60 text-right">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>جدول مشخصات تخصصی کالا</span>
            </div>
            <CardTitle className="text-lg font-bold">مشخصات فنی و ویژگی‌های محصول</CardTitle>
            <CardDescription className="text-xs">
              ویژگی‌های فنی، ابعاد، جنس و استانداردهای کیفی نمایش‌داده‌شده برای مشتریان.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddRow}
              className="gap-1 text-xs h-8 font-sans"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ردیف جدید</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSyncDefaultFields}
              className="gap-1.5 text-xs h-8 font-sans"
            >
              <RotateCcw className="w-3 h-3" />
              <span>همگام‌سازی ابعاد و وزن</span>
            </Button>
            {specifications.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-xs text-muted-foreground hover:text-destructive h-8 px-2 font-sans"
              >
                پاک‌سازی همه
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="space-y-1.5 pb-2">
          <span className="text-[11px] font-semibold text-muted-foreground block font-sans">
            برچسب‌های پیشنهادی پرکاربرد (ابعاد و وزن از زبانه مشخصات پایه خوانده می‌شوند):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_LABEL_SUGGESTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onQuickInsert(tag)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted hover:bg-primary/10 hover:text-primary border border-border/80 transition-colors font-sans"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {specifications.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border/80 p-8 text-center space-y-3 bg-muted/20 font-sans">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Sliders className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-foreground">هنوز مشخصه‌ای تعریف نشده است</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              ردیف‌های مشخصات فنی را اضافه کنید تا جدول ویژگی‌ها، جنس، ابعاد و استانداردهای کالا کامل شود.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Button type="button" size="sm" onClick={onSyncDefaultFields} className="gap-1.5 text-xs font-sans">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>همگام‌سازی ابعاد و وزن</span>
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={onAddRow} className="gap-1 text-xs font-sans">
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن ردیف خالی</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {specifications.map((item, idx) => (
              <SpecificationRow
                key={idx}
                item={item}
                index={idx}
                totalCount={specifications.length}
                onUpdateRow={onUpdateRow}
                onDeleteRow={onDeleteRow}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
