'use client';

import * as React from 'react';
import { Plus, Search, X, Palette, Image as ImageIcon, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AttributesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: 'ALL' | 'COLOR' | 'IMAGE' | 'TEXT';
  onTypeFilterChange: (type: 'ALL' | 'COLOR' | 'IMAGE' | 'TEXT') => void;
  onOpenCreateAttr: () => void;
}

export function AttributesToolbar({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  onOpenCreateAttr,
}: AttributesToolbarProps) {
  const tabs = [
    { label: 'همه موارد', val: 'ALL', icon: null },
    { label: 'کد رنگ', val: 'COLOR', icon: Palette },
    { label: 'تصویر و طرح', val: 'IMAGE', icon: ImageIcon },
    { label: 'مشخصات متنی', val: 'TEXT', icon: Tag },
  ] as const;

  return (
    <div className="space-y-4 font-sans" dir="rtl">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            ویژگی‌ها و متغیرهای کالا
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            مدیریت مشخصات متغیر کالاها نظیر رنگ، سایز، جنس بدنه و مشخصات فنی.
          </p>
        </div>

        <Button
          onClick={onOpenCreateAttr}
          className="gap-2 font-semibold shadow-xs shrink-0 self-start sm:self-auto font-sans"
        >
          <Plus className="w-4 h-4" />
          افزودن ویژگی جدید
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجوی عنوان ویژگی یا گزینه‌ها..."
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

        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted/40 text-xs overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = typeFilter === tab.val;
            return (
              <button
                key={tab.val}
                type="button"
                onClick={() => onTypeFilterChange(tab.val)}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-all text-xs whitespace-nowrap flex items-center gap-1.5',
                  isSelected
                    ? 'bg-card text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {Icon && <Icon className="w-3 h-3 shrink-0" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
