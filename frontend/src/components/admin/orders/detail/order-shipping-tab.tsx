'use client';

import * as React from 'react';
import { Truck, ExternalLink, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';

interface OrderShippingTabProps {
  order: Order;
  carrier: string;
  setCarrier: (c: string) => void;
  trackingNumber: string;
  setTrackingNumber: (tn: string) => void;
  trackingUrl: string;
  setTrackingUrl: (url: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function OrderShippingTab(props: OrderShippingTabProps) {
  const {
    order,
    carrier,
    setCarrier,
    trackingNumber,
    setTrackingNumber,
    trackingUrl,
    setTrackingUrl,
    onSave,
    isSaving,
  } = props;

  const addr = (order.shippingAddress as any) || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans" dir="rtl">
      {/* Logistics Form */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            <span>اطلاعات ناوگان و رهگیری باربری</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">شرکت یا روش ارسال</label>
            <Input
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="مثلاً پست پیشتاز، تیپاکس، چاپار یا پیک موتوری..."
              className="h-10 text-xs text-right"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">شماره بارنامه یا کد رهگیری</label>
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="مثلاً TP-98231405..."
              className="h-10 text-xs font-sans text-right"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">پیوند آنلاین رهگیری مرسوله</label>
            <div className="flex gap-2">
              <Input
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="https://tracking.tipaxco.com/..."
                className="h-10 text-xs font-sans text-left"
                dir="ltr"
              />
              {trackingUrl && (
                <a href={trackingUrl} target="_blank" rel="noreferrer">
                  <Button type="button" variant="outline" size="icon" className="h-10 w-10 shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={onSave} disabled={isSaving} size="sm" className="h-9 text-xs">
              {isSaving ? 'در حال ثبت...' : 'به‌روزرسانی اطلاعات ارسال'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address Summary */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>نشانی و مشخصات گیرنده سفارش</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-xs leading-relaxed">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 space-y-2">
            <div className="font-semibold text-foreground text-sm">{order.customerName}</div>
            <div className="text-muted-foreground">{addr.street || addr.addressLine1 || 'نشانی ثبت نشده'}</div>
            {addr.city && (
              <div className="text-muted-foreground">شهر: {addr.city} {addr.province ? `· استان: ${addr.province}` : ''}</div>
            )}
            {addr.postalCode && <div className="text-muted-foreground font-sans">کد پستی: {addr.postalCode}</div>}
            {order.customerPhone && <div className="text-muted-foreground font-sans" dir="ltr">{order.customerPhone}</div>}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-blue-900 text-[11px] leading-relaxed">
            <p className="font-semibold pb-1">نکات ارسال و بسته‌بندی مرسولات:</p>
            <p>تمامی مرسولات پیش از ارسال به‌صورت ایمن با بسته‌بندی استاندارد آماده‌سازی و تحویل ناوگان حمل‌ونقل می‌گردند.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
