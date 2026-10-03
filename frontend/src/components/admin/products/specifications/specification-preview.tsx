'use client';

import * as React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpecificationItem } from './specification-repeater';

interface SpecificationPreviewProps {
  specifications: SpecificationItem[];
  defaultDimensions?: string;
  defaultWeight?: string;
}

export function SpecificationPreview({
  specifications,
  defaultDimensions,
  defaultWeight,
}: SpecificationPreviewProps) {
  return (
    <Card className="border-border bg-card/50 font-sans text-right" dir="rtl">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>پیش‌نمایش جدول مشخصات فنی در صفحه محصول</span>
          </CardTitle>
          <Badge variant="outline" className="text-[10px] font-sans">
            نمای مشتری
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="bg-card rounded-2xl border border-border/70 overflow-hidden shadow-2xs divide-y divide-border/60">
          {defaultDimensions && !specifications.some((i) => /ابعاد|dimension/i.test(i.label)) && (
            <div className="grid grid-cols-1 md:grid-cols-12 p-3 sm:p-4 gap-1.5 md:gap-4 items-baseline bg-amber-50/20">
              <div className="md:col-span-4 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>ابعاد اثر</span>
                <span className="text-[10px] text-amber-700 font-sans">(از زبانه مشخصات پایه)</span>
              </div>
              <div className="md:col-span-8 text-xs font-medium text-foreground">
                {defaultDimensions}
              </div>
            </div>
          )}

          {defaultWeight && !specifications.some((i) => /وزن|weight/i.test(i.label)) && (
            <div className="grid grid-cols-1 md:grid-cols-12 p-3 sm:p-4 gap-1.5 md:gap-4 items-baseline bg-amber-50/20">
              <div className="md:col-span-4 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>وزن خالص</span>
                <span className="text-[10px] text-amber-700 font-sans">(از زبانه مشخصات پایه)</span>
              </div>
              <div className="md:col-span-8 text-xs font-medium text-foreground">
                {defaultWeight} کیلوگرم
              </div>
            </div>
          )}

          {specifications.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 p-3 sm:p-4 gap-1.5 md:gap-4 items-baseline"
            >
              <div className="md:col-span-4 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{item.label || '(بدون عنوان)'}</span>
              </div>
              <div className="md:col-span-8 text-xs font-medium text-foreground">
                {item.value || '(بدون مقدار)'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
