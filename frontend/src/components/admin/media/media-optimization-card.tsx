'use client';

import * as React from 'react';
import { Sparkles, Sliders, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaOptimizationCardProps {
  convertToWebp: boolean;
  onToggleWebp: (checked: boolean) => void;
  qualityPreset: number;
  onChangeQuality: (val: number) => void;
  maxWidthOption: number;
  onChangeMaxWidth: (val: number) => void;
  showOptions: boolean;
  onToggleShowOptions: () => void;
  isSaving: boolean;
}

export function MediaOptimizationCard({
  convertToWebp,
  onToggleWebp,
  qualityPreset,
  onChangeQuality,
  maxWidthOption,
  onChangeMaxWidth,
  showOptions,
  onToggleShowOptions,
  isSaving,
}: MediaOptimizationCardProps) {
  return (
    <div className="p-3 sm:p-4 rounded-xl border border-border/80 bg-card shadow-xs space-y-2.5 font-sans" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={convertToWebp}
              onChange={(e) => onToggleWebp(e.target.checked)}
              className="rounded border-border w-4 h-4 text-primary focus:ring-primary"
            />
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              تبدیل خودکار به قالب بهینه WebP (پیشنهادی)
            </span>
          </label>
          {isSaving ? (
            <span className="text-[11px] text-primary font-medium animate-pulse">
              ذخیره در پایگاه‌داده...
            </span>
          ) : (
            <span className="hidden md:inline text-[11px] text-muted-foreground">
              • کاهش ۷۰ تا ۸۵ درصدی حجم تصاویر بدون افت کیفیت محسوس
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleShowOptions}
          className="text-xs text-primary hover:underline font-medium flex items-center gap-1 self-start sm:self-auto font-sans"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showOptions ? 'بستن تنظیمات' : 'تنظیم کیفیت و ابعاد خروجی'}</span>
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showOptions && 'rotate-180')} />
        </button>
      </div>

      {showOptions && (
        <div className="pt-2.5 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-right">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground text-[11px]">کیفیت فشرده‌سازی WebP</span>
              <span className="font-sans text-muted-foreground text-[11px]">{qualityPreset}٪</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'فشرده (۷۰٪)', val: 70 },
                { label: 'متعادل (۸۰٪)', val: 80 },
                { label: 'کیفیت بالا (۹۰٪)', val: 90 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => onChangeQuality(preset.val)}
                  className={cn(
                    'py-1 px-2 rounded-md text-[11px] font-medium border transition-colors font-sans',
                    qualityPreset === preset.val
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border',
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground text-[11px]">حداکثر عرض تصویر (پیکسل)</span>
              <span className="font-sans text-muted-foreground text-[11px]">
                {maxWidthOption === 0 ? 'اندازه اصلی (بدون تغییر)' : `${maxWidthOption} پیکسل`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Full HD (۱۹۲۰px)', val: 1920 },
                { label: '2K QHD (۲۰۴۸px)', val: 2048 },
                { label: 'اندازه اصلی', val: 0 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => onChangeMaxWidth(opt.val)}
                  className={cn(
                    'py-1 px-2 rounded-md text-[11px] font-medium border transition-colors font-sans',
                    maxWidthOption === opt.val
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
