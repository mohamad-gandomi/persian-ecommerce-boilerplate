'use client';

import * as React from 'react';
import { Sparkles, Globe, FileText, Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SeoScoreBannerProps {
  totalScore: number;
  passedCount: number;
  totalCount: number;
  googleCount: number;
  structureCount: number;
  geoCount: number;
  categoryFilter: 'all' | 'google' | 'structure' | 'geo';
  onCategoryFilterChange: (cat: 'all' | 'google' | 'structure' | 'geo') => void;
}

export function SeoScoreBanner({
  totalScore,
  passedCount,
  totalCount,
  googleCount,
  structureCount,
  geoCount,
  categoryFilter,
  onCategoryFilterChange,
}: SeoScoreBannerProps) {
  const scoreColor =
    totalScore >= 80 ? 'text-emerald-600 dark:text-emerald-400' : totalScore >= 60 ? 'text-amber-500' : 'text-rose-500';
  const progressBg =
    totalScore >= 80 ? 'bg-emerald-500' : totalScore >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  const scoreBadgeVariant =
    totalScore >= 80
      ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
      : totalScore >= 60
      ? 'border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300'
      : 'border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300';
  const scoreLabel =
    totalScore >= 80 ? 'رتبه کیفی عالی (A)' : totalScore >= 60 ? 'رتبه کیفی خوب (B)' : 'نیازمند بهینه‌سازی (C)';

  return (
    <Card className="overflow-hidden border-border/80 shadow-xs font-sans" dir="rtl">
      <div className="p-4 sm:p-6 bg-gradient-to-br from-card via-card to-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                امتیاز کیفیت محتوا و سئو / GEO
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              سنجش زنده برای موتورهای جستجوی سنتی (Google) و موتورهای هوش مصنوعی (ChatGPT, Gemini, Perplexity).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <div className="text-right">
              <div className={`text-3xl sm:text-4xl font-black tracking-tight font-sans ${scoreColor}`}>
                {totalScore}
                <span className="text-base font-normal text-muted-foreground font-sans"> / ۱۰۰</span>
              </div>
              <div className="text-[11px] font-medium text-muted-foreground font-sans">
                {passedCount} مورد از {totalCount} معیار پاس شده
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold font-sans ${scoreBadgeVariant}`}>
              {scoreLabel}
            </span>
            <span className="text-xs font-semibold text-muted-foreground font-sans">{totalScore}٪</span>
          </div>
          <div className="w-full bg-muted/80 rounded-full h-2.5 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
              style={{ width: `${Math.max(4, totalScore)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 mt-2 border-t border-border/40 text-center font-sans">
          <button
            type="button"
            onClick={() => onCategoryFilterChange(categoryFilter === 'google' ? 'all' : 'google')}
            className={`p-2.5 rounded-lg border text-right transition-colors ${
              categoryFilter === 'google' ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-border/60 bg-card/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>سئوی گوگل</span>
              </span>
              <span className="text-xs font-bold text-foreground font-sans">{googleCount}/۵</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange(categoryFilter === 'structure' ? 'all' : 'structure')}
            className={`p-2.5 rounded-lg border text-right transition-colors ${
              categoryFilter === 'structure' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-border/60 bg-card/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                <span>عمق محتوا</span>
              </span>
              <span className="text-xs font-bold text-foreground font-sans">{structureCount}/۲</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onCategoryFilterChange(categoryFilter === 'geo' ? 'all' : 'geo')}
            className={`p-2.5 rounded-lg border text-right transition-colors ${
              categoryFilter === 'geo' ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20' : 'border-border/60 bg-card/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-purple-500" />
                <span>هوش مصنوعی و GEO</span>
              </span>
              <span className="text-xs font-bold text-foreground font-sans">{geoCount}/۳</span>
            </div>
          </button>
        </div>
      </div>
    </Card>
  );
}
