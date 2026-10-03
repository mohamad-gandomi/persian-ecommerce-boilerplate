'use client';

import * as React from 'react';
import { Clock, Copy, ShieldAlert, UserX, UserCheck, AlertTriangle, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Address } from '@/types';
import { formatDate, cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UserSecurityTabProps {
  user: User;
  addresses: Address[];
  isUpdating: boolean;
  onToggleStatus: () => void;
  onOpenDelete: () => void;
}

export function UserSecurityTab({
  user,
  addresses,
  isUpdating,
  onToggleStatus,
  onOpenDelete,
}: UserSecurityTabProps) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} در کلیپ‌بورد کپی شد`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans" dir="rtl">
      {/* Account Metadata Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60 text-right">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>اطلاعات سیستمی و متاداده حساب</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4 space-y-3.5 text-xs text-right">
          <div>
            <span className="text-muted-foreground block text-[11px]">شناسه اختصاصی کاربر (UUID)</span>
            <div className="flex items-center justify-between gap-1 pt-0.5">
              <span className="font-sans text-[11px] text-foreground truncate dir-ltr">{user.id}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(user.id, 'شناسه کاربر')}
                className="text-muted-foreground hover:text-foreground p-1 shrink-0"
                title="کپی شناسه کاربر"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-border/60">
            <span className="text-muted-foreground block text-[11px]">تاریخ عضویت</span>
            <span className="font-medium text-foreground block pt-0.5 font-sans">
              {formatDate(user.createdAt)}
            </span>
          </div>

          {user.updatedAt && (
            <div className="pt-2 border-t border-border/60">
              <span className="text-muted-foreground block text-[11px]">آخرین بروزرسانی پروفایل</span>
              <span className="font-medium text-foreground block pt-0.5 font-sans">
                {formatDate(user.updatedAt)}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-border/60">
            <span className="text-muted-foreground block text-[11px]">نشانی‌های ذخیره‌شده</span>
            <span className="font-bold text-foreground block pt-0.5 font-sans">
              {addresses.length} آدرس
            </span>
          </div>

          <div className="pt-2 border-t border-border/60">
            <span className="text-muted-foreground block text-[11px]">مقاله‌های منتشرشده وبلاگ</span>
            <span className="font-bold text-foreground block pt-0.5 font-sans">
              {user._count?.blogPosts || 0} مقاله
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Account Status & Danger Zone Card */}
      <div className="space-y-6">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60 text-right">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              <span>وضعیت حساب و مجوزها</span>
            </CardTitle>
            <CardDescription className="text-xs">
              مدیریت اجازه ورود به سیستم و اختیارات کاربری در فروشگاه.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs text-right">
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-muted/20">
              <div>
                <p className="font-semibold text-foreground">
                  {user.isActive ? 'حساب فعال است' : 'حساب معلق است'}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {user.isActive
                    ? 'کاربر می‌تواند وارد سایت شده و فرایند خرید را تکمیل کند.'
                    : 'ورود این کاربر به سایت مسدود شده است.'}
                </p>
              </div>
              <Button
                type="button"
                variant={user.isActive ? 'outline' : 'default'}
                size="sm"
                className={cn(
                  'text-xs font-semibold gap-1.5 shrink-0 font-sans',
                  user.isActive && 'text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50',
                )}
                onClick={onToggleStatus}
                disabled={isUpdating}
              >
                {user.isActive ? (
                  <>
                    <UserX className="w-3.5 h-3.5" />
                    تعلیق حساب
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    فعال‌سازی
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900/50 shadow-xs bg-red-50/20 dark:bg-red-950/10 text-right">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              بخش حساس
            </CardTitle>
            <CardDescription className="text-xs">
              حذف دائمی حساب کاربری، اطلاعات پروفایل و نشانی‌های مربوطه.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 font-semibold text-xs font-sans"
              onClick={onOpenDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
              حذف دائمی حساب کاربری
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
