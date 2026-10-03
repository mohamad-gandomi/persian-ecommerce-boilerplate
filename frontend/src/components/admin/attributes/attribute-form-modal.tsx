'use client';

import * as React from 'react';
import { Tag, Palette, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Attribute } from '@/types';
import { cn } from '@/lib/utils';

interface AttributeFormModalProps {
  isOpen: boolean;
  mode: 'CREATE' | 'EDIT';
  attribute?: Attribute;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; slug?: string; displayType?: string }) => void;
}

export function AttributeFormModal({
  isOpen,
  mode,
  attribute,
  isPending,
  onClose,
  onSubmit,
}: AttributeFormModalProps) {
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [displayType, setDisplayType] = React.useState<'TEXT' | 'COLOR' | 'IMAGE'>('TEXT');

  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'EDIT' && attribute) {
        setName(attribute.name || '');
        setSlug(attribute.slug || '');
        setDisplayType(((attribute.displayType || 'TEXT').toUpperCase()) as any);
      } else {
        setName('');
        setSlug('');
        setDisplayType('TEXT');
      }
    }
  }, [isOpen, mode, attribute]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      slug: slug.trim() || undefined,
      displayType,
    });
  };

  const types = [
    { type: 'TEXT', title: 'مشخصه متنی / سایز', desc: 'متن ساده، سایز یا ابعاد کالا', icon: Tag },
    { type: 'COLOR', title: 'کد رنگ', desc: 'انتخاب کدهای رنگی Hex', icon: Palette },
    { type: 'IMAGE', title: 'تصویر و طرح', desc: 'عکس نمونه طرح یا بافت کالا', icon: ImageIcon },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)] font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle>
            {mode === 'CREATE' ? 'تعریف ویژگی جدید' : `ویرایش ویژگی: ${attribute?.name}`}
          </DialogTitle>
          <DialogDescription>
            ویژگی‌ها برای تعریف گزینه‌های متغیر مانند رنگ، سایز، جنس، یا مدل استفاده می‌شوند.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 w-full min-w-0">
          <div className="space-y-1.5 min-w-0 text-right">
            <label className="text-xs font-semibold text-foreground">نام ویژگی *</label>
            <Input
              required
              placeholder="مثال: رنگ، سایز، جنس، مدل"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs w-full text-right"
            />
          </div>

          <div className="space-y-1.5 min-w-0 text-right">
            <label className="text-xs font-semibold text-foreground">نامک / Slug (اختیاری)</label>
            <Input
              placeholder="color (خودکار تولید می‌شود)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="text-xs w-full text-left dir-ltr font-sans"
            />
          </div>

          <div className="space-y-1.5 min-w-0 text-right">
            <label className="text-xs font-semibold text-foreground">نوع پیش‌فرض نمایش گزینه</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full min-w-0">
              {types.map((item) => {
                const IconComponent = item.icon;
                const isSelected = displayType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setDisplayType(item.type)}
                    className={cn(
                      'p-2.5 rounded-lg border text-right flex flex-row sm:flex-col items-center sm:items-start gap-2.5 sm:gap-1 transition-all min-w-0',
                      isSelected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                        : 'border-border/80 hover:bg-muted/40 text-muted-foreground',
                    )}
                  >
                    <IconComponent
                      className={cn('w-4 h-4 shrink-0', isSelected ? 'text-primary' : 'text-muted-foreground')}
                    />
                    <div className="flex flex-col min-w-0 text-right">
                      <span className="text-xs font-semibold text-foreground truncate">{item.title}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
            <Button type="button" variant="outline" className="w-full sm:w-auto font-sans" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto font-semibold font-sans">
              {isPending ? 'در حال ذخیره...' : mode === 'CREATE' ? 'ایجاد ویژگی' : 'ذخیره تغییرات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
