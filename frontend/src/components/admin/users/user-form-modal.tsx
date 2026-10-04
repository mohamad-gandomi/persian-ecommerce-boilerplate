'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PersianDatePicker } from '@/components/ui/persian-date-picker';
import { isValidIranianNationalId, toEnglishDigits } from '@/lib/jalali';
import { toast } from 'sonner';
import { User, Role } from '@/types';

interface UserFormModalProps {
  isOpen: boolean;
  mode: 'CREATE' | 'EDIT';
  user?: User | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function UserFormModal({
  isOpen,
  mode,
  user,
  isPending,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [nationalId, setNationalId] = React.useState('');
  const [birthDate, setBirthDate] = React.useState<Date | null>(null);
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<Role>('CUSTOMER');
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'EDIT' && user) {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setNationalId(user.nationalId || '');
        setBirthDate(user.birthDate ? new Date(user.birthDate) : null);
        setPassword('');
        setRole(user.role || 'CUSTOMER');
        setIsActive(user.isActive ?? true);
      } else {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setNationalId('');
        setBirthDate(null);
        setPassword('');
        setRole('CUSTOMER');
        setIsActive(true);
      }
    }
  }, [isOpen, mode, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    if (mode === 'CREATE' && !password.trim()) return;

    const cleanNational = nationalId.trim();
    if (cleanNational && !isValidIranianNationalId(cleanNational)) {
      toast.error('کد ملی وارد شده طبق الگوریتم رسمی نامعتبر است (باید ۱۰ رقم معتبر باشد)');
      return;
    }

    const payload: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      nationalId: cleanNational || (mode === 'EDIT' ? null : undefined),
      birthDate: birthDate ? birthDate.toISOString() : (mode === 'EDIT' ? null : undefined),
      role,
      isActive,
    };

    if (password.trim()) {
      payload.password = password.trim();
    }

    onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle>
            {mode === 'CREATE' ? 'افزودن حساب کاربری جدید' : `ویرایش کاربر: ${user?.firstName} ${user?.lastName}`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'CREATE'
              ? 'ایجاد حساب کاربری مشتری جدید یا پروفایل مدیر فروشگاه.'
              : 'ویرایش مشخصات هویتی، سطح دسترسی یا وضعیت فعالیت حساب.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1 w-full min-w-0 max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">نام *</label>
              <Input
                required
                placeholder="مثال: علی"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="text-xs w-full text-right"
              />
            </div>

            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">نام خانوادگی *</label>
              <Input
                required
                placeholder="مثال: رضایی"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="text-xs w-full text-right"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">نشانی ایمیل *</label>
              <Input
                required
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-xs w-full text-left dir-ltr font-sans"
              />
            </div>

            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">شماره تماس</label>
              <Input
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xs w-full text-left dir-ltr font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">کد ملی (۱۰ رقم)</label>
              <Input
                placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
                maxLength={10}
                value={nationalId}
                onChange={(e) => setNationalId(toEnglishDigits(e.target.value).replace(/\D/g, ''))}
                className="text-xs w-full text-left dir-ltr font-sans"
              />
            </div>

            <div className="space-y-1.5 min-w-0 text-right">
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

          <div className="space-y-1.5 min-w-0 text-right">
            <label className="text-xs font-semibold text-foreground">
              {mode === 'CREATE' ? 'رمز عبور *' : 'تغییر رمز عبور (در صورت نیاز به تغییر وارد کنید)'}
            </label>
            <Input
              required={mode === 'CREATE'}
              type="password"
              placeholder={mode === 'CREATE' ? 'حداقل ۶ کاراکتر' : 'در صورت خالی ماندن رمز تغییر نمی‌کند'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-xs w-full text-right font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">نقش کاربری</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus:outline-none focus:ring-1 focus:ring-ring text-right"
              >
                <option value="CUSTOMER">مشتری (پیش‌فرض)</option>
                <option value="ADMIN">مدیر فروشگاه</option>
              </select>
            </div>

            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">وضعیت حساب</label>
              <select
                value={isActive ? 'active' : 'inactive'}
                onChange={(e) => setIsActive(e.target.value === 'active')}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus:outline-none focus:ring-1 focus:ring-ring text-right"
              >
                <option value="active">فعال</option>
                <option value="inactive">معلق / غیرفعال</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
            <Button type="button" variant="outline" className="w-full sm:w-auto font-sans" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto font-semibold font-sans">
              {isPending ? 'در حال ثبت...' : mode === 'CREATE' ? 'ایجاد حساب کاربری' : 'ذخیره تغییرات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
