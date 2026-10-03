'use client';

import * as React from 'react';
import { BookOpen, CheckCircle2, FileText, FolderTree } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BlogKpisProps {
  total: number;
  published: number;
  draft: number;
  categories: number;
}

export function BlogKpis({
  total,
  published,
  draft,
  categories,
}: BlogKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans" dir="rtl">
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">کل مقاله‌ها</p>
            <p className="text-xl font-bold text-foreground font-sans">{total}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">منتشرشده</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-sans">
              {published}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">پیش‌نویس</p>
            <p className="text-xl font-bold text-wood-700 dark:text-wood-300 font-sans">
              {draft}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-wood-100 dark:bg-wood-950/40 text-wood-700 dark:text-wood-300 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">دسته‌بندی‌های موضوعی</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 font-sans">
              {categories}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center">
            <FolderTree className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
