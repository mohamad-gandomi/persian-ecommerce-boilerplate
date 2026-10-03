'use client';

import * as React from 'react';
import { Folder } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types';
import { CategoryImageField } from './category-image-field';

interface CategoryFormModalProps {
  isOpen: boolean;
  mode: 'CREATE' | 'EDIT';
  category?: Category;
  flatCategories: Category[];
  isPending: boolean;
  initialParentId?: string;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    parentId: string | null;
    displayOrder: number;
  }) => void;
  onOpenMediaPicker: () => void;
  selectedImageUrl?: string;
  onClearImage: () => void;
}

export function CategoryFormModal({
  isOpen,
  mode,
  category,
  flatCategories,
  isPending,
  initialParentId,
  onClose,
  onSubmit,
  onOpenMediaPicker,
  selectedImageUrl,
  onClearImage,
}: CategoryFormModalProps) {
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [parentId, setParentId] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState(0);

  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'EDIT' && category) {
        setName(category.name || '');
        setSlug(category.slug || '');
        setDescription(category.description || '');
        setParentId(category.parentId || '');
        setDisplayOrder(category.displayOrder ?? 0);
      } else {
        setName('');
        setSlug('');
        setDescription('');
        setParentId(initialParentId || '');
        setDisplayOrder(flatCategories.length);
      }
    }
  }, [isOpen, mode, category, initialParentId, flatCategories.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      slug: slug.trim() || undefined,
      description: description.trim() || undefined,
      image: selectedImageUrl?.trim() || undefined,
      parentId: parentId || null,
      displayOrder: Number(displayOrder) || 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain font-sans" dir="rtl">
        <DialogHeader className="pl-6 text-right">
          <DialogTitle>
            {mode === 'CREATE' ? 'افزودن دسته‌بندی جدید' : `ویرایش دسته‌بندی: ${category?.name}`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'CREATE'
              ? 'ایجاد دسته‌بندی اصلی محصولات یا یک زیردسته اختصاصی.'
              : 'ویرایش عنوان، نامک، دسته والد و تصویر شاخص.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1 w-full min-w-0 max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">نام دسته‌بندی *</label>
              <Input
                required
                placeholder="مثال: کالای دیجیتال، پوشاک، لوازم خانگی"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs w-full text-right"
              />
            </div>

            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">نامک / Slug (اختیاری)</label>
              <Input
                placeholder="electronics (خودکار تولید می‌شود)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="text-xs w-full text-left dir-ltr font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full min-w-0">
            <div className="space-y-1.5 sm:col-span-2 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">دسته والد (سرشاخه)</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus:outline-none focus:ring-1 focus:ring-ring text-right"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">بدون والد (دسته‌بندی اصلی)</option>
                {flatCategories
                  .filter((c) => mode !== 'EDIT' || c.id !== category?.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.parent ? `— ${c.name}` : c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1.5 min-w-0 text-right">
              <label className="text-xs font-semibold text-foreground">ترتیب نمایش</label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="text-xs w-full text-center font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5 min-w-0 text-right">
            <label className="text-xs font-semibold text-foreground">توضیحات کوتاه (اختیاری)</label>
            <Input
              placeholder="توضیح کوتاه برای کارت‌های فروشگاه و بهینه‌سازی سئو"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs w-full text-right"
            />
          </div>

          <CategoryImageField
            selectedImageUrl={selectedImageUrl}
            onClearImage={onClearImage}
            onOpenMediaPicker={onOpenMediaPicker}
          />

          <div className="p-3 rounded-lg border border-border/60 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs w-full min-w-0 overflow-hidden">
            <span className="text-muted-foreground font-medium shrink-0">پیش‌نمایش در فروشگاه:</span>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border bg-background shadow-2xs self-start sm:self-auto min-w-0 max-w-full">
              {selectedImageUrl ? (
                <img src={selectedImageUrl} alt="preview" className="w-6 h-6 rounded-md object-cover ring-1 ring-border shrink-0" />
              ) : (
                <Folder className="w-4 h-4 text-wood-700 dark:text-wood-300 shrink-0" />
              )}
              <span className="font-semibold text-foreground truncate">{name.trim() || 'نام دسته‌بندی'}</span>
              {parentId && (
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 shrink-0 font-sans">
                  زیردسته
                </Badge>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 w-full min-w-0">
            <Button type="button" variant="outline" className="w-full sm:w-auto font-sans" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto font-semibold font-sans">
              {isPending ? 'در حال ذخیره...' : mode === 'CREATE' ? 'ایجاد دسته‌بندی' : 'ذخیره تغییرات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
