'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Trash2, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order } from '@/types';
import { getOrderStatusBadge, getOrderPaymentBadge } from './orders-status-badge';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onDeleteClick: (order: Order) => void;
}

export function OrdersTable({ orders, isLoading, onDeleteClick }: OrdersTableProps) {
  const router = useRouter();

  return (
    <Card className="hidden md:block overflow-hidden font-sans shadow-xs border-border/80" dir="rtl">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[140px] text-right">شماره سفارش</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">تاریخ ثبت</TableHead>
              <TableHead className="text-right">اقلام سفارش</TableHead>
              <TableHead className="text-right">باربری و ارسال</TableHead>
              <TableHead className="text-right">وضعیت پرداخت</TableHead>
              <TableHead className="text-left">مبلغ کل</TableHead>
              <TableHead className="text-center min-w-[140px] whitespace-nowrap">وضعیت سفارش</TableHead>
              <TableHead className="text-left pl-4">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground text-xs">
                  در حال بارگذاری اطلاعات سفارش‌ها...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                    <p className="font-semibold text-foreground text-sm">هیچ سفارشی یافت نشد</p>
                    <p className="text-xs text-muted-foreground font-light">
                      فیلتر وضعیت انتخابی یا عبارت جستجو را تغییر دهید.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors group"
                >
                  <TableCell className="font-semibold text-primary font-sans text-xs group-hover:underline">
                    {order.orderNumber}
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold text-foreground text-xs group-hover:text-primary transition-colors">
                      {order.customerName}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {order.customerEmail}
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap font-sans">
                    {formatDate(order.createdAt)}
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-semibold text-foreground">
                      {order.items?.length || 0} اثر
                    </div>
                    {order.items && order.items[0] && (
                      <div className="text-[11px] text-muted-foreground truncate max-w-[170px]">
                        {order.items[0].productName}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-medium text-foreground">
                      {order.shippingCarrier || order.shippingMethod || 'باربری اختصاصی'}
                    </div>
                    {order.trackingNumber && (
                      <div className="text-[11px] font-sans text-muted-foreground truncate max-w-[140px]">
                        #{order.trackingNumber}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {getOrderPaymentBadge(order.paymentStatus, order.paymentMethod)}
                  </TableCell>

                  <TableCell className="text-left font-bold text-foreground text-xs font-sans">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>

                  <TableCell className="text-center min-w-[140px] whitespace-nowrap">
                    {getOrderStatusBadge(order.status)}
                  </TableCell>

                  <TableCell className="text-left pl-4">
                    <div className="flex items-center justify-start gap-1">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
