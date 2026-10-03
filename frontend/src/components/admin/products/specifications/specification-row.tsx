'use client';

import * as React from 'react';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface SpecificationItem {
  label: string;
  value: string;
}

interface SpecificationRowProps {
  item: SpecificationItem;
  index: number;
  totalCount: number;
  onUpdateRow: (index: number, field: 'label' | 'value', value: string) => void;
  onDeleteRow: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export function SpecificationRow({
  item,
  index,
  totalCount,
  onUpdateRow,
  onDeleteRow,
  onMoveUp,
  onMoveDown,
}: SpecificationRowProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 p-3 rounded-xl border border-border/70 bg-card hover:border-wood-300 transition-colors">
      <div className="flex items-center gap-1 shrink-0">
        <span className="w-6 h-6 rounded-md bg-muted text-[11px] font-sans font-bold flex items-center justify-center text-muted-foreground">
          {index + 1}
        </span>
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMoveUp(index)}
          className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-20 transition-colors"
          title="انتقال به بالا"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={index === totalCount - 1}
          onClick={() => onMoveDown(index)}
          className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-20 transition-colors"
          title="انتقال به پایین"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-full sm:w-1/3 space-y-1">
        <Input
          value={item.label}
          onChange={(e) => onUpdateRow(index, 'label', e.target.value)}
          placeholder="عنوان مشخصه (مثلاً: جنس یا متریال)"
          className="h-9 text-xs font-semibold bg-background font-sans text-right"
        />
      </div>

      <div className="w-full sm:flex-1 space-y-1">
        <Input
          value={item.value}
          onChange={(e) => onUpdateRow(index, 'value', e.target.value)}
          placeholder="مقدار مشخصه (مثلاً: آلومینیوم با پوشش آنودایز)"
          className="h-9 text-xs bg-background font-sans text-right"
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onDeleteRow(index)}
        className="shrink-0 h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        title="حذف ردیف"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
