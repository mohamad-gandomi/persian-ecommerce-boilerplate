'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Star, Layers, Pencil, Trash2, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductsTableProps {
  products: Product[];
  onDelete: (product: Product) => void;
}

export function ProductsTable({
  products,
  onDelete,
}: ProductsTableProps) {
  const router = useRouter();

  return (
    <Card className="hidden md:block overflow-hidden font-sans" dir="rtl">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[340px] text-right">محصول و شناسه</TableHead>
              <TableHead className="text-right">دسته‌بندی</TableHead>
              <TableHead className="text-right">نوع کالا</TableHead>
              <TableHead className="text-right">قیمت</TableHead>
              <TableHead className="text-right">موجودی</TableHead>
              <TableHead className="text-right">پاداش معرفی</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
              const isOnSale = product.salePrice !== null && product.salePrice !== undefined;
              const variantCount = product.variants?.length || product._count?.variants || 0;

              return (
                <TableRow
                  key={product.id}
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors group"
                >
                  {/* Product info: Thumbnail, Name, SKU, Featured */}
                  <TableCell className="text-right">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-muted border border-border/70 overflow-hidden shrink-0 flex items-center justify-center group-hover:border-primary/40 transition-colors relative">
                        {primaryImage?.url ? (
                          <img
                            src={primaryImage.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                        )}
                        {product.images && product.images.length > 1 && (
                          <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-[9px] font-bold px-1 rounded flex items-center gap-0.5 shadow-xs font-sans">
                            <ImageIcon className="w-2 h-2" />
                            {product.images.length}
                          </span>
                        )}
                      </div>

                      <div className="space-y-0.5 min-w-0 text-right">
                        <div className="font-semibold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors truncate">
                          <span className="truncate">{product.name}</span>
                          {product.featured && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-full shrink-0 font-sans">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                              ویژه
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-sans text-muted-foreground text-right">
                          {product.sku ? (
                            <span className="dir-ltr font-sans">{product.sku}</span>
                          ) : (
                            <span>بدون شناسه کالا</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="text-xs text-muted-foreground text-right font-sans">
                    {product.category?.name || 'عمومی'}
                  </TableCell>

                  {/* Type Badge */}
                  <TableCell className="text-right">
                    <Badge variant={product.productType === 'VARIABLE' ? 'wood' : 'secondary'} className="font-sans text-xs">
                      {product.productType === 'VARIABLE' ? 'متغیر' : 'ساده'}
                    </Badge>
                  </TableCell>

                  {/* Regular & Sale Price */}
                  <TableCell className="text-right font-sans">
                    <div className="space-y-0.5">
                      {isOnSale ? (
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-emerald-700 text-sm font-sans">
                            {formatCurrency(product.salePrice)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through font-sans">
                            {formatCurrency(product.basePrice)}
                          </span>
                        </div>
                      ) : (
                        <div className="font-semibold text-sm font-sans">
                          {formatCurrency(product.basePrice)}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Stock or Variations Badge */}
                  <TableCell className="text-right font-sans">
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
                  </TableCell>

                  {/* Referral Reward */}
                  <TableCell className="text-right font-sans">
                    {product.rewardType === 'PERCENTAGE' && product.referrerRewardValue ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/70 whitespace-nowrap">
                        <Gift className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>{product.referrerRewardValue}٪ پاداش</span>
                      </span>
                    ) : product.rewardType === 'FIXED' && product.referrerRewardValue ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/70 whitespace-nowrap">
                        <Gift className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>{formatCurrency(product.referrerRewardValue)}</span>
                      </span>
                    ) : product.rewardType === 'DISABLED' ? (
                      <span className="text-[11px] text-muted-foreground/60">بدون پاداش</span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">پیش‌فرض سیستم</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-right font-sans">
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          product.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}
                      />
                      <span>{product.status === 'PUBLISHED' ? 'منتشرشده' : 'پیش‌نویس'}</span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-left font-sans">
                    <div className="flex items-center justify-end gap-1">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
