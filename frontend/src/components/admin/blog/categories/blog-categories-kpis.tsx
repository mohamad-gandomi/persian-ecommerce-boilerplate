'use client';

import * as React from 'react';
import { FolderTree, Folder, Layers, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BlogCategoriesKpisProps {
  total: number;
  roots: number;
  subs: number;
  withImage: number;
}

export function BlogCategoriesKpis({
  total,
  roots,
  subs,
  withImage,
}: BlogCategoriesKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans" dir="rtl">
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">کل موضوعات</p>
            <p className="text-xl font-bold text-foreground font-sans">{total}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FolderTree className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">دسته‌های اصلی</p>
            <p className="text-xl font-bold text-wood-700 dark:text-wood-300 font-sans">
              {roots}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-wood-100 dark:bg-wood-950/40 text-wood-700 dark:text-wood-300 flex items-center justify-center">
            <Folder className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">زیردسته‌ها</p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-sans">
              {subs}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">دارای تصویر کاور</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-sans">
              {withImage}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
            <ImageIcon className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
