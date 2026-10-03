'use client';

import * as React from 'react';
import Link from 'next/link';
import { Image as ImageIcon, FolderTree, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BlogCategory, PostStatus } from '@/types';

interface BlogSidebarFieldsProps {
  featuredImage: string;
  onFeaturedImageChange: (url: string) => void;
  onOpenMediaPicker: () => void;
  categoryId: string;
  onCategoryIdChange: (id: string) => void;
  categories: BlogCategory[];
  status: PostStatus;
  onStatusChange: (status: PostStatus) => void;
}

export function BlogSidebarFields({
  featuredImage,
  onFeaturedImageChange,
  onOpenMediaPicker,
  categoryId,
  onCategoryIdChange,
  categories,
  status,
  onStatusChange,
}: BlogSidebarFieldsProps) {
  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      {/* Featured Cover Image Card */}
      <Card>
        <CardHeader className="pb-3 text-right">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>تصویر شاخص و کاور</span>
          </CardTitle>
          <CardDescription className="text-xs">
            تصویر اصلی نمایش‌داده‌شده در بنر و پیش‌نمایش شبکه‌های اجتماعی.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {featuredImage ? (
            <div className="space-y-3">
              <div className="w-full aspect-video rounded-xl bg-muted border border-border overflow-hidden relative group">
                <img
                  src={featuredImage}
                  alt="تصویر شاخص"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onOpenMediaPicker}
                  className="flex-1 text-xs gap-1.5 h-8 font-sans"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>تغییر تصویر</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeaturedImageChange('')}
                  className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2 font-sans"
                  title="حذف تصویر"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={onOpenMediaPicker}
              className="w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/60 bg-muted/20 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center space-y-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">انتخاب تصویر کاور</p>
                <p className="text-[11px] text-muted-foreground">
                  کلیک کنید تا از کتابخانه رسانه تصویر را انتخاب یا بارگذاری نمایید.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1 pt-1 text-right">
            <label className="text-[11px] font-medium text-muted-foreground">
              یا آدرس مستقیم تصویر را وارد کنید
            </label>
            <Input
              placeholder="https://..."
              className="text-xs h-8 bg-background font-sans dir-ltr text-left"
              value={featuredImage}
              onChange={(e) => onFeaturedImageChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Category & Topic Card */}
      <Card>
        <CardHeader className="pb-3 text-right">
          <CardTitle className="text-base flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-primary" />
            <span>دسته‌بندی موضوعی</span>
          </CardTitle>
          <CardDescription className="text-xs">
            انتساب این مقاله به یکی از موضوعات وبلاگ فروشگاه.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-foreground">دسته‌بندی مقاله</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs font-sans text-right"
              value={categoryId}
              onChange={(e) => onCategoryIdChange(e.target.value)}
            >
              <option value="">عمومی (بدون دسته‌بندی)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-1 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>نیاز به موضوع جدید دارید؟</span>
            <Link
              href="/admin/blog/categories"
              className="text-primary hover:underline font-medium inline-flex items-center gap-1 font-sans"
            >
              <span>مدیریت دسته‌ها</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Status & Visibility Card */}
      <Card>
        <CardHeader className="pb-3 text-right">
          <CardTitle className="text-base">وضعیت انتشار</CardTitle>
          <CardDescription className="text-xs">
            تعیین دسترسی و نمایش عمومی در فروشگاه.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 font-sans">
            <button
              type="button"
              onClick={() => onStatusChange('PUBLISHED')}
              className={`p-3 rounded-xl border text-right transition-all ${
                status === 'PUBLISHED'
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs'
                  : 'border-border hover:border-muted-foreground/30 bg-card'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-foreground">منتشرشده</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                بلافاصله برای تمامی بازدیدکنندگان قابل مشاهده است.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onStatusChange('DRAFT')}
              className={`p-3 rounded-xl border text-right transition-all ${
                status === 'DRAFT'
                  ? 'border-wood-500 bg-wood-50/50 dark:bg-wood-950/20 shadow-xs'
                  : 'border-border hover:border-muted-foreground/30 bg-card'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-bold text-foreground">پیش‌نویس</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                تنها برای تیم مدیریت قابل مشاهده و ویرایش است.
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
