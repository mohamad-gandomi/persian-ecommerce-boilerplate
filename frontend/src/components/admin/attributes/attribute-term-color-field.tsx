'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export const PERSIAN_COLOR_PRESETS = [
  { name: 'مشکی', hex: '#000000' },
  { name: 'سفید', hex: '#FFFFFF' },
  { name: 'طوسی', hex: '#6B7280' },
  { name: 'سرمه‌ای', hex: '#1E3A8A' },
  { name: 'آبی', hex: '#2563EB' },
  { name: 'سبز', hex: '#16A34A' },
  { name: 'قرمز', hex: '#DC2626' },
  { name: 'زرد', hex: '#EAB308' },
  { name: 'قهوه‌ای', hex: '#78350F' },
  { name: 'کرم', hex: '#F5F2EB' },
];

interface AttributeTermColorFieldProps {
  valueColorHex: string;
  onChangeColorHex: (hex: string) => void;
}

export function AttributeTermColorField({
  valueColorHex,
  onChangeColorHex,
}: AttributeTermColorFieldProps) {
  return (
    <div className="p-3 sm:p-3.5 rounded-xl border border-border/80 bg-muted/30 space-y-3 w-full min-w-0 overflow-hidden font-sans" dir="rtl">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0">
          <input
            type="color"
            className="w-10 h-10 rounded-lg cursor-pointer border border-border p-0.5 bg-transparent shrink-0"
            value={valueColorHex}
            onChange={(e) => onChangeColorHex(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1 text-right">
          <span className="text-[11px] font-semibold text-muted-foreground">کد رنگ (Hex)</span>
          <Input
            className="font-sans text-xs h-8 w-full text-left dir-ltr"
            placeholder="#000000"
            value={valueColorHex}
            onChange={(e) => onChangeColorHex(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-1.5 pt-1 min-w-0 text-right">
        <span className="text-[11px] text-muted-foreground font-semibold">رنگ‌های پیشنهادی پرکاربرد:</span>
        <div className="flex flex-wrap gap-1.5">
          {PERSIAN_COLOR_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              onClick={() => onChangeColorHex(preset.hex)}
              title={preset.name}
              className={cn(
                'w-6 h-6 rounded-full border border-black/20 transition-transform hover:scale-110 shadow-2xs shrink-0',
                valueColorHex.toLowerCase() === preset.hex.toLowerCase() && 'ring-2 ring-primary ring-offset-2',
              )}
              style={{ backgroundColor: preset.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
