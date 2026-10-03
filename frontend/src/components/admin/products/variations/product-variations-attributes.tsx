'use client';

import * as React from 'react';
import { Check, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Attribute } from '@/types';

interface ProductVariationsAttributesProps {
  globalAttributes: Attribute[];
  selectedAttributeIds: string[];
  onToggleAttribute: (id: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function ProductVariationsAttributes({
  globalAttributes,
  selectedAttributeIds,
  onToggleAttribute,
  onSave,
  isSaving,
}: ProductVariationsAttributesProps) {
  return (
    <Card className="border-primary/30 shadow-xs font-sans text-right" dir="rtl">
      <CardHeader className="pb-3 text-right">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-foreground font-bold">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                ۱
              </span>
              <span>انتخاب ویژگی‌های متغیر برای این محصول</span>
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              مشخص کنید چه خصوصیاتی (مانند رنگ، سایز، متریال یا ظرفیت) تنوع‌های این محصول را ایجاد می‌کنند.
            </CardDescription>
          </div>

          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="text-xs h-8 gap-1.5 shrink-0 font-sans font-semibold"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره ویژگی‌های محصول'}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {globalAttributes.map((attr) => {
            const isSelected = selectedAttributeIds.includes(attr.id);
            return (
              <div
                key={attr.id}
                onClick={() => onToggleAttribute(attr.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all space-y-2 select-none text-right ${
                  isSelected
                    ? 'bg-wood-50/70 dark:bg-wood-950/40 border-primary ring-1 ring-primary/40 shadow-xs'
                    : 'bg-card border-border hover:border-border/80 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground flex items-center gap-2">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span>{attr.name}</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground font-sans">
                    {attr.values?.length || 0} گزینه
                  </span>
                </div>

                {/* Terms preview */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {attr.values?.map((val) => (
                    <span
                      key={val.id}
                      className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-background border border-border/80 text-muted-foreground font-sans"
                    >
                      {val.image ? (
                        <img
                          src={val.image}
                          alt={val.name}
                          className="w-2.5 h-2.5 rounded-full object-cover border border-black/10 shrink-0"
                        />
                      ) : val.colorHex ? (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: val.colorHex }}
                        />
                      ) : null}
                      <span>{val.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
