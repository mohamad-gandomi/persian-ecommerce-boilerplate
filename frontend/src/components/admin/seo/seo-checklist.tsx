'use client';

import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { computeSeoRules, SeoCheckItem } from './seo-rules';
import { SeoScoreBanner } from './seo-score-banner';
import { SeoRuleCard } from './seo-rule-card';

interface SeoChecklistProps {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
}

export function SeoChecklist({
  title,
  slug,
  excerpt,
  content,
  featuredImage,
  categoryId,
  categoryName,
}: SeoChecklistProps) {
  const [filter, setFilter] = React.useState<'all' | 'failed' | 'passed'>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<'all' | 'google' | 'structure' | 'geo'>('all');

  const items = React.useMemo(() => {
    return computeSeoRules({
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      categoryId,
      categoryName,
    });
  }, [title, slug, excerpt, content, featuredImage, categoryId, categoryName]);

  const totalScore = React.useMemo(
    () => items.reduce((acc, item) => (item.passed ? acc + item.scoreWeight : acc), 0),
    [items]
  );

  const passedCount = items.filter((i) => i.passed).length;
  const failedCount = items.filter((i) => !i.passed).length;
  const googleCount = items.filter((i) => i.category === 'google' && i.passed).length;
  const structureCount = items.filter((i) => i.category === 'structure' && i.passed).length;
  const geoCount = items.filter((i) => i.category === 'geo' && i.passed).length;

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      if (filter === 'passed' && !item.passed) return false;
      if (filter === 'failed' && item.passed) return false;
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      return true;
    });
  }, [items, filter, categoryFilter]);

  return (
    <div className="space-y-6 font-sans" dir="rtl">
      <SeoScoreBanner
        totalScore={totalScore}
        passedCount={passedCount}
        totalCount={items.length}
        googleCount={googleCount}
        structureCount={structureCount}
        geoCount={geoCount}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border bg-muted/40 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md font-medium transition-colors font-sans ${
              filter === 'all' ? 'bg-card text-foreground shadow-xs font-semibold' : 'text-muted-foreground'
            }`}
          >
            همه موارد ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('failed')}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 font-sans ${
              filter === 'failed' ? 'bg-card text-rose-600 shadow-xs font-semibold' : 'text-muted-foreground'
            }`}
          >
            <span>نیازمند اقدام</span>
            {failedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold font-sans">
                {failedCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilter('passed')}
            className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 font-sans ${
              filter === 'passed' ? 'bg-card text-emerald-600 shadow-xs font-semibold' : 'text-muted-foreground'
            }`}
          >
            <span>پاس‌شده</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold font-sans">
              {passedCount}
            </span>
          </button>
        </div>

        {categoryFilter !== 'all' && (
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className="text-xs text-primary hover:underline font-medium font-sans"
          >
            نمایش همه دسته‌ها (لغو فیلتر)
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <SeoRuleCard key={item.id} item={item} />
        ))}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center border rounded-xl border-dashed border-border bg-card/40 space-y-2 font-sans">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 opacity-60" />
            <h4 className="text-sm font-medium text-foreground">موردی با این فیلتر یافت نشد</h4>
            <p className="text-xs text-muted-foreground">
              روی دکمه «همه موارد» کلیک کنید تا تمام ۱۰ بررسی سئو را مشاهده کنید.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
