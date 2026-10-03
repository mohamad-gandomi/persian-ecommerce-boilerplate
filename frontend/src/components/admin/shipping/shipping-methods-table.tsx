'use client';

import * as React from 'react';
import { Truck, Store, Clock, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { ShippingMethodOption } from '@/types';

interface ShippingMethodsTableProps {
  methods: ShippingMethodOption[];
  isLoading: boolean;
  onEdit: (m: ShippingMethodOption) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onSetDefault: (id: string) => void;
}

export function ShippingMethodsTable(props: ShippingMethodsTableProps) {
  const { methods, isLoading, onEdit, onDelete, onToggleActive, onSetDefault } = props;

  return (
    <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs font-sans" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="text-xs font-semibold text-right">روش و ناوگان باربری</TableHead>
            <TableHead className="text-xs font-semibold text-right">نوع تحویل</TableHead>
            <TableHead className="text-xs font-semibold text-right">هزینه ارسال</TableHead>
            <TableHead className="text-xs font-semibold text-right">زمان تحویل</TableHead>
            <TableHead className="text-xs font-semibold text-center">وضعیت</TableHead>
            <TableHead className="text-xs font-semibold text-left pl-4">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                در حال دریافت تنظیمات روش‌های ارسال...
              </TableCell>
            </TableRow>
          ) : methods.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                هیچ روش ارسالی تعریف نشده است. جهت ثبت، روی «افزودن روش ارسال جدید» کلیک کنید.
              </TableCell>
            </TableRow>
          ) : (
            methods.map((method) => (
              <TableRow key={method.id} className="hover:bg-muted/30">
                <TableCell className="py-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-muted text-muted-foreground mt-0.5 shrink-0">
                      {method.type === 'LOCAL_PICKUP' ? <Store className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{method.name}</span>
                        {method.isDefault && (
                          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                            پیش‌فرض
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        {method.carrier || 'ارسال پیش‌فرض فروشگاه'}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary" className="text-[10px] font-sans">
                    {method.type === 'LOCAL_PICKUP' ? 'تحویل حضوری' : 'نرخ ثابت ارسال'}
                  </Badge>
                </TableCell>

                <TableCell>
                  <span className="text-xs font-sans font-bold text-foreground">
                    {method.price === 0 ? 'رایگان' : formatCurrency(method.price)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    {method.estimatedDays || '۳ تا ۵ روز کاری'}
                  </span>
                </TableCell>

                <TableCell className="text-center">
                  <button
                    type="button"
                    onClick={() => onToggleActive(method.id, method.isActive === false)}
                    className="cursor-pointer"
                    title="تغییر وضعیت فعال/غیرفعال"
                  >
                    {method.isActive !== false ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20 text-[10px]">
                        فعال
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        غیرفعال
                      </Badge>
                    )}
                  </button>
                </TableCell>

                <TableCell className="text-left pl-4">
                  <div className="flex items-center justify-end gap-1">
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSetDefault(method.id)}
                        className="h-8 text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        انتخاب پیش‌فرض
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(method)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="ویرایش روش ارسال"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(method.id, method.name)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      title="حذف روش ارسال"
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
    </div>
  );
}
