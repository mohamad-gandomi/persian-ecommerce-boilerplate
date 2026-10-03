'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ShippingMethodOption } from '@/types';

interface ShippingMethodModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingMethod: ShippingMethodOption | null;
  onSubmit: (payload: any) => void;
  isPending: boolean;
}

export function ShippingMethodModal(props: ShippingMethodModalProps) {
  const { isOpen, onOpenChange, editingMethod, onSubmit, isPending } = props;

  const [name, setName] = React.useState('');
  const [price, setPrice] = React.useState('500000');
  const [carrier, setCarrier] = React.useState('');
  const [estimatedDays, setEstimatedDays] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [type, setType] = React.useState('FIXED');
  const [isDefault, setIsDefault] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (editingMethod) {
      setName(editingMethod.name);
      setPrice(String(editingMethod.price));
      setCarrier(editingMethod.carrier || '');
      setEstimatedDays(editingMethod.estimatedDays || '');
      setDescription(editingMethod.description || '');
      setType(editingMethod.type || 'FIXED');
      setIsDefault(editingMethod.isDefault || false);
      setIsActive(editingMethod.isActive !== false);
    } else {
      setName('');
      setPrice('0');
      setCarrier('');
      setEstimatedDays('۳ تا ۵ روز کاری');
      setDescription('');
      setType('FIXED');
      setIsDefault(false);
      setIsActive(true);
    }
  }, [editingMethod, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim(),
      price: parseFloat(price) || 0,
      carrier: carrier.trim(),
      estimatedDays: estimatedDays.trim(),
      description: description.trim(),
      type,
      isDefault,
      isActive,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md font-sans" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">
            {editingMethod ? 'ویرایش روش ارسال' : 'افزودن روش ارسال جدید'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">عنوان روش ارسال *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً پست پیشتاز، تیپاکس یا تحویل حضوری..."
              className="h-10 text-xs text-right"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">هزینه ارسال (تومان) *</label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="h-10 text-xs font-sans text-left"
                dir="ltr"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">نوع ارسال</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs font-sans text-right"
              >
                <option value="FIXED">نرخ ثابت ارسال</option>
                <option value="LOCAL_PICKUP">تحویل حضوری در فروشگاه / انبار</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">نام ناوگان یا شرکت حمل‌ونقل</label>
            <Input
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              placeholder="مثلاً پست پیشتاز، تیپاکس، چاپار یا پیک موتوری..."
              className="h-10 text-xs text-right"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">مدت‌زمان تقریبی تحویل</label>
            <Input
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              placeholder="مثلاً ۳ تا ۵ روز کاری"
              className="h-10 text-xs text-right"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">توضیحات و نکات به خریدار</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات بسته‌بندی، زمان‌بندی تحویل یا کد رهگیری..."
              rows={2}
              className="w-full rounded-md border border-input bg-background p-2.5 text-xs text-right focus:outline-none focus:ring-1 focus:ring-primary font-sans"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span>روش ارسال پیش‌فرض</span>
            </label>

            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span>فعال و در دسترس مشتریان</span>
            </label>
          </div>

          <DialogFooter className="pt-2 flex-row-reverse justify-start gap-2.5 sm:gap-3">
            <Button type="submit" disabled={isPending} className="h-9 text-xs">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingMethod ? 'ذخیره تغییرات' : 'ثبت روش ارسال'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs">
              انصراف
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
