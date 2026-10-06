'use client';

import * as React from 'react';
import { Search, X, CheckCheck, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type NotificationTypeFilter =
  | 'ALL'
  | 'ORDER'
  | 'WALLET'
  | 'INVENTORY'
  | 'REFERRAL'
  | 'BLOG'
  | 'SYSTEM';

interface NotificationsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: NotificationTypeFilter;
  onSelectedTypeChange: (type: NotificationTypeFilter) => void;
  unreadOnly: boolean;
  onUnreadOnlyChange: (value: boolean) => void;
  onMarkAllRead: () => void;
  isMarkingAllRead?: boolean;
  unreadCount?: number;
}

export function NotificationsToolbar({
  searchTerm,
  onSearchChange,
  selectedType,
  onSelectedTypeChange,
  unreadOnly,
  onUnreadOnlyChange,
  onMarkAllRead,
  isMarkingAllRead = false,
  unreadCount = 0,
}: NotificationsToolbarProps) {
  const typeTabs: { label: string; val: NotificationTypeFilter }[] = [
    { label: 'همه اعلان‌ها', val: 'ALL' },
    { label: 'سفارش‌ها', val: 'ORDER' },
    { label: 'کیف‌پول', val: 'WALLET' },
    { label: 'انبار و کالا', val: 'INVENTORY' },
    { label: 'معرف و پاداش', val: 'REFERRAL' },
    { label: 'وبلاگ', val: 'BLOG' },
    { label: 'سیستم', val: 'SYSTEM' },
  ];

  return (
    <div className="flex flex-col gap-3 font-sans" dir="rtl">
      {/* Search Input & Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4.5 h-4.5 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="جستجوی اعلان بر اساس عنوان یا متن..."
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

        {/* Action: Mark All as Read */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onMarkAllRead}
            disabled={isMarkingAllRead || unreadCount === 0}
            className="gap-2 shrink-0 h-10 sm:h-10 font-semibold shadow-xs font-sans w-full sm:w-auto border-border/80 text-muted-foreground hover:text-foreground"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>خوانده شدن همه</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center rounded-xl border border-border/60 bg-muted/60 p-1 text-xs shrink-0 overflow-x-auto max-w-full">
          {typeTabs.map((tab) => (
            <button
              key={tab.val}
              type="button"
              onClick={() => onSelectedTypeChange(tab.val)}
              className={`h-8 px-3 rounded-lg font-medium transition-colors flex items-center justify-center font-sans whitespace-nowrap ${
                selectedType === tab.val
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Unread Only Filter Toggle */}
        <button
          type="button"
          onClick={() => onUnreadOnlyChange(!unreadOnly)}
          className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors font-sans whitespace-nowrap shadow-2xs ${
            unreadOnly
              ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
              : 'border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>فقط خوانده‌نشده‌ها</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}
