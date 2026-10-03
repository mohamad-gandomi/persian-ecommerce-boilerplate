'use client';

import * as React from 'react';
import { UserPlus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UsersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: 'ALL' | 'CUSTOMER' | 'ADMIN';
  onRoleFilterChange: (role: 'ALL' | 'CUSTOMER' | 'ADMIN') => void;
  onOpenCreate: () => void;
}

export function UsersToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  onOpenCreate,
}: UsersToolbarProps) {
  return (
    <div className="space-y-4 font-sans" dir="rtl">
      {/* Top Header Banner */}
      <div className="space-y-1 text-right">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          پروفایل‌ها و حساب‌های کاربری ثبت‌شده
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          مدیریت حساب مشتریان، نشانی‌های ارسال سفارش و تیم مدیریت فروشگاه.
        </p>
      </div>

      {/* Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="جستجو با نام، ایمیل یا شماره تماس..."
              className="pr-9 pl-9 bg-card h-9 w-full text-right font-sans text-xs"
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

          {/* Role Filter Buttons */}
          <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs shrink-0 h-9 box-border">
            {[
              { label: 'همه', val: 'ALL' },
              { label: 'مشتریان', val: 'CUSTOMER' },
              { label: 'مدیران', val: 'ADMIN' },
            ].map((tab) => (
              <button
                key={tab.val}
                type="button"
                onClick={() => onRoleFilterChange(tab.val as any)}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center font-sans ${
                  roleFilter === tab.val
                    ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={onOpenCreate}
          className="gap-2 shrink-0 font-semibold shadow-xs font-sans self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          افزودن حساب جدید
        </Button>
      </div>
    </div>
  );
}
