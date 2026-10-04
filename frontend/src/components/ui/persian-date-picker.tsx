'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PersianCalendar, PersianCalendarProps } from '@/components/ui/persian-calendar';
import { formatJalali } from '@/lib/jalali';
import { cn } from '@/lib/utils';

export interface PersianDatePickerProps extends Omit<PersianCalendarProps, 'className'> {
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export function PersianDatePicker({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ...',
  disabled = false,
  clearable = true,
  className,
  ...calendarProps
}: PersianDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const formattedDisplay = React.useMemo(() => {
    if (!value) return null;
    return formatJalali(value, 'long');
  }, [value]);

  const handleSelect = (date: Date | null) => {
    onChange?.(date);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs transition-colors hover:bg-muted/40 focus:outline-none focus:ring-1 focus:ring-ring font-sans text-right',
            !value && 'text-muted-foreground',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
          dir="rtl"
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{formattedDisplay || placeholder}</span>
          </div>

          {clearable && value && !disabled && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 transition-colors"
              title="پاک کردن تاریخ"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="p-0 w-auto" sideOffset={6} dir="rtl">
        <PersianCalendar
          value={value}
          onChange={handleSelect}
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}
