'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface DashboardInventoryCardProps {
  productsLoading: boolean;
  lowStockProducts: Product[];
}

export function DashboardInventoryCard({
  productsLoading,
  lowStockProducts,
}: DashboardInventoryCardProps) {
  return (
    <Card className="shadow-2xs border-border/70 font-sans" dir="rtl">
      <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 sm:px-6">
        <div>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span>هشدار موجودی انبار</span>
          </CardTitle>
          <CardDescription className="text-xs">
            پایش نیاز به تأمین و شارژ انبار
          </CardDescription>
        </div>
        <Link href="/products">
          <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary h-7 px-2">
            مدیریت محصولات
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-5 space-y-2.5">
        {productsLoading ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            در حال پایش موجودی انبار...
          </div>
        ) : lowStockProducts.length === 0 ? (
          <div className="p-4 rounded-xl border border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-1.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              موجودی کاتالوگ در وضعیت مطلوب
            </div>
            <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
              تمام محصولات دارای موجودی کافی در انبار هستند.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {lowStockProducts.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-card/60 hover:bg-accent/40 transition-colors text-xs"
              >
                <div className="min-w-0 pl-2">
                  <div className="font-semibold text-foreground truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <span className="font-sans font-medium">{p.sku || 'بدون شناسه'}</span>
                    <span>•</span>
                    <span>{p.category?.name || 'دسته‌بندی نشده'}</span>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 font-sans text-xs font-bold px-2 py-0.5 rounded-md ${
                      p.stockQuantity === 0
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>{p.stockQuantity === 0 ? 'ناموجود' : `${p.stockQuantity} عدد`}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
