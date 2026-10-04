'use client';

import * as React from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FlashDealsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: 'all' | 'active' | 'upcoming' | 'expired';
  onSelectedStatusChange: (status: 'all' | 'active' | 'upcoming' | 'expired') => void;
  totalCount: number;
  onAddDeal: () => void;
}

export function FlashDealsToolbar({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onSelectedStatusChange,
  totalCount,
  onAddDeal,
}: FlashDealsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 font-sans" dir="rtl">
      {/* Search Input Row & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4.5 h-4.5 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="جستجوی جشنواره با عنوان، توضیحات یا برچسب..."
            className="pr-10 pl-9 bg-card h-11 sm:h-10 text-right font-sans text-sm sm:text-xs w-full rounded-xl border-border/80 shadow-2xs"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action: Add Flash Deal */}
        <Button
          onClick={onAddDeal}
          className="gap-2 shrink-0 h-10 sm:h-10 font-semibold shadow-xs font-sans w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تعریف پیشنهاد شگفت‌انگیز جدید</span>
        </Button>
      </div>

      {/* Status Filter Buttons Row */}
      <div className="flex items-center rounded-xl border border-border/60 bg-muted/60 p-1 text-xs shrink-0 self-start overflow-x-auto max-w-full">
        {[
          { label: 'همه کمپین‌ها', val: 'all' },
          { label: 'در حال برگزاری (فعال)', val: 'active' },
          { label: 'در انتظار شروع (آینده)', val: 'upcoming' },
          { label: 'منقضی‌شده', val: 'expired' },
        ].map((tab) => (
          <button
            key={tab.val}
            type="button"
            onClick={() => onSelectedStatusChange(tab.val as any)}
            className={`h-8 px-3 rounded-lg font-medium transition-colors flex items-center justify-center font-sans whitespace-nowrap ${
              selectedStatus === tab.val
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
