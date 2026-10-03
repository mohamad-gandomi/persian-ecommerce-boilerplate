'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Save, Plus, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductEditorHeaderProps {
  isNew: boolean;
  title: string;
  sku?: string;
  slug?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  productType: 'SIMPLE' | 'VARIABLE';
  isSaving: boolean;
  onSave: () => void;
  onDelete?: () => void;
}

export function ProductEditorHeader({
  isNew,
  title,
  sku,
  slug,
  status,
  productType,
  isSaving,
  onSave,
  onDelete,
}: ProductEditorHeaderProps) {
  const router = useRouter();

  return (
    <div className="p-3.5 sm:p-5 rounded-xl border border-border bg-card shadow-xs space-y-3 font-sans" dir="rtl">
      {/* Top row: Back link + Action Buttons */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          <span>بازگشت به فهرست محصولات</span>
        </Link>

        <div className="flex items-center gap-2">
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
                ? 'ایجاد و بازگشایی محصول'
                : 'ذخیره تغییرات محصول'}
            </span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push('/products')}
            className="text-xs h-8 sm:h-9 font-medium font-sans"
          >
            انصراف
          </Button>

          {onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-xs h-8 sm:h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-destructive/20 font-sans"
              title="حذف محصول"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">حذف محصول</span>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom row: Title, Badges, and SKU / Slug info */}
      <div className="pt-2.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight truncate max-w-[260px] sm:max-w-md">
            {title || (isNew ? 'محصول جدید' : 'ویرایش محصول')}
          </h1>
          <Badge
            variant={productType === 'VARIABLE' ? 'default' : 'secondary'}
            className="text-[10px] px-2 py-0.5 font-sans"
          >
            {productType === 'VARIABLE' ? 'محصول متغیر' : 'محصول ساده'}
          </Badge>
          <Badge
            variant={status === 'PUBLISHED' ? 'success' : status === 'DRAFT' ? 'secondary' : 'outline'}
            className="text-[10px] px-2 py-0.5 font-sans"
          >
            {status === 'PUBLISHED' ? 'منتشرشده' : status === 'DRAFT' ? 'پیش‌نویس' : 'بایگانی'}
          </Badge>
        </div>

        <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-sans shrink-0">
          {sku && (
            <span className="inline-flex items-center gap-1">
              <span>کد:</span>
              <span className="dir-ltr font-sans">{sku}</span>
            </span>
          )}
          {slug && (
            <>
              <span>•</span>
              <Link
                href={`/shop/${slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <span className="dir-ltr font-sans">/{slug}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
