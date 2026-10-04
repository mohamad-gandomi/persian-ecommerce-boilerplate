'use client';

import * as React from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  toJalaliDate,
  fromJalaliDate,
  PERSIAN_MONTH_NAMES,
  PERSIAN_WEEK_DAYS,
  toPersianDigits,
  jalaaliMonthLength,
} from '@/lib/jalali';

export interface PersianCalendarProps {
  value?: Date | string | null;
  onChange?: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  startYear?: number;
  endYear?: number;
  className?: string;
}

export function PersianCalendar({
  value,
  onChange,
  minDate,
  maxDate,
  startYear = 1320,
  endYear = 1410,
  className,
}: PersianCalendarProps) {
  // Current today in Jalali
  const todayJalali = React.useMemo(() => toJalaliDate(new Date())!, []);

  // Selected date parsed
  const selectedJalali = React.useMemo(() => toJalaliDate(value), [value]);

  // View state (which year and month is currently being viewed)
  const [viewYear, setViewYear] = React.useState<number>(
    selectedJalali?.jy || todayJalali.jy,
  );
  const [viewMonth, setViewMonth] = React.useState<number>(
    selectedJalali?.jm || todayJalali.jm,
  );

  // Sync view when value changes from outside
  React.useEffect(() => {
    if (selectedJalali) {
      setViewYear(selectedJalali.jy);
      setViewMonth(selectedJalali.jm);
    }
  }, [selectedJalali?.jy, selectedJalali?.jm]);

  // List of available years for quick dropdown
  const years = React.useMemo(() => {
    const list: number[] = [];
    for (let y = endYear; y >= startYear; y--) {
      list.push(y);
    }
    return list;
  }, [startYear, endYear]);

  // Calculate days in current viewed month
  const totalDays = React.useMemo(
    () => jalaaliMonthLength(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  // Calculate day of week of the 1st day (0 = Saturday, 6 = Friday)
  const firstDayOfWeek = React.useMemo(() => {
    const firstDate = fromJalaliDate(viewYear, viewMonth, 1);
    return (firstDate.getUTCDay() + 1) % 7;
  }, [viewYear, viewMonth]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const d = fromJalaliDate(viewYear, viewMonth, day);
    onChange?.(d);
  };

  const handleTodayClick = () => {
    setViewYear(todayJalali.jy);
    setViewMonth(todayJalali.jm);
    const d = fromJalaliDate(todayJalali.jy, todayJalali.jm, todayJalali.jd);
    onChange?.(d);
  };

  return (
    <div className={cn('p-3 select-none w-72 max-w-full font-sans', className)} dir="rtl">
      {/* 1. Header with Month/Year Dropdowns and Navigation */}
      <div className="flex items-center justify-between gap-1.5 pb-3 border-b border-border/70">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="ماه قبل"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {/* Month Dropdown */}
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className="text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground rounded-md px-2 py-1 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            {PERSIAN_MONTH_NAMES.map((name, index) => (
              <option key={index + 1} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={viewYear}
            onChange={(e) => setViewYear(Number(e.target.value))}
            className="text-xs font-semibold bg-muted/60 hover:bg-muted text-foreground rounded-md px-2 py-1 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer dir-ltr text-right"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {toPersianDigits(y)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="ماه بعد"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Days of week header */}
      <div className="grid grid-cols-7 gap-1 py-2 text-center text-[11px] font-bold text-muted-foreground border-b border-border/40">
        {PERSIAN_WEEK_DAYS.map((day, idx) => (
          <div
            key={idx}
            className={cn('py-0.5', idx === 6 && 'text-red-500/80 dark:text-red-400')}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 3. Days Grid */}
      <div className="grid grid-cols-7 gap-1 pt-2 text-center text-xs">
        {/* Empty slots before first day */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="w-8 h-8" />
        ))}

        {/* Days of month */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const isSelected =
            selectedJalali?.jy === viewYear &&
            selectedJalali?.jm === viewMonth &&
            selectedJalali?.jd === day;

          const isToday =
            todayJalali.jy === viewYear &&
            todayJalali.jm === viewMonth &&
            todayJalali.jd === day;

          const currentDayDate = fromJalaliDate(viewYear, viewMonth, day);
          const isDisabled =
            (minDate && currentDayDate < minDate) ||
            (maxDate && currentDayDate > maxDate);

          return (
            <button
              key={day}
              type="button"
              disabled={isDisabled}
              onClick={() => handleSelectDay(day)}
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-all text-xs relative',
                isSelected
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'hover:bg-muted text-foreground',
                isToday && !isSelected && 'border border-primary text-primary font-bold',
                isDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent text-muted-foreground',
              )}
            >
              {toPersianDigits(day)}
              {isToday && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Footer with Today button */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/60 text-xs">
        <button
          type="button"
          onClick={handleTodayClick}
          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>امروز ({toPersianDigits(todayJalali.jd)} {PERSIAN_MONTH_NAMES[todayJalali.jm - 1]})</span>
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange?.(null)}
            className="text-[11px] text-muted-foreground hover:text-red-500 transition-colors"
          >
            پاک کردن
          </button>
        )}
      </div>
    </div>
  );
}
