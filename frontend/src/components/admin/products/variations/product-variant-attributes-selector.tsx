'use client';

import * as React from 'react';
import { Attribute } from '@/types';

interface ProductVariantAttributesSelectorProps {
  productAttributes: Attribute[];
  selectedValues: Record<string, string>;
  onChange: (attributeId: string, valueId: string) => void;
}

export function ProductVariantAttributesSelector({
  productAttributes,
  selectedValues,
  onChange,
}: ProductVariantAttributesSelectorProps) {
  return (
    <div className="space-y-2 p-3 bg-muted/40 rounded-xl border border-border">
      <span className="text-xs font-bold text-foreground block">انتخاب ترکیب ویژگی‌ها:</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {productAttributes.map((attr) => (
          <div key={attr.id} className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground">{attr.name}</label>
            <select
              className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs shadow-2xs font-sans text-right"
              value={selectedValues[attr.id] || ''}
              onChange={(e) => onChange(attr.id, e.target.value)}
              required
            >
              {attr.values?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
