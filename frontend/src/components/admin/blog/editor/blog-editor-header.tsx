'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PostStatus } from '@/types';

interface BlogEditorHeaderProps {
  isNew: boolean;
  title: string;
  slug: string;
  status: PostStatus;
  isSaving: boolean;
  onSave: () => void;
  onDelete?: () => void;
}

export function BlogEditorHeader({
  isNew,
  title,
  slug,
  status,
  isSaving,
  onSave,
  onDelete,
}: BlogEditorHeaderProps) {
  const router = useRouter();

  return (
    <div className="p-3.5 sm:p-5 rounded-xl border border-border bg-card shadow-xs space-y-3 font-sans" dir="rtl">
      {/* Top row: Back link + Action Buttons */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          <span>بازگشت به مقالات وبلاگ</span>
        </Link>

        <div className="flex items-center gap-2">
          {onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-xs h-8 sm:h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-destructive/20 font-sans"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">حذف مقاله</span>
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/blog')}
            className="text-xs h-8 sm:h-9 font-medium font-sans"
          >
            انصراف
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="gap-1.5 text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-xs font-semibold font-sans"
          >
            {isNew ? <Plus className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>
              {isSaving
                ? 'در حال ذخیره‌سازی...'
                : isNew
                ? 'انتشار و ذخیره مقاله'
                : 'ذخیره تغییرات'}
            </span>
          </Button>
        </div>
      </div>

      {/* Bottom row: Title & Meta Info */}
      <div className="pt-2.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight truncate max-w-[260px] sm:max-w-md">
            {title || (isNew ? 'داستان یا مقاله جدید' : 'ویرایش مقاله')}
          </h1>
          <Badge
            variant={status === 'PUBLISHED' ? 'success' : 'secondary'}
            className="text-[10px] px-2 py-0.5 font-sans"
          >
            {status === 'PUBLISHED' ? 'منتشرشده' : 'پیش‌نویس'}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-sans shrink-0">
          <span className="dir-ltr">/{slug || 'auto-generated-slug'}</span>
          <span>•</span>
          <span>{isNew ? 'مقاله جدید وبلاگ' : 'به‌روزرسانی محتوا'}</span>
        </div>
      </div>
    </div>
  );
}
