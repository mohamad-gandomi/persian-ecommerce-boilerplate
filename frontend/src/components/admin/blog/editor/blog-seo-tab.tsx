'use client';

import * as React from 'react';
import { Globe, Bot, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SeoChecklist } from '@/components/admin/seo-checklist';
import { BlogCategory } from '@/types';

interface BlogSeoTabProps {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  categories: BlogCategory[];
}

export function BlogSeoTab({
  title,
  slug,
  excerpt,
  content,
  featuredImage,
  categoryId,
  categories,
}: BlogSeoTabProps) {
  const wordCount = React.useMemo(() => {
    if (!content) return 0;
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const categoryName = categories.find((c) => c.id === categoryId)?.name;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans" dir="rtl">
      {/* Left Column: Real-Time SEO & GEO Checklist (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        <SeoChecklist
          title={title}
          slug={slug}
          excerpt={excerpt}
          content={content}
          featuredImage={featuredImage}
          categoryId={categoryId}
          categoryName={categoryName}
        />
      </div>

      {/* Right Column: Previews & Metrics (1 col) */}
      <div className="space-y-6 text-right">
        {/* Search Engine Snippet Preview Card */}
        <Card>
          <CardHeader className="pb-3 text-right">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>پیش‌نمایش در نتایج گوگل (SERP)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              نمای زنده مقاله در نتایج جستجوی دسکتاپ و موبایل گوگل.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-muted/20 space-y-1.5 text-right">
              <div className="text-[11px] text-muted-foreground truncate font-sans dir-ltr text-right">
                https://example.com › blog › <span className="text-foreground font-semibold">{slug || 'article-slug'}</span>
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
                {title || 'عنوان مقاله'} | فروشگاه آنلاین
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {excerpt ||
                  'راهنمای جامع خرید، جدیدترین نکات و مقالات کاربردی در وبلاگ فروشگاه اینترنتی.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Answer Engine / GEO Preview Card */}
        <Card>
          <CardHeader className="pb-3 text-right">
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-500" />
              <span>استناد در هوش مصنوعی (GEO)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              شبیه‌سازی پاسخ و استناد در ChatGPT، Gemini و Perplexity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-50/20 dark:bg-purple-950/10 space-y-2.5 text-right">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>پاسخ سنتزشده موتور هوش مصنوعی</span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed italic">
                «{excerpt || (content ? content.slice(0, 150) + '...' : 'فروشگاه آنلاین ارائه‌دهنده باکیفیت‌ترین کالاها با قیمت مناسب و ضمانت بازگشت وجه است.')}»
              </p>
              <div className="pt-2 border-t border-border/50 flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-bold">منبع استناد:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-background border border-border font-medium text-foreground font-sans dir-ltr">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  example.com/blog/{slug || 'article-slug'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Article Metrics */}
        <Card>
          <CardHeader className="pb-3 text-right">
            <CardTitle className="text-base">آمار و معیارهای مقاله</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-muted-foreground">تعداد کل کلمات</span>
              <span className="font-semibold text-foreground">{wordCount} کلمه</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">زمان تخمینی مطالعه</span>
              <span className="font-semibold text-foreground">حدود {readingTime} دقیقه</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
