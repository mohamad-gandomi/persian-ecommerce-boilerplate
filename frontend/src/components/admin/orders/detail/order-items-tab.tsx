'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, Image as ImageIcon, Tag, MapPin, User, Building } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types';

interface OrderItemsTabProps {
  order: Order;
}

export function OrderItemsTab({ order }: OrderItemsTabProps) {
  return (
    <div className="space-y-6 font-sans" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Purchased Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xs border-border/80">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span>اقلام خریداری‌شده ({order.items?.length || 0} اثر)</span>
                </div>
                <span className="text-xs font-sans text-muted-foreground font-normal">
                  جمع جزء: {formatCurrency(order.subtotal)}
                </span>
              </CardTitle>
            </CardHeader>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-right">تصویر و عنوان محصول</TableHead>
                    <TableHead className="text-right">شناسه / ویژگی‌ها</TableHead>
                    <TableHead className="text-center">تعداد</TableHead>
                    <TableHead className="text-left">قیمت واحد</TableHead>
                    <TableHead className="text-left pl-4">مجموع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/40">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-muted border border-border/70 overflow-hidden shrink-0 flex items-center justify-center">
                            {item.productImage ? (
                              <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                            )}
                          </div>
                          <div>
                            <Link href={`/products/${item.productId}`} className="font-semibold text-xs text-foreground hover:underline">
                              {item.productName}
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="font-sans text-muted-foreground block">{item.productSku || 'بدون شناسه'}</span>
                        {item.selectedAttributes && (
                          <span className="text-[10px] text-primary block mt-0.5">{JSON.stringify(item.selectedAttributes)}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-xs font-bold font-sans">{item.quantity}</TableCell>
                      <TableCell className="text-left text-xs font-sans">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-left pl-4 font-bold text-xs font-sans text-primary">
                        {formatCurrency(item.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="divide-y divide-border/60 md:hidden">
              {order.items?.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-md bg-muted border border-border/70 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.productImage ? <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-muted-foreground/50" />}
                    </div>
                    <div>
                      <div className="font-semibold">{item.productName}</div>
                      <div className="text-[10px] text-muted-foreground font-sans">{item.quantity} عدد × {formatCurrency(item.unitPrice)}</div>
                    </div>
                  </div>
                  <div className="font-bold text-primary font-sans">{formatCurrency(item.totalPrice)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Col: Financial Summary & Address */}
        <div className="space-y-6">
          <Card className="shadow-xs border-border/80">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                <span>خلاصه مالی سفارش</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">جمع اقلام سفارش:</span>
                <span className="font-medium text-foreground font-sans">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">هزینه ارسال:</span>
                <span className="font-medium text-foreground font-sans">{formatCurrency(order.shippingAmount)}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>تخفیف اعمال‌شده:</span>
                  <span className="font-bold font-sans">- {formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-sm">
                <span className="font-bold text-foreground">مبلغ نهایی پرداخت:</span>
                <span className="font-bold text-primary font-sans">{formatCurrency(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs border-border/80">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>اطلاعات خریدار و نشانی تحویل</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-semibold text-foreground">{order.customerName}</span>
              </div>
              <div className="text-muted-foreground">{order.customerEmail}</div>
              {order.customerPhone && <div className="text-muted-foreground font-sans" dir="ltr">{order.customerPhone}</div>}
              {order.shippingAddress && (
                <div className="pt-2 border-t border-border/40 text-muted-foreground leading-relaxed">
                  <div className="font-medium text-foreground pb-0.5">نشانی پستی دریافت:</div>
                  <div>{(order.shippingAddress as any).street || (order.shippingAddress as any).addressLine1 || JSON.stringify(order.shippingAddress)}</div>
                  {(order.shippingAddress as any).city && <div>{(order.shippingAddress as any).city}، استان {(order.shippingAddress as any).province || (order.shippingAddress as any).state}</div>}
                  {(order.shippingAddress as any).postalCode && <div className="font-sans">کد پستی: {(order.shippingAddress as any).postalCode}</div>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
