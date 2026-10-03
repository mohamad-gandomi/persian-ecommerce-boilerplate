'use client';

import * as React from 'react';
import { Link as LinkIcon, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Category } from '@/types';

interface ProductBasicFieldsProps {
  name: string;
  onNameChange: (val: string) => void;
  slug: string;
  onSlugChange: (val: string) => void;
  onGenerateSlug: () => void;
  sku: string;
  onSkuChange: (val: string) => void;
  categoryId: string;
  onCategoryIdChange: (val: string) => void;
  categories: Category[];
  productType: 'SIMPLE' | 'VARIABLE';
  onProductTypeChange: (val: 'SIMPLE' | 'VARIABLE') => void;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  onStatusChange: (val: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED') => void;
  shortDescription: string;
  onShortDescriptionChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  featured: boolean;
  onFeaturedChange: (val: boolean) => void;
}

export function ProductBasicFields({
  name,
  onNameChange,
  slug,
  onSlugChange,
  onGenerateSlug,
  sku,
  onSkuChange,
  categoryId,
  onCategoryIdChange,
  categories,
  productType,
  onProductTypeChange,
  status,
  onStatusChange,
  shortDescription,
  onShortDescriptionChange,
  description,
  onDescriptionChange,
  featured,
  onFeaturedChange,
}: ProductBasicFieldsProps) {
  return (
    <Card className="font-sans text-right" dir="rtl">
      <CardHeader className="text-right">
        <CardTitle className="text-base font-bold">مشخصات اصلی و نامک آدرس</CardTitle>
        <CardDescription className="text-xs">
          اطلاعات بنیادین کالا، عنوان نمایشی، دسته‌بندی و وضعیت انتشار در فروشگاه.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">عنوان محصول *</label>
          <Input
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="مثلاً: هدفون بی‌سیم حرفه‌ای مدل Pro"
            className="font-medium text-right font-sans"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span>نامک آدرس (URL Slug) *</span>
            </label>
            <button
              type="button"
              onClick={onGenerateSlug}
              className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1 font-sans"
            >
              <RefreshCw className="w-3 h-3" />
              <span>تولید مجدد از عنوان</span>
            </button>
          </div>
          <Input
            required
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="pro-wireless-headphones"
            className="font-sans dir-ltr text-xs text-left"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">شناسه کالا (SKU)</label>
            <Input
              value={sku}
              onChange={(e) => onSkuChange(e.target.value)}
              placeholder="PRD-001"
              className="font-sans dir-ltr text-xs text-left"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">دسته‌بندی محصول</label>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">نوع محصول</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs font-sans text-right"
              value={productType}
              onChange={(e) => onProductTypeChange(e.target.value as 'SIMPLE' | 'VARIABLE')}
            >
              <option value="SIMPLE">ساده (تک‌محصول بدون متغیر)</option>
              <option value="VARIABLE">متغیر (دارای ویژگی‌ها، رنگ یا سایزهای مختلف)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">وضعیت نمایش</label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs font-sans text-right"
              value={status}
              onChange={(e) => onStatusChange(e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED')}
            >
              <option value="PUBLISHED">منتشرشده (نمایش زنده در فروشگاه)</option>
              <option value="DRAFT">پیش‌نویس (مخفی از دید مشتریان)</option>
              <option value="ARCHIVED">بایگانی‌شده</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">خلاصه کوتاه محصول</label>
          <Input
            value={shortDescription}
            onChange={(e) => onShortDescriptionChange(e.target.value)}
            placeholder="توضیح کوتاه یک‌خطی برای کارت‌های ویترین فروشگاه"
            className="text-xs font-sans text-right"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            توضیحات کامل محصول *
          </label>
          <textarea
            rows={5}
            required
            className="w-full rounded-md border border-input bg-background p-3 text-xs sm:text-sm shadow-2xs font-sans text-right"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="توضیحات جامع و مشخصات تکمیلی محصول..."
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium font-sans">
            <input
              type="checkbox"
              className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
              checked={featured}
              onChange={(e) => onFeaturedChange(e.target.checked)}
            />
            <span>نمایش به عنوان «محصول ویژه» در بخش برگزیده‌های فروشگاه</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
}
