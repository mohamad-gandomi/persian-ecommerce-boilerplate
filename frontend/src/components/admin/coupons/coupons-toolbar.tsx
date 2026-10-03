'use client';

import * as React from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CouponsToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: 'ALL' | 'PERCENTAGE' | 'FIXED_AMOUNT';
  setSelectedType: (type: 'ALL' | 'PERCENTAGE' | 'FIXED_AMOUNT') => void;
  totalCount: number;
  onCreateClick: () => void;
}

export function CouponsToolbar(props: CouponsToolbarProps) {
  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    totalCount,
    onCreateClick,
  } = props;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-sans" dir="rtl">
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="جستجو با کد تخفیف یا توضیحات..."
            className="pr-9 pl-3 bg-card h-9 text-xs text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs shrink-0 h-9 box-border">
          <button
            type="button"
            onClick={() => setSelectedType('ALL')}
            className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
              selectedType === 'ALL'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            همه
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('PERCENTAGE')}
            className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
              selectedType === 'PERCENTAGE'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            درصدی
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('FIXED_AMOUNT')}
            className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
              selectedType === 'FIXED_AMOUNT'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            مبلغ ثابت
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3">
        <span className="text-xs text-muted-foreground font-medium">
          نمایش <strong className="text-foreground">{totalCount}</strong> کد
        </span>
        <Button onClick={onCreateClick} className="h-9 text-xs gap-1.5 font-semibold">
          <Plus className="w-4 h-4" />
          <span>ایجاد کد تخفیف</span>
        </Button>
      </div>
    </div>
  );
}
