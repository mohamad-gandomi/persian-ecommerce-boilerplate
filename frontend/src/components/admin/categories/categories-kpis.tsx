'use client';

import * as React from 'react';
import { FolderTree, Folder, Layers, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CategoriesKpisProps {
  total: number;
  roots: number;
  subs: number;
  withImage: number;
}

export function CategoriesKpis(props: CategoriesKpisProps) {
  const { total, roots, subs, withImage } = props;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans" dir="rtl">
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">کل دسته‌بندی‌ها</p>
            <p className="text-xl font-bold text-foreground font-sans">{total}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FolderTree className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">دسته‌های اصلی (سرشاخه)</p>
            <p className="text-xl font-bold text-wood-800 dark:text-wood-300 font-sans">{roots}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-wood-100 dark:bg-wood-950/40 text-wood-700 dark:text-wood-300 flex items-center justify-center">
            <Folder className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">زیردسته‌ها</p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-400 font-sans">{subs}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">دارای تصویر کاور</p>
            <p className="text-xl font-bold text-emerald-600 font-sans">{withImage}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
