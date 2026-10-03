'use client';

import * as React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductVariant, Attribute } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ProductVariationsListProps {
  variants: ProductVariant[];
  productAttributes: Attribute[];
  minVariantPrice: number;
  maxVariantPrice: number;
  totalVariantStock: number;
  onAddVariant: () => void;
  onEditVariant: (variant: ProductVariant) => void;
  onDeleteVariant: (variant: ProductVariant) => void;
  onToggleActive: (variantId: string, currentActive: boolean) => void;
}

export function ProductVariationsList({
  variants,
  productAttributes,
  minVariantPrice,
  maxVariantPrice,
  totalVariantStock,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
  onToggleActive,
}: ProductVariationsListProps) {
  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      {/* Variation Metrics */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: 'تنوع‌ها', val: variants.length, sub: 'پیکربندی در کاتالوگ', cls: 'text-sm sm:text-2xl text-foreground' },
          { label: 'کل موجودی متغیرها', val: totalVariantStock, sub: 'مجموع موجودی انبار', cls: 'text-sm sm:text-2xl text-foreground' },
          { label: 'بازه قیمتی', val: `${formatCurrency(minVariantPrice)} تا ${formatCurrency(maxVariantPrice)}`, sub: 'تنوع‌های فعال', cls: 'text-[11px] sm:text-xl text-emerald-700 dark:text-emerald-400' },
        ].map((m, i) => (
          <Card key={i} className="bg-muted/40 border-border">
            <CardContent className="p-2.5 sm:p-4 space-y-0.5 sm:space-y-1 text-right">
              <div className="text-[10px] sm:text-xs font-medium text-foreground truncate">{m.label}</div>
              <div className={`font-bold font-sans truncate ${m.cls}`}>{m.val}</div>
              <div className="text-[9px] sm:text-[11px] text-muted-foreground hidden sm:block">{m.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Variations Table Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 pb-3 sm:pb-4 text-right">
          <div>
            <CardTitle className="text-sm sm:text-base flex items-center gap-2 font-bold">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                ۲
              </span>
              <span>ماتریس تنوع‌ها و قیمت‌گذاری اختصاصی ({variants.length})</span>
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              ویژگی‌های فعال این اثر:{' '}
              <strong className="text-foreground">{productAttributes.map((a) => a.name).join('، ') || 'انتخاب نشده'}</strong>
            </CardDescription>
          </div>

          <Button onClick={onAddVariant} className="gap-1.5 text-xs h-8 sm:h-9 shrink-0 font-medium font-sans">
            <Plus className="w-4 h-4" />
            <span>افزودن تنوع جدید</span>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {variants.length === 0 ? (
            <div className="text-center py-12 px-4 text-muted-foreground text-xs font-sans">
              هنوز تنوعی ساخته نشده است. روی دکمه «افزودن تنوع جدید» کلیک کنید.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">شناسه (SKU) و گزینه‌ها</TableHead>
                  <TableHead className="text-right">قیمت (تومان)</TableHead>
                  <TableHead className="text-right">موجودی</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((v) => {
                  const isSale = v.salePrice !== null && v.salePrice !== undefined;
                  return (
                    <TableRow key={v.id} className="hover:bg-muted/40 font-sans">
                      <TableCell className="text-right">
                        <div className="space-y-1">
                          <div className="font-semibold text-xs text-foreground dir-ltr text-right">
                            {v.sku}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {v.attributeValues?.map((item) => (
                              <span
                                key={item.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-muted border border-border"
                              >
                                {item.attributeValue.image ? (
                                  <img
                                    src={item.attributeValue.image}
                                    alt={item.attributeValue.name}
                                    className="w-3 h-3 rounded-full object-cover"
                                  />
                                ) : item.attributeValue.colorHex ? (
                                  <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: item.attributeValue.colorHex }}
                                  />
                                ) : null}
                                <span>{item.attributeValue.name}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-right font-sans">
                        {isSale ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-emerald-700 text-xs block">
                              {formatCurrency(v.salePrice!)}
                            </span>
                            <span className="text-[10px] text-muted-foreground line-through block">
                              {formatCurrency(v.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-semibold text-xs">{formatCurrency(v.price)}</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right font-sans text-xs">
                        <span className={v.stockQuantity > 0 ? 'text-foreground' : 'text-rose-600'}>
                          {v.stockQuantity > 0 ? `${v.stockQuantity} عدد` : 'ناموجود'}
                        </span>
                      </TableCell>

                      <TableCell className="text-right font-sans">
                        <button
                          type="button"
                          onClick={() => onToggleActive(v.id, v.isActive)}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
                            v.isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {v.isActive ? 'فعال' : 'غیرفعال'}
                        </button>
                      </TableCell>

                      <TableCell className="text-left font-sans">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => onEditVariant(v)}
                            title="ویرایش تنوع"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onDeleteVariant(v)}
                            title="حذف تنوع"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
