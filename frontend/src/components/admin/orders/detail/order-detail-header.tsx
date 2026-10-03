'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Trash2, Save, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Order } from '@/types';
import { getOrderStatusBadge, formatPaymentMethod } from '../orders-status-badge';

interface OrderDetailHeaderProps {
  order: Order;
  onSave: () => void;
  onDelete: () => void;
  isSaving: boolean;
}

export function OrderDetailHeader(props: OrderDetailHeaderProps) {
  const { order, onSave, onDelete, isSaving } = props;

  return (
    <div className="p-3.5 sm:p-5 rounded-xl border border-border bg-card shadow-xs space-y-3 font-sans" dir="rtl">
      {/* Top row: Back link + Action Buttons */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          <span>بازگشت به فهرست سفارش‌ها</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">حذف سفارش</span>
            <span className="sm:hidden">حذف</span>
          </Button>

          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="gap-1.5 text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-xs font-semibold"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات'}</span>
          </Button>
        </div>
      </div>

      {/* Bottom row: Order Number, Status Badges, and Customer Info */}
      <div className="pt-2.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <h1 className="text-base sm:text-xl font-bold font-sans text-foreground tracking-tight">
            {order.orderNumber}
          </h1>
          {getOrderStatusBadge(order.status)}
          <Badge
            variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}
            className="text-[10px] px-2 py-0.5 font-sans"
          >
            {order.paymentStatus === 'PAID' ? 'پرداخت شده' : 'در انتظار پرداخت'}
          </Badge>
          {order.shippingCarrier && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-sans">
              <Truck className="w-3 h-3" />
              {order.shippingCarrier}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground shrink-0 font-sans">
          <span>مشتری: <strong className="text-foreground">{order.customerName}</strong></span>
          <span>•</span>
          <span className="font-sans">{formatDate(order.createdAt)}</span>
          <span>•</span>
          <span className="font-semibold text-foreground">
            {formatPaymentMethod(order.paymentMethod)}
          </span>
        </div>
      </div>
    </div>
  );
}
