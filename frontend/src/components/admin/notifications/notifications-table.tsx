'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Wallet,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Gift,
  ExternalLink,
  Check,
  Trash2,
  Bell,
  Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NotificationItem } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

interface NotificationsTableProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onDelete: (notification: NotificationItem) => void;
}

export function getTypeBadge(type: string) {
  switch (type) {
    case 'ORDER':
      return {
        label: 'سفارش',
        icon: <ShoppingCart className="w-3.5 h-3.5" />,
        className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/70',
      };
    case 'WALLET':
      return {
        label: 'کیف‌پول',
        icon: <Wallet className="w-3.5 h-3.5" />,
        className: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/70',
      };
    case 'INVENTORY':
      return {
        label: 'انبار',
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/70',
      };
    case 'REFERRAL':
      return {
        label: 'معرف و پاداش',
        icon: <Gift className="w-3.5 h-3.5" />,
        className: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200/70',
      };
    case 'BLOG':
      return {
        label: 'وبلاگ',
        icon: <FileText className="w-3.5 h-3.5" />,
        className: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/70',
      };
    default:
      return {
        label: 'سیستم',
        icon: <ShieldAlert className="w-3.5 h-3.5" />,
        className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
      };
  }
}

export function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'URGENT':
      return (
        <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950/50 dark:text-rose-300">
          فوری
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/50 dark:text-amber-300">
          مهم
        </span>
      );
    default:
      return null;
  }
}

export function NotificationsTable({
  notifications,
  onMarkRead,
  onDelete,
}: NotificationsTableProps) {
  const router = useRouter();

  const handleRowClick = (item: NotificationItem) => {
    if (!item.isRead) {
      onMarkRead(item.id);
    }
    if (item.link) {
      router.push(item.link);
    }
  };

  return (
    <Card className="hidden md:block overflow-hidden font-sans border-border/80 shadow-2xs" dir="rtl">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px] text-right">دسته‌بندی</TableHead>
              <TableHead className="min-w-[280px] text-right">عنوان و شرح اعلان</TableHead>
              <TableHead className="w-[150px] text-right">مقصد مرتبط</TableHead>
              <TableHead className="w-[120px] text-right">وضعیت</TableHead>
              <TableHead className="w-[180px] text-right">زمان رویداد</TableHead>
              <TableHead className="w-[100px] text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((item) => {
              const typeInfo = getTypeBadge(item.type);
              const priorityBadge = getPriorityBadge(item.priority);

              return (
                <TableRow
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className={`cursor-pointer transition-colors group ${
                    !item.isRead ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'
                  }`}
                >
                  {/* Category & Type */}
                  <TableCell className="text-right">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${typeInfo.className}`}
                      >
                        {typeInfo.icon}
                        <span>{typeInfo.label}</span>
                      </span>
                    </div>
                  </TableCell>

                  {/* Title & Excerpt */}
                  <TableCell className="text-right">
                    <div className="space-y-1 py-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        {priorityBadge}
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </TableCell>

                  {/* Destination Link */}
                  <TableCell className="text-right">
                    {item.link ? (
                      <span className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                        <span>مشاهده صفحه</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/60">-</span>
                    )}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="text-right">
                    {item.isRead ? (
                      <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground border-border/80">
                        خوانده‌شده
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">
                        خوانده‌نشده
                      </Badge>
                    )}
                  </TableCell>

                  {/* Date & Time */}
                  <TableCell className="text-right text-xs text-muted-foreground font-sans">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                      <span>{formatDateTime(item.createdAt)}</span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-left" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {!item.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="علامت‌گذاری به عنوان خوانده‌شده"
                          onClick={() => onMarkRead(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="حذف اعلان"
                        onClick={() => onDelete(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
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
