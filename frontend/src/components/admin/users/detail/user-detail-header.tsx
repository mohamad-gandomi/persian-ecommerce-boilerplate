'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { toPersianDigits, formatJalali } from '@/lib/jalali';

interface UserDetailHeaderProps {
  user: User;
  isSaving: boolean;
  onSave: () => void;
  onOpenDelete: () => void;
}

export function UserDetailHeader({
  user,
  isSaving,
  onSave,
  onOpenDelete,
}: UserDetailHeaderProps) {
  const initials = `${user.firstName?.[0] || 'U'}${user.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="p-3.5 sm:p-5 rounded-xl border border-border bg-card shadow-xs space-y-3 font-sans" dir="rtl">
      {/* Top row: Back link + Action Buttons */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group font-sans"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          <span>بازگشت به فهرست کاربران</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 text-xs h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5 font-sans"
            onClick={onOpenDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">حذف کاربر</span>
            <span className="sm:hidden">حذف</span>
          </Button>
          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="gap-1.5 text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-xs font-semibold font-sans"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </div>

      {/* Bottom row: Title, Badges, and Email / Phone info */}
      <div className="pt-2.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-wood-200 dark:bg-wood-950 text-wood-900 dark:text-wood-200 text-xs font-bold flex items-center justify-center shrink-0 border border-wood-300 font-sans">
            {initials}
          </div>
          <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight truncate max-w-[260px] sm:max-w-md">
            {user.firstName} {user.lastName}
          </h1>
          <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px] px-2 py-0.5 font-sans">
            {user.role === 'ADMIN' ? 'مدیر' : 'مشتری'}
          </Badge>
          {user.isActive ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 border border-emerald-200 px-2 py-0.5 rounded-full font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              حساب فعال
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded-full font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              معلق
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground font-sans shrink-0">
          <span>ایمیل: <strong className="text-foreground dir-ltr">{user.email}</strong></span>
          {user.phone && (
            <>
              <span>•</span>
              <span>تلفن: <strong className="text-foreground dir-ltr">{user.phone}</strong></span>
            </>
          )}
          {user.nationalId && (
            <>
              <span>•</span>
              <span>کد ملی: <strong className="text-foreground">{toPersianDigits(user.nationalId)}</strong></span>
            </>
          )}
          {user.birthDate && (
            <>
              <span>•</span>
              <span>تاریخ تولد: <strong className="text-foreground">{formatJalali(user.birthDate, 'long')}</strong></span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
