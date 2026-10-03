'use client';

import * as React from 'react';
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CreditCard,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return getOrderStatusBadge(status);
}

export function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-sans text-xs px-2.5 py-0.5">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>در انتظار بررسی</span>
        </Badge>
      );
    case 'PROCESSING':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-sans text-xs px-2.5 py-0.5">
          <Package className="w-3.5 h-3.5 shrink-0" />
          <span>در حال پردازش</span>
        </Badge>
      );
    case 'SHIPPED':
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-sans text-xs px-2.5 py-0.5">
          <Truck className="w-3.5 h-3.5 shrink-0" />
          <span>ارسال شده</span>
        </Badge>
      );
    case 'DELIVERED':
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-sans text-xs px-2.5 py-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>تحویل داده شده</span>
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-300 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-sans text-xs px-2.5 py-0.5">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>لغو شده</span>
        </Badge>
      );
    case 'REFUNDED':
      return (
        <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-300 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 font-sans text-xs px-2.5 py-0.5">
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span>مسترد شده</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="font-sans text-xs whitespace-nowrap shrink-0 inline-flex items-center">
          {status}
        </Badge>
      );
  }
}

export function formatPaymentMethod(method?: string): string {
  if (!method) return 'پرداخت آنلاین';
  const upper = method.toUpperCase();
  if (upper.includes('MELLAT')) return 'به‌پرداخت ملت (شاپرک)';
  if (upper.includes('ZARINPAL')) return 'زرین‌پال (شاپرک)';
  if (upper.includes('BANK_TRANSFER') || upper.includes('حواله')) return 'حواله مستقیم بانکی';
  return method;
}

export function getOrderPaymentBadge(status: string, method?: string) {
  const isPaid = status === 'PAID';
  const isRefunded = status === 'REFUNDED';

  return (
    <div className="space-y-0.5 font-sans whitespace-nowrap">
      <div className="flex items-center gap-1.5 text-xs">
        <CreditCard className="w-3 h-3 text-muted-foreground shrink-0" />
        <span className="font-medium text-foreground">
          {formatPaymentMethod(method)}
        </span>
      </div>
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
          isPaid ? 'text-emerald-700' : isRefunded ? 'text-rose-700' : 'text-amber-700'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isPaid ? 'bg-emerald-500' : isRefunded ? 'bg-rose-500' : 'bg-amber-500'
          }`}
        />
        {isPaid ? 'پرداخت موفق' : isRefunded ? 'استرداد وجه' : 'در انتظار پرداخت'}
      </span>
    </div>
  );
}
