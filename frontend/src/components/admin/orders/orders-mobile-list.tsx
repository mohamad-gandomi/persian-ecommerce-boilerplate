'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order } from '@/types';
import { getOrderStatusBadge, formatPaymentMethod } from './orders-status-badge';

interface OrdersMobileListProps {
  orders: Order[];
  isLoading: boolean;
  onDeleteClick: (order: Order) => void;
}

export function OrdersMobileList({ orders, isLoading, onDeleteClick }: OrdersMobileListProps) {
  const router = useRouter();

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground text-sm font-sans">در حال بارگذاری سفارش‌ها...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-border rounded-xl font-sans">
        هیچ سفارشی مطابق جستجو یافت نشد.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:hidden font-sans" dir="rtl">
      {orders.map((order) => {
        const firstItem = order.items?.[0];
        return (
          <div
            key={order.id}
            onClick={() => router.push(`/orders/${order.id}`)}
            className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-sans font-bold text-sm text-primary">
                  {order.orderNumber}
                </div>
                <div className="font-semibold text-xs text-foreground mt-0.5">
                  {order.customerName}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {order.customerEmail}
                </div>
              </div>
              <div className="text-left space-y-1">
                {getOrderStatusBadge(order.status)}
                <div className="text-[10px] text-muted-foreground font-sans">
                  {formatDate(order.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-md bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
                  {firstItem?.productImage ? (
                    <img
                      src={firstItem.productImage}
                      alt={firstItem.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-foreground">
                    {order.items?.length || 0} قلم کالا
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                    {order.shippingCarrier || order.shippingMethod || 'ارسال اختصاصی'}
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="font-bold text-sm text-foreground font-sans">
                  {formatCurrency(order.totalAmount)}
                </div>
                <div className="text-[10px] text-muted-foreground font-sans">
                  {formatPaymentMethod(order.paymentMethod)} &middot; {order.paymentStatus === 'PAID' ? 'پرداخت شده' : 'در انتظار پرداخت'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
              <div className="text-muted-foreground truncate max-w-[200px] font-sans">
                {order.trackingNumber ? `کد رهگیری: #${order.trackingNumber}` : 'بدون کد رهگیری'}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/orders/${order.id}`);
                  }}
                  title="مشاهده جزئیات سفارش"
                >
                  <Eye className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick(order);
                  }}
                  title="حذف سفارش"
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
