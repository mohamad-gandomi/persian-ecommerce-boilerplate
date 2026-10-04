'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Star, Layers, Pencil, Trash2, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductsMobileListProps {
  products: Product[];
  onDelete: (product: Product) => void;
}

export function ProductsMobileList({
  products,
  onDelete,
}: ProductsMobileListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-3 md:hidden font-sans" dir="rtl">
      {products.map((product) => {
        const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
        const isOnSale = product.salePrice !== null && product.salePrice !== undefined;
        const variantCount = product.variants?.length || product._count?.variants || 0;

        return (
          <div
            key={product.id}
            onClick={() => router.push(`/products/${product.id}`)}
            className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all cursor-pointer space-y-3 text-right"
          >
            {/* Card Header: Thumbnail + Title + SKU */}
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-lg bg-muted border border-border/70 overflow-hidden shrink-0 flex items-center justify-center relative">
                {primaryImage?.url ? (
                  <img
                    src={primaryImage.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
                )}
                {product.images && product.images.length > 1 && (
                  <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] font-bold px-1 rounded flex items-center gap-0.5 shadow-xs font-sans">
                    <ImageIcon className="w-2.5 h-2.5" />
                    {product.images.length}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {product.name}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-sans">
                  {product.sku ? (
                    <span className="dir-ltr font-sans">{product.sku}</span>
                  ) : (
                    <span>بدون شناسه</span>
                  )}
                  <span>•</span>
                  <span>{product.category?.name || 'عمومی'}</span>
                </div>
              </div>
            </div>

            {/* Card Middle: Badges and Price */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <Badge
                  variant={product.productType === 'VARIABLE' ? 'wood' : 'secondary'}
                  className="text-[10px] font-sans"
                >
                  {product.productType === 'VARIABLE' ? 'متغیر' : 'ساده'}
                </Badge>

                {product.rewardType === 'PERCENTAGE' && product.referrerRewardValue && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/70 whitespace-nowrap">
                    <Gift className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{product.referrerRewardValue}٪ پاداش</span>
                  </span>
                )}

                {product.rewardType === 'FIXED' && product.referrerRewardValue && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/70 whitespace-nowrap">
                    <Gift className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{formatCurrency(product.referrerRewardValue)}</span>
                  </span>
                )}

                {product.productType === 'VARIABLE' ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-amber-50/80 text-amber-800 border border-amber-200 whitespace-nowrap font-sans">
                    <Layers className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{variantCount} تنوع</span>
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap font-sans ${
                      product.stockQuantity > 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {product.stockQuantity > 0 ? `${product.stockQuantity} در انبار` : 'ناموجود'}
                  </span>
                )}
              </div>

              <div className="text-left font-sans">
                {isOnSale ? (
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="font-bold text-emerald-700 text-sm">
                      {formatCurrency(product.salePrice)}
                    </span>
                    <span className="text-[11px] text-muted-foreground line-through">
                      {formatCurrency(product.basePrice)}
                    </span>
                  </div>
                ) : (
                  <span className="font-semibold text-sm">
                    {formatCurrency(product.basePrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Card Footer: Status & Featured indicator + Action Buttons */}
            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      product.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                  <span className="font-medium text-foreground">
                    {product.status === 'PUBLISHED' ? 'منتشرشده' : 'پیش‌نویس'}
                  </span>
                </div>

                {product.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-full">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                    ویژه
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/products/${product.id}`);
                  }}
                  title="ویرایش محصول"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(product);
                  }}
                  title="حذف محصول"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
