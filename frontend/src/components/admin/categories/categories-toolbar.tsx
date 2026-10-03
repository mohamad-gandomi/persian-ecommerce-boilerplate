'use client';

import * as React from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CategoriesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
}

export function CategoriesToolbar({
  search,
  onSearchChange,
  onOpenCreate,
}: CategoriesToolbarProps) {
  return (
    <div className="space-y-4 font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            دسته‌بندی‌های کاتالوگ و فضاها
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            مدیریت مجموعه‌ها، چیدمان سلسله‌مراتبی و تصاویر شاخص دسته‌بندی‌های فروشگاه.
          </p>
        </div>

        <Button
          onClick={onOpenCreate}
          className="gap-2 font-semibold shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          افزودن دسته‌بندی
        </Button>
      </div>

      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجوی دسته با عنوان یا نامک..."
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

        {search && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSearchChange('')}
            className="text-xs h-9 self-start sm:self-auto font-sans"
          >
            پاک کردن جستجو
          </Button>
        )}
      </div>
    </div>
  );
}
