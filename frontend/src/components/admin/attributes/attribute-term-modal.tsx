'use client';

import * as React from 'react';
import { Tag, Palette, Image as ImageIcon, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Attribute, AttributeValue } from '@/types';
import { cn } from '@/lib/utils';
import { AttributeTermColorField } from './attribute-term-color-field';

interface AttributeTermModalProps {
  isOpen: boolean;
  mode: 'CREATE' | 'EDIT';
  attribute: Attribute | null;
  term?: AttributeValue;
  isPending: boolean;
  selectedImageUrl?: string;
  onClearImage: () => void;
  onOpenMediaPicker: () => void;
  onClose: () => void;
  onSubmit: (payload: { name: string; value?: string; colorHex?: string; image?: string }) => void;
}

export function AttributeTermModal({
  isOpen,
  mode,
  attribute,
  term,
  isPending,
  selectedImageUrl,
  onClearImage,
  onOpenMediaPicker,
  onClose,
  onSubmit,
}: AttributeTermModalProps) {
  const [termMode, setTermMode] = React.useState<'TEXT' | 'COLOR' | 'IMAGE'>('TEXT');
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [colorHex, setColorHex] = React.useState('#000000');

  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'EDIT' && term) {
        setName(term.name); setSlug(term.value || ''); setColorHex(term.colorHex || '#000000');
        if (term.image || selectedImageUrl) setTermMode('IMAGE');
        else if (term.colorHex) setTermMode('COLOR');
        else setTermMode('TEXT');
      } else {
        setName(''); setSlug(''); setColorHex('#000000');
        const defaultMode = (attribute?.displayType || 'TEXT').toUpperCase();
        if (defaultMode === 'IMAGE') setTermMode('IMAGE');
        else if (defaultMode === 'COLOR') setTermMode('COLOR');
        else setTermMode('TEXT');
      }
    }
  }, [isOpen, mode, term, attribute, selectedImageUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      value: slug.trim() || undefined,
      colorHex: termMode === 'COLOR' ? colorHex : undefined,
      image: termMode === 'IMAGE' ? selectedImageUrl || undefined : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle>
            {mode === 'CREATE' ? `افزودن گزینه به «${attribute?.name}»` : `ویرایش گزینه «${term?.name}»`}
          </DialogTitle>
          <DialogDescription>
            مشخصات این گزینه را تعیین کنید؛ می‌توانید نوع آن را متنی، رنگی یا تصویری انتخاب نمایید.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1 w-full min-w-0 max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">نام گزینه *</label>
              <Input
                required
                placeholder="مثال: قرمز، بزرگ، چرم، مدل A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs w-full text-right"
              />
            </div>
            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">شناسه / Slug (اختیاری)</label>
              <Input
                placeholder="red"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="text-xs w-full text-left dir-ltr font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5 w-full min-w-0 text-right">
            <label className="text-xs font-semibold text-foreground">نوع جلوه بصری گزینه</label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full min-w-0">
              {[
                { type: 'TEXT', label: 'مشخصات / متن', icon: Tag },
                { type: 'COLOR', label: 'کد رنگ', icon: Palette },
                { type: 'IMAGE', label: 'تصویر / طرح', icon: ImageIcon },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = termMode === t.type;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setTermMode(t.type as any)}
                    className={cn(
                      'p-2 rounded-lg border text-center text-[11px] sm:text-xs font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 min-w-0',
                      isSelected ? 'border-primary bg-primary/10 text-primary font-semibold' : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {termMode === 'COLOR' && (
            <AttributeTermColorField valueColorHex={colorHex} onChangeColorHex={setColorHex} />
          )}

          {termMode === 'IMAGE' && (
            <div className="p-3 sm:p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-3 w-full min-w-0 overflow-hidden text-right">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 shrink-0">
                  <ImageIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                  تصویر طرح یا نمونه
                </span>
                <Button type="button" variant="outline" size="sm" className="text-xs h-8 sm:h-7 gap-1 w-full sm:w-auto shrink-0 font-sans" onClick={onOpenMediaPicker}>
                  <Plus className="w-3 h-3 shrink-0" />
                  انتخاب از کتابخانه رسانه
                </Button>
              </div>

              {selectedImageUrl ? (
                <div className="flex items-center justify-between gap-2.5 p-2 rounded-lg border border-border bg-card w-full min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0 shadow-2xs">
                      <img src={selectedImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1 text-right">
                      <p className="text-xs font-medium text-foreground truncate">تصویر انتخاب‌شده</p>
                      <p className="text-[10px] text-muted-foreground truncate font-sans dir-ltr" title={selectedImageUrl}>
                        {selectedImageUrl}
                      </p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={onClearImage} className="text-xs text-destructive hover:bg-destructive/10 h-7 shrink-0 font-sans">
                    حذف
                  </Button>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground">جهت نمایش طرح یا رنگ کالا، عکسی با کیفیت انتخاب کنید.</p>
              )}
            </div>
          )}

          {/* Live Preview */}
          <div className="p-3 rounded-lg border border-border/60 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs w-full min-w-0 overflow-hidden">
            <span className="text-muted-foreground font-medium shrink-0">پیش‌نمایش برای خریدار:</span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background shadow-2xs self-start sm:self-auto min-w-0 max-w-full">
              {termMode === 'IMAGE' && selectedImageUrl && (
                <img src={selectedImageUrl} alt="preview" className="w-5 h-5 rounded-md object-cover ring-1 ring-border shrink-0" />
              )}
              {termMode === 'COLOR' && (
                <span className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: colorHex }} />
              )}
              <span className="font-semibold text-foreground truncate">{name.trim() || 'عنوان گزینه'}</span>
            </div>
          </div>

          <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
            <Button type="button" variant="outline" className="w-full sm:w-auto font-sans" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto font-semibold font-sans">
              {isPending ? 'در حال ذخیره...' : mode === 'CREATE' ? 'افزودن گزینه' : 'ذخیره تغییرات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
