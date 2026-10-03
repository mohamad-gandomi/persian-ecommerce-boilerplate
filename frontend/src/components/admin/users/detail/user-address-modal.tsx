'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Address, User } from '@/types';
import { toast } from 'sonner';

interface UserAddressModalProps {
  isOpen: boolean;
  mode: 'CREATE' | 'EDIT';
  user: User;
  address?: Address | null;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function UserAddressModal({
  isOpen,
  mode,
  user,
  address,
  isPending,
  onClose,
  onSubmit,
}: UserAddressModalProps) {
  const [title, setTitle] = React.useState('منزل');
  const [recipientName, setRecipientName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [city, setCity] = React.useState('');
  const [province, setProvince] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [isDefaultShipping, setIsDefaultShipping] = React.useState(false);
  const [isDefaultBilling, setIsDefaultBilling] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'EDIT' && address) {
        setTitle(address.title || 'منزل');
        setRecipientName(address.recipientName || '');
        setPhone(address.phone || '');
        setStreet(address.street || '');
        setCity(address.city || '');
        setProvince(address.province || '');
        setPostalCode(address.postalCode || '');
        setIsDefaultShipping(address.isDefaultShipping ?? false);
        setIsDefaultBilling(address.isDefaultBilling ?? false);
      } else {
        setTitle('منزل');
        setRecipientName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
        setPhone(user.phone || '');
        setStreet('');
        setCity('');
        setProvince('');
        setPostalCode('');
        setIsDefaultShipping(false);
        setIsDefaultBilling(false);
      }
    }
  }, [isOpen, mode, address, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !recipientName.trim()) {
      toast.error('نام تحویل‌گیرنده، شهر و آدرس پستی الزامی هستند');
      return;
    }
    onSubmit({
      title: title.trim() || 'منزل',
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      province: province.trim() || 'نامشخص',
      postalCode: postalCode.trim() || 'نامشخص',
      isDefaultShipping,
      isDefaultBilling,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle>{mode === 'CREATE' ? 'ثبت نشانی تحویل / صورت‌حساب' : 'ویرایش نشانی مشتری'}</DialogTitle>
          <DialogDescription>
            {mode === 'CREATE' ? `ثبت نشانی جدید برای ارسال مرسوله‌های ${user.firstName} ${user.lastName}.` : `بروزرسانی مشخصات آدرس ارسال ${user.firstName} ${user.lastName}.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1 w-full min-w-0 max-w-full text-right">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">عنوان نشانی *</label>
              <Input required placeholder="مثال: منزل، محل کار، ویلا" value={title} onChange={(e) => setTitle(e.target.value)} className="text-xs w-full text-right font-sans" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">نام کامل تحویل‌گیرنده *</label>
              <Input required placeholder="مثال: علیرضا محمدی" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="text-xs w-full text-right font-sans" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">شماره تماس تحویل‌گیرنده *</label>
              <Input required placeholder="۰۹۱۲۳۴۵۶۷۸۹" value={phone} onChange={(e) => setPhone(e.target.value)} className="text-xs w-full text-left dir-ltr font-sans" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">کد پستی ۱۰ رقمی</label>
              <Input placeholder="۱۲۳۴۵۶۷۸۹۰" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="text-xs w-full text-left dir-ltr font-sans" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">استان *</label>
              <Input required placeholder="تهران" value={province} onChange={(e) => setProvince(e.target.value)} className="text-xs w-full text-right font-sans" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">شهر *</label>
              <Input required placeholder="تهران" value={city} onChange={(e) => setCity(e.target.value)} className="text-xs w-full text-right font-sans" />
            </div>
          </div>

          <div className="space-y-1.5 min-w-0">
            <label className="text-xs font-semibold text-foreground">نشانی دقیق پستی *</label>
            <Input required placeholder="خیابان، کوچه، پلاک، واحد" value={street} onChange={(e) => setStreet(e.target.value)} className="text-xs w-full text-right font-sans" />
          </div>

          <div className="space-y-2 pt-2 border-t border-border/60">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input type="checkbox" checked={isDefaultShipping} onChange={(e) => setIsDefaultShipping(e.target.checked)} className="rounded border-border text-primary focus:ring-primary w-4 h-4" />
              <span className="text-foreground font-medium">تنظیم به عنوان نشانی پیش‌فرض تحویل سفارش‌ها</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input type="checkbox" checked={isDefaultBilling} onChange={(e) => setIsDefaultBilling(e.target.checked)} className="rounded border-border text-primary focus:ring-primary w-4 h-4" />
              <span className="text-foreground font-medium">تنظیم به عنوان نشانی پیش‌فرض صورت‌حساب</span>
            </label>
          </div>

          <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
            <Button type="button" variant="outline" className="w-full sm:w-auto font-sans" onClick={onClose}>انصراف</Button>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto font-semibold font-sans">
              {isPending ? 'در حال ذخیره...' : mode === 'CREATE' ? 'ثبت نشانی' : 'ذخیره تغییرات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
