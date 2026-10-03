'use client';

import * as React from 'react';
import { Image as ImageIcon, FileText, HardDrive, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBytes } from './media-utils';
import { cn } from '@/lib/utils';

interface MediaHeaderBannerProps {
  totalAssets: number;
  catalogSize: number;
  diskSize: number;
  isRefetching: boolean;
  isUploading: boolean;
  onRefresh: () => void;
  onUploadClick: () => void;
}

export function MediaHeaderBanner({
  totalAssets,
  catalogSize,
  diskSize,
  isRefetching,
  isUploading,
  onRefresh,
  onUploadClick,
}: MediaHeaderBannerProps) {
  return (
    <div className="p-4 sm:p-5 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans" dir="rtl">
      <div className="space-y-1 text-right">
        <div className="flex-col md:flex items-center gap-2">
          <h1 className="text-xl pb-2 sm:text-2xl font-bold text-foreground tracking-tight">
            کتابخانه پرونده‌های چندرسانه‌ای
          </h1>
          <Badge variant="wood" className=" mb-2 text-xs font-sans">
            ذخیره‌سازی پایگاه‌داده
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-medium text-foreground">
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
            {totalAssets} فایل رسانه
          </span>
          <span>•</span>
          <span className="flex items-center gap-1" title="مجموع حجم ثبت‌شده فایل‌ها در کاتالوگ فروشگاه">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            حجم کاتالوگ: {formatBytes(catalogSize)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1" title="فضای ذخیره‌سازی اشغال‌شده روی سرور دیسک">
            <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
            روی دیسک سرور: {formatBytes(diskSize)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefetching}
          className="text-xs h-9 gap-1.5 font-sans"
          title="بروزرسانی فهرست رسانه‌ها"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isRefetching && 'animate-spin')} />
          <span className="hidden sm:inline">بروزرسانی</span>
        </Button>

        <Button
          size="sm"
          onClick={onUploadClick}
          disabled={isUploading}
          className="text-xs h-9 gap-1.5 font-semibold shadow-xs font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>{isUploading ? 'در حال بارگذاری...' : 'بارگذاری رسانه'}</span>
        </Button>
      </div>
    </div>
  );
}
