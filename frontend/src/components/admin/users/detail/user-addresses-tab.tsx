'use client';

import * as React from 'react';
import { MapPin, Plus, Building, Home, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Address } from '@/types';

interface UserAddressesTabProps {
  addresses: Address[];
  onOpenAdd: () => void;
  onOpenEdit: (address: Address) => void;
  onOpenDelete: (addressId: string) => void;
}

export function UserAddressesTab({
  addresses,
  onOpenAdd,
  onOpenEdit,
  onOpenDelete,
}: UserAddressesTabProps) {
  return (
    <Card className="border-border/80 shadow-xs font-sans" dir="rtl">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60 text-right">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-wood-700 dark:text-wood-300" />
            <span>نشانی‌های ثبت‌شده تحویل و صورت‌حساب ({addresses.length})</span>
          </CardTitle>
          <CardDescription className="text-xs">
            مقصدهای ارسال سفارش‌ها و آدرس‌های صدور فاکتور مشتری.
          </CardDescription>
        </div>

        <Button
          onClick={onOpenAdd}
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1 font-medium self-start sm:self-auto font-sans"
        >
          <Plus className="w-3.5 h-3.5" />
          افزودن نشانی جدید
        </Button>
      </CardHeader>

      <CardContent className="pt-4">
        {addresses.length === 0 ? (
          <div className="py-12 text-center border border-dashed rounded-xl space-y-3 bg-muted/10 p-4">
            <MapPin className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">هیچ نشانی‌ای ثبت نشده است</p>
              <p className="text-xs text-muted-foreground">
                تاکنون هیچ نشانی تحویل یا صدور فاکتوری برای این مشتری اضافه نشده است.
              </p>
            </div>
            <Button
              onClick={onOpenAdd}
              variant="outline"
              size="sm"
              className="text-xs gap-1 font-sans"
            >
              <Plus className="w-3.5 h-3.5" />
              افزودن اولین نشانی
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => onOpenEdit(addr)}
                className="p-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-2xs text-right"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                      {addr.title.toLowerCase().includes('office') || addr.title.includes('کار') || addr.title.includes('شرکت') ? (
                        <Building className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Home className="w-3.5 h-3.5 text-primary" />
                      )}
                      <span>{addr.title}</span>
                      <span className="text-[10px] text-muted-foreground font-normal mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        (کلیک برای ویرایش)
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEdit(addr);
                        }}
                        className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors"
                        title="ویرایش نشانی"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDelete(addr.id);
                        }}
                        className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors"
                        title="حذف نشانی"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-foreground font-medium">
                    تحویل‌گیرنده: {addr.recipientName}
                  </div>

                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}، {addr.province} - کدپستی: {addr.postalCode}
                    </p>
                    <p className="text-[11px] pt-1 font-sans dir-ltr text-right">{addr.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/40">
                  {addr.isDefaultShipping && (
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 font-sans">
                      پیش‌فرض تحویل سفارش
                    </Badge>
                  )}
                  {addr.isDefaultBilling && (
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400 font-sans">
                      پیش‌فرض صورت‌حساب
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
