'use client';

import * as React from 'react';
import { Edit3, Eye, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MarkdownPreview } from '@/components/admin/markdown-preview';

interface BlogContentFieldsProps {
  title: string;
  onTitleChange: (value: string) => void;
  slug: string;
  onSlugChange: (value: string) => void;
  onResetSlug: () => void;
  excerpt: string;
  onExcerptChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
}

export function BlogContentFields({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  onResetSlug,
  excerpt,
  onExcerptChange,
  content,
  onContentChange,
}: BlogContentFieldsProps) {
  const [editorMode, setEditorMode] = React.useState<'write' | 'preview'>('write');

  const wordCount = React.useMemo(() => {
    if (!content) return 0;
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-6 font-sans" dir="rtl">
      {/* Title & Excerpt Card */}
      <Card>
        <CardHeader className="pb-3 text-right">
          <CardTitle className="text-base font-bold">عنوان و خلاصه مقاله</CardTitle>
          <CardDescription className="text-xs">
            عنوان اصلی و خلاصه متن پیش‌نمایش در فهرست وبلاگ و کارت‌های صفحات اصلی.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-right">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              عنوان اصلی مقاله *
            </label>
            <Input
              required
              placeholder="مثلاً: راهنمای جامع خرید آنلاین و انتخاب بهترین محصول"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-background font-medium text-right font-sans"
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
                onClick={onResetSlug}
                className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1 font-sans"
              >
                <RefreshCw className="w-3 h-3" />
                <span>تولید مجدد از عنوان</span>
              </button>
            </div>
            <Input
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="warmth-of-natural-walnut"
              className="font-sans dir-ltr text-xs bg-background text-left"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              خلاصه یا چکیده مقاله
            </label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-input bg-background p-3 text-xs sm:text-sm shadow-2xs font-sans text-right"
              placeholder="چکیده‌ای کوتاه در ۱ تا ۲ جمله برای جلب توجه مخاطبان در کارت‌های وبلاگ و جستجوی گوگل..."
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Body Content Editor Card with Write/Preview Toggle */}
      <Card className="overflow-hidden">
        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2 border-b border-border/60">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-foreground whitespace-nowrap">
              متن اصلی مقاله <span className="text-destructive">*</span>
            </h3>
            <span className="hidden sm:inline text-xs text-muted-foreground font-normal">
              — نگارش به صورت ساختاریافته مارک‌داون
            </span>
          </div>

          <div className="flex items-center rounded-lg border border-border bg-muted/60 p-0.5 sm:p-1 text-xs shrink-0 font-sans">
            <button
              type="button"
              onClick={() => setEditorMode('write')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                editorMode === 'write'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>ویرایش متن</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('preview')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                editorMode === 'preview'
                  ? 'bg-card text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>پیش‌نمایش</span>
            </button>
          </div>
        </div>

        <CardContent className="p-3.5 sm:p-5">
          {editorMode === 'write' ? (
            <div className="space-y-2">
              <textarea
                required
                rows={16}
                className="w-full rounded-md border border-input bg-background p-4 text-xs sm:text-sm font-sans leading-relaxed shadow-2xs text-right"
                placeholder="# عنوان بخش اول&#10;&#10;داستان نجاری یا مقاله تخصصی خود را به زبان مارک‌داون بنویسید..."
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-sans px-1 gap-2 pt-1">
                <span className="truncate">
                  پشتیبانی از مارک‌داون: # تیتر اصلی، ## تیتر فرعی، **برجسته**، - لیست
                </span>
                <span className="shrink-0 font-medium text-foreground/80">
                  {wordCount} کلمه • حدود {readingTime} دقیقه زمان مطالعه
                </span>
              </div>
            </div>
          ) : (
            <div className="min-h-[380px] p-4 sm:p-6 rounded-xl border border-border/70 bg-card/60 overflow-x-auto text-right">
              <MarkdownPreview content={content} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
