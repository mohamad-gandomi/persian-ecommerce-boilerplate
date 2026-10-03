'use client';

import * as React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SeoCheckItem } from './seo-rules';

interface SeoRuleCardProps {
  item: SeoCheckItem;
}

export function SeoRuleCard({ item }: SeoRuleCardProps) {
  return (
    <div
      className={`p-3.5 sm:p-4 rounded-xl border transition-all font-sans text-right ${
        item.passed
          ? 'border-emerald-500/25 bg-emerald-50/20 dark:bg-emerald-950/10'
          : 'border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10'
      }`}
      dir="rtl"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {item.passed ? (
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-semibold text-foreground">
                {item.title}
              </h4>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium font-sans ${
                  item.category === 'google'
                    ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    : item.category === 'structure'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                }`}
              >
                {item.categoryLabel}
              </span>
            </div>

            <span
              className={`text-[11px] font-semibold font-sans ${
                item.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {item.currentValue}
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {item.recommendation}
          </p>

          <div className="pt-1 flex items-center gap-2 text-[11px] text-muted-foreground/80 font-sans">
            <span className="text-[10px] font-semibold text-muted-foreground">
              معیار بهینه:
            </span>
            <span>{item.targetRequirement}</span>
            <span className="text-muted-foreground/40">•</span>
            <span>+{item.scoreWeight} امتیاز</span>
          </div>
        </div>
      </div>
    </div>
  );
}
