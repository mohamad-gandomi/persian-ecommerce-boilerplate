'use client';

import * as React from 'react';
import { Layers, Image as ImageIcon, Palette, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AttributesKpisProps {
  totalAttributes: number;
  imageCount: number;
  colorCount: number;
  textCount: number;
}

export function AttributesKpis({
  totalAttributes,
  imageCount,
  colorCount,
  textCount,
}: AttributesKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans" dir="rtl">
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">کل ویژگی‌ها</p>
            <p className="text-xl font-bold text-foreground font-sans">{totalAttributes}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">پارچه‌ها و بافت‌ها</p>
            <p className="text-xl font-bold text-emerald-600 font-sans">{imageCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
            <ImageIcon className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">کالیته رنگ‌ها</p>
            <p className="text-xl font-bold text-amber-600 font-sans">{colorCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 flex items-center justify-center">
            <Palette className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">مشخصات و ابعاد</p>
            <p className="text-xl font-bold text-foreground font-sans">{textCount}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-muted text-foreground flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
