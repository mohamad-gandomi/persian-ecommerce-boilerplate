'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface OrdersToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  totalOrdersCount: number;
}

const statusTabs = [
  { id: 'ALL', label: 'همه سفارش‌ها' },
  { id: 'PENDING', label: 'در انتظار بررسی' },
  { id: 'PROCESSING', label: 'در حال ساخت' },
  { id: 'SHIPPED', label: 'تحویل به باربری' },
  { id: 'DELIVERED', label: 'تحویل داده شده' },
  { id: 'CANCELLED', label: 'لغو شده' },
];

export function OrdersToolbar({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  totalOrdersCount,
}: OrdersToolbarProps) {
  return (
    <div className="flex flex-col gap-3 font-sans" dir="rtl">
      {/* Top Row: Search Input (Full width & Prominent on mobile) + Counter on desktop */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-lg">
          <Search className="w-4.5 h-4.5 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="جستجوی شماره سفارش، خریدار، کد رهگیری..."
            className="pr-10 pl-3.5 bg-card h-11 sm:h-10 text-sm sm:text-xs text-right rounded-xl border-border/80 shadow-2xs font-sans"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="text-xs text-muted-foreground font-medium hidden sm:flex items-center gap-1.5 shrink-0">
          <span>نمایش</span>
          <strong className="text-foreground font-semibold">{totalOrdersCount}</strong>
          <span>سفارش</span>
        </div>
      </div>

      {/* Bottom Row: Status Filter Tabs (Scrollable on mobile) */}
      <div className="flex items-center justify-between gap-2">
        <div className="w-full overflow-x-auto py-1 -my-1 flex items-center gap-1.5 p-1 bg-muted/60 dark:bg-muted/40 rounded-xl border border-border/60">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatus(tab.id)}
              className={`h-9 px-3 sm:px-3.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center whitespace-nowrap shrink-0 ${
                selectedStatus === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Counter on mobile */}
        <div className="text-xs text-muted-foreground font-medium sm:hidden shrink-0 whitespace-nowrap px-1">
          <strong className="text-foreground">{totalOrdersCount}</strong> سفارش
        </div>
      </div>
    </div>
  );
}
