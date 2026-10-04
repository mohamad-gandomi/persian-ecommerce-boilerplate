'use client';

import * as React from 'react';
import { Pencil, UserCheck, ShieldCheck, KeyRound, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PersianDatePicker } from '@/components/ui/persian-date-picker';
import { toEnglishDigits } from '@/lib/jalali';
import { Role } from '@/types';
import { cn } from '@/lib/utils';

interface UserProfileTabProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  nationalId: string;
  setNationalId: (val: string) => void;
  birthDate: Date | null;
  setBirthDate: (val: Date | null) => void;
  role: Role;
  setRole: (val: Role) => void;
  password: string;
  setPassword: (val: string) => void;
  isSaving: boolean;
  onSave: (e: React.FormEvent) => void;
}

export function UserProfileTab({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  nationalId,
  setNationalId,
  birthDate,
  setBirthDate,
  role,
  setRole,
  password,
  setPassword,
  isSaving,
  onSave,
}: UserProfileTabProps) {
  return (
    <Card className="border-border/80 shadow-xs font-sans" dir="rtl">
      <CardHeader className="pb-3 border-b border-border/60 text-right">
        <CardTitle className="text-base flex items-center gap-2">
          <Pencil className="w-4 h-4 text-primary" />
          <span>مشخصات هویتی و سطح دسترسی</span>
        </CardTitle>
        <CardDescription className="text-xs">
          ویرایش اطلاعات تماس مشتری، اختیارات مدیریتی و بازنشانی گذرواژه.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-5">
        <form onSubmit={onSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-foreground">نام *</label>
              <Input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="text-xs text-right font-sans"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-foreground">نام خانوادگی *</label>
              <Input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="text-xs text-right font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-foreground">نشانی ایمیل *</label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs text-left dir-ltr font-sans"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-foreground">شماره تماس</label>
              <Input
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs text-left dir-ltr font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-foreground">کد ملی (۱۰ رقم)</label>
              <Input
                placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
                maxLength={10}
                value={nationalId}
                onChange={(e) => setNationalId(toEnglishDigits(e.target.value).replace(/\D/g, ''))}
                className="text-xs text-left dir-ltr font-sans"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-semibold text-foreground">تاریخ تولد (شمسی)</label>
              <PersianDatePicker
                value={birthDate}
                onChange={(d) => setBirthDate(d)}
                maxDate={new Date()}
                placeholder="انتخاب تاریخ تولد..."
                startYear={1320}
                endYear={1405}
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2 pt-2 text-right">
            <label className="text-xs font-semibold text-foreground">نقش دسترسی</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={cn(
                  'p-3 rounded-xl border text-right flex items-start gap-3 transition-all font-sans',
                  role === 'CUSTOMER'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                    : 'border-border/80 hover:bg-muted/40 text-muted-foreground',
                )}
              >
                <UserCheck
                  className={cn('w-4 h-4 shrink-0 mt-0.5', role === 'CUSTOMER' ? 'text-primary' : 'text-muted-foreground')}
                />
                <div className="text-right">
                  <p className="text-xs font-semibold text-foreground">مشتری عادی</p>
                  <p className="text-[11px] text-muted-foreground">خریدار فروشگاه با امکان ثبت نشانی و سفارش.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={cn(
                  'p-3 rounded-xl border text-right flex items-start gap-3 transition-all font-sans',
                  role === 'ADMIN'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                    : 'border-border/80 hover:bg-muted/40 text-muted-foreground',
                )}
              >
                <ShieldCheck
                  className={cn('w-4 h-4 shrink-0 mt-0.5', role === 'ADMIN' ? 'text-primary' : 'text-muted-foreground')}
                />
                <div className="text-right">
                  <p className="text-xs font-semibold text-foreground">مدیر فروشگاه</p>
                  <p className="text-[11px] text-muted-foreground">دسترسی به بخش مدیریت، محصولات، سفارش‌ها و تنظیمات.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Security Reset Password */}
          <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-2 pt-3 text-right">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-primary" />
              بازنشانی گذرواژه کاربر
            </label>
            <Input
              type="password"
              placeholder="گذرواژه جدید (حداقل ۶ کاراکتر) یا خالی بگذارید تا تغییر نکند"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-xs bg-background text-right font-sans"
            />
            <p className="text-[11px] text-muted-foreground">
              تنها در صورتی این فیلد را پر کنید که مایل به بازنویسی و تغییر رمز عبور فعلی کاربر هستید.
            </p>
          </div>

          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              disabled={isSaving}
              className="gap-1.5 font-semibold w-full sm:w-auto font-sans"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات پروفایل'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
