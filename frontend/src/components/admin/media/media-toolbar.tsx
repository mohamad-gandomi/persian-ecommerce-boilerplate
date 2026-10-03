'use client';

import * as React from 'react';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MediaToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedMime: string;
  onSelectMime: (mime: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function MediaToolbar({
  search,
  onSearchChange,
  selectedMime,
  onSelectMime,
  viewMode,
  onViewModeChange,
}: MediaToolbarProps) {
  const formats = [
    { label: 'همه قالب‌ها', val: 'all' },
    { label: 'JPEG', val: 'jpeg' },
    { label: 'PNG', val: 'png' },
    { label: 'WebP', val: 'webp' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 font-sans" dir="rtl">
      {/* Search Box */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="جستجو بر اساس نام فایل یا متن جایگزین..."
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

      <div className="flex items-center gap-2">
        {/* Format filter pills */}
        <div className="flex items-center p-1 rounded-lg border border-border bg-muted/60 text-xs">
          {formats.map((ext) => (
            <button
              key={ext.val}
              type="button"
              onClick={() => onSelectMime(ext.val)}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-all text-xs font-sans',
                selectedMime === ext.val
                  ? 'bg-card text-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {ext.label}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 rounded-lg border border-border bg-muted/60 text-xs">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-1.5 rounded-md transition-all',
              viewMode === 'grid' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground',
            )}
            title="نمایش شبکه‌ای"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-1.5 rounded-md transition-all',
              viewMode === 'list' ? 'bg-card text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground',
            )}
            title="نمایش جدولی"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
