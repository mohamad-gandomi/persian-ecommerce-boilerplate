'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BlogCategoriesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddCategory: () => void;
}

export function BlogCategoriesToolbar({
  search,
  onSearchChange,
  onAddCategory,
}: BlogCategoriesToolbarProps) {
  return (
    <div className="space-y-4 font-sans" dir="rtl">
      {/* Top Header Banner with Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/blog"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium transition-colors group"
            >
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              <span>بازگشت به مقالات وبلاگ</span>
            </Link>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            دسته‌بندی موضوعی مقالات
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            مدیریت خوشه‌های موضوعی سئو، سلسله‌مراتب داستان‌های نجاری و تصاویر شاخص وبلاگ.
          </p>
        </div>

        <Button
          onClick={onAddCategory}
          className="gap-2 font-semibold shadow-xs shrink-0 self-start sm:self-auto font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن دسته‌بندی جدید</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجوی دسته‌بندی بر اساس نام یا نامک..."
            className="pr-9 pl-9 text-xs h-9 w-full text-right font-sans"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
