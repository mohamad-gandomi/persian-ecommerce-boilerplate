'use client';

import * as React from 'react';
import { Sparkles, Copy, Check, Eye, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MediaItem } from '@/types';
import { formatBytes } from './media-utils';

interface MediaTableViewProps {
  items: MediaItem[];
  copiedId: string | null;
  onInspect: (item: MediaItem) => void;
  onCopyUrl: (url: string, id: string) => void;
  onDelete: (item: MediaItem) => void;
}

export function MediaTableView({
  items,
  copiedId,
  onInspect,
  onCopyUrl,
  onDelete,
}: MediaTableViewProps) {
  return (
    <Card className="overflow-hidden font-sans" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-right">پیش‌نمایش</TableHead>
            <TableHead className="text-right">نام فایل و عنوان</TableHead>
            <TableHead className="text-right">قالب</TableHead>
            <TableHead className="text-right">حجم فایل</TableHead>
            <TableHead className="text-right">متن جایگزین (Alt)</TableHead>
            <TableHead className="text-right">تاریخ بارگذاری</TableHead>
            <TableHead className="text-left w-36">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isCopied = copiedId === item.id;
            const dateStr = new Date(item.createdAt).toLocaleDateString('fa-IR');

            return (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="p-2">
                  <div
                    onClick={() => onInspect(item)}
                    className="w-12 h-12 rounded-lg bg-muted overflow-hidden cursor-pointer border border-border/80 flex items-center justify-center"
                  >
                    <img
                      src={item.url}
                      alt={item.altText || item.originalName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div
                    onClick={() => onInspect(item)}
                    className="font-medium text-xs text-foreground cursor-pointer hover:underline truncate max-w-xs"
                  >
                    {item.originalName}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-sans truncate max-w-xs dir-ltr text-right">
                    {item.filename}
                  </div>
                </TableCell>

                <TableCell className="text-xs text-right">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.mimeType.includes('webp') ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                        WEBP
                      </span>
                    ) : (
                      <span className="inline-block bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded text-[10px] font-medium font-sans">
                        {item.filename.split('.').pop()?.toUpperCase() || 'FILE'}
                      </span>
                    )}
                    {item.width && item.height ? (
                      <span className="text-[10px] text-muted-foreground font-sans dir-ltr">
                        {item.width}×{item.height}
                      </span>
                    ) : null}
                  </div>
                </TableCell>

                <TableCell className="text-xs text-foreground font-semibold text-right font-sans">
                  {formatBytes(item.size)}
                </TableCell>

                <TableCell className="text-xs text-muted-foreground max-w-xs truncate text-right">
                  {item.altText || <span className="opacity-50">بدون متن</span>}
                </TableCell>

                <TableCell className="text-xs text-muted-foreground text-right font-sans">
                  {dateStr}
                </TableCell>

                <TableCell className="text-left">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCopyUrl(item.url, item.id)}
                      className="h-8 text-xs gap-1 font-sans"
                      title="کپی پیوند مستقیم"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="hidden sm:inline font-sans">
                        {isCopied ? 'کپی شد' : 'کپی لینک'}
                      </span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onInspect(item)}
                      className="h-8 w-8 p-0"
                      title="مشاهده جزئیات"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      title="حذف رسانه"
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
    </Card>
  );
}
