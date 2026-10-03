'use client';

import * as React from 'react';
import { Link as LinkIcon, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlogCategoryImageField } from './blog-category-image-field';
import { BlogCategory } from '@/types';

interface BlogCategoryFormModalProps {
  isOpen: boolean;
  mode: 'CREATE' | 'EDIT';
  category?: BlogCategory;
  categories: BlogCategory[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    slug: string;
    description?: string;
    image?: string | null;
    parentId?: string | null;
    displayOrder: number;
  }) => void;
}

export function BlogCategoryFormModal({
  isOpen,
  mode,
  category,
  categories,
  isPending,
  onClose,
  onSubmit,
}: BlogCategoryFormModalProps) {
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');
  const [parentId, setParentId] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState(0);
  const [isCustomSlug, setIsCustomSlug] = React.useState(false);

  const generateSlug = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  React.useEffect(() => {
    if (category && mode === 'EDIT') {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
      setImage(category.image || '');
      setParentId(category.parentId || '');
      setDisplayOrder(category.displayOrder ?? 0);
      setIsCustomSlug(true);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setImage('');
      setParentId('');
      setDisplayOrder(categories.length);
      setIsCustomSlug(false);
    }
  }, [category, mode, categories.length, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      slug: slug.trim() || generateSlug(name),
      description: description.trim() || undefined,
      image: image.trim() || null,
      parentId: parentId || null,
      displayOrder: Number(displayOrder) || 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-y-auto font-sans" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>
            {mode === 'CREATE' ? 'ایجاد دسته‌بندی موضوعی جدید' : `ویرایش دسته‌بندی: ${category?.name}`}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            دسته‌بندی‌های وبلاگ برای سازماندهی مقالات آموزشی و اخبار فروشگاه به کار می‌روند.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-right">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">نام دسته‌بندی *</label>
            <Input
              required
              placeholder="مثلاً: راهنمای خرید و مقالات آموزشی"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!isCustomSlug && mode === 'CREATE') setSlug(generateSlug(e.target.value));
              }}
              className="text-right font-sans text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span>نامک آدرس (Slug) *</span>
              </label>
              <button
                type="button"
                onClick={() => { setIsCustomSlug(false); setSlug(generateSlug(name)); }}
                className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>تولید مجدد</span>
              </button>
            </div>
            <Input
              required
              placeholder="wood-care-guide"
              className="font-sans dir-ltr text-xs text-left"
              value={slug}
              onChange={(e) => { setIsCustomSlug(true); setSlug(generateSlug(e.target.value)); }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-foreground">دسته‌بندی والد</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs font-sans text-right"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">بدون والد (دسته اصلی)</option>
                {categories
                  .filter((c) => mode !== 'EDIT' || c.id !== category?.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.parent ? `— ${c.name}` : c.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">ترتیب نمایش</label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                className="text-xs w-full font-sans text-center"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">توضیحات (اختیاری)</label>
            <textarea
              rows={2}
              className="w-full rounded-md border border-input bg-background p-3 text-xs shadow-2xs font-sans text-right"
              placeholder="توضیح کوتاه درباره موضوعات تحت پوشش این دسته..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <BlogCategoryImageField image={image} onChange={setImage} />

          <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="font-sans">
              انصراف
            </Button>
            <Button type="submit" size="sm" disabled={isPending} className="font-semibold font-sans">
              {isPending ? 'در حال ذخیره...' : mode === 'CREATE' ? 'ایجاد دسته‌بندی' : 'ذخیره تغییرات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
