'use client';

import * as React from 'react';
import { Package, Layers, Box, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProductsKpisProps {
  total: number;
  variable: number;
  simple: number;
  published: number;
}

export function ProductsKpis({
  total,
  variable,
  simple,
  published,
}: ProductsKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans" dir="rtl">
      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">کل محصولات</p>
            <p className="text-xl font-bold text-foreground font-sans">{total}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">محصولات متغیر</p>
            <p className="text-xl font-bold text-wood-700 dark:text-wood-300 font-sans">
              {variable}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-wood-100 dark:bg-wood-950/40 text-wood-700 dark:text-wood-300 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xs border-border/80 bg-card/60">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-0.5 text-right">
            <p className="text-xs font-medium text-muted-foreground">محصولات ساده</p>
            <p className="text-xl font-bold text-foreground font-sans">{simple}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center">
            <Box className="w-4 h-4" />
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
    </div>
  );
}
