'use client';

import * as React from 'react';
import { Clock, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { toPersianDigits } from '@/lib/jalali';
import { cn } from '@/lib/utils';

export interface PersianTimePickerProps {
  value: string; // Format: "HH:mm" (24-hour, e.g. "09:30" or "23:59")
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const PRESETS = [
  { label: '۰۰:۰۰ شروع', time: '00:00' },
  { label: '۰۹:۰۰ صبح', time: '09:00' },
  { label: '۱۵:۰۰ ظهر', time: '15:00' },
  { label: '۲۳:۵۹ پایان', time: '23:59' },
];

export function PersianTimePicker({
  value,
  onChange,
  placeholder = 'ساعت...',
  disabled = false,
  className,
}: PersianTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse current hour and minute from value (defaults to "00:00")
  const [currentHour, currentMinute] = React.useMemo(() => {
    if (!value || !value.includes(':')) return ['00', '00'];
    const [h, m] = value.split(':');
    return [h.padStart(2, '0'), m.padStart(2, '0')];
  }, [value]);

  const handleHourSelect = (h: string) => {
    onChange(`${h}:${currentMinute}`);
  };

  const handleMinuteSelect = (m: string) => {
    onChange(`${currentHour}:${m}`);
  };

  const handleHourStep = (delta: number) => {
    const currentIdx = HOURS.indexOf(currentHour);
    const nextIdx = (currentIdx + delta + HOURS.length) % HOURS.length;
    handleHourSelect(HOURS[nextIdx]);
  };

  const handleMinuteStep = (delta: number) => {
    const currentIdx = MINUTES.indexOf(currentMinute);
    const nextIdx = (currentIdx + delta + MINUTES.length) % MINUTES.length;
    handleMinuteSelect(MINUTES[nextIdx]);
  };

  const handlePresetSelect = (presetTime: string) => {
    onChange(presetTime);
    setOpen(false);
  };

  const hourListRef = React.useRef<HTMLDivElement>(null);
  const minuteListRef = React.useRef<HTMLDivElement>(null);

  // Smoothly center the active element in view
  const scrollToActive = React.useCallback((smooth = false) => {
    if (hourListRef.current) {
      const activeHourEl = hourListRef.current.querySelector(
        '[data-active="true"]',
      ) as HTMLElement | null;
      if (activeHourEl) {
        const topPos =
          activeHourEl.offsetTop -
          (hourListRef.current.clientHeight - activeHourEl.clientHeight) / 2;
        hourListRef.current.scrollTo({
          top: Math.max(0, topPos),
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    }

    if (minuteListRef.current) {
      const activeMinuteEl = minuteListRef.current.querySelector(
        '[data-active="true"]',
      ) as HTMLElement | null;
      if (activeMinuteEl) {
        const topPos =
          activeMinuteEl.offsetTop -
          (minuteListRef.current.clientHeight - activeMinuteEl.clientHeight) / 2;
        minuteListRef.current.scrollTo({
          top: Math.max(0, topPos),
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
    }
  }, []);

  // When popover opens or values change, keep selected item centered
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        scrollToActive(false);
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [open, scrollToActive]);

  React.useEffect(() => {
    if (open) {
      scrollToActive(true);
    }
  }, [currentHour, currentMinute, open, scrollToActive]);

  // Handle mouse wheel scrolling for Hours column
  const handleHourWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 1 : -1;
    handleHourStep(delta);
  };

  // Handle mouse wheel scrolling for Minutes column
  const handleMinuteWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? 1 : -1;
    handleMinuteStep(delta);
  };

  // Mobile Touch handling for Hour column
  const hourTouchRef = React.useRef({ startY: 0, accumulated: 0 });
  const handleHourTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    hourTouchRef.current = { startY: e.touches[0].clientY, accumulated: 0 };
  };
  const handleHourTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.touches[0].clientY;
    const diff = hourTouchRef.current.startY - currentY; // positive = dragging up -> next item
    hourTouchRef.current.accumulated += diff;
    hourTouchRef.current.startY = currentY;

    const THRESHOLD = 24; // px per step
    if (Math.abs(hourTouchRef.current.accumulated) >= THRESHOLD) {
      const step = hourTouchRef.current.accumulated > 0 ? 1 : -1;
      handleHourStep(step);
      hourTouchRef.current.accumulated = 0;
    }
  };

  // Mobile Touch handling for Minute column
  const minuteTouchRef = React.useRef({ startY: 0, accumulated: 0 });
  const handleMinuteTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    minuteTouchRef.current = { startY: e.touches[0].clientY, accumulated: 0 };
  };
  const handleMinuteTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.touches[0].clientY;
    const diff = minuteTouchRef.current.startY - currentY;
    minuteTouchRef.current.accumulated += diff;
    minuteTouchRef.current.startY = currentY;

    const THRESHOLD = 24;
    if (Math.abs(minuteTouchRef.current.accumulated) >= THRESHOLD) {
      const step = minuteTouchRef.current.accumulated > 0 ? 1 : -1;
      handleMinuteStep(step);
      minuteTouchRef.current.accumulated = 0;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-9 items-center justify-between gap-2 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-2xs transition-colors hover:bg-muted/40 focus:outline-none focus:ring-1 focus:ring-ring font-sans text-right w-full w-28 shrink-0',
            !value && 'text-muted-foreground',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
          dir="rtl"
          title="انتخاب ساعت به وقت ایران (۲۴ ساعته)"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span className="font-semibold text-foreground dir-ltr font-sans">
              {value ? toPersianDigits(value) : placeholder}
            </span>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[280px] p-3.5 bg-card border border-border shadow-2xl rounded-2xl font-sans z-50"
        dir="rtl"
      >
        {/* Header Preview */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-border/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>انتخاب زمان (۲۴ ساعته)</span>
          </div>
          <span className="text-sm font-bold text-primary font-sans dir-ltr bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/20">
            {toPersianDigits(`${currentHour}:${currentMinute}`)}
          </span>
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.time}
              type="button"
              onClick={() => handlePresetSelect(preset.time)}
              className="px-2 py-1 text-[11px] rounded-lg border border-border/60 bg-muted/40 hover:bg-primary/10 hover:text-primary hover:border-primary/30 text-muted-foreground font-medium transition-colors text-center"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Hour & Minute Roller Drum Columns */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          {/* Hour Column (ساعت) */}
          <div className="flex flex-col items-center bg-muted/20 border border-border/50 rounded-xl p-1 relative">
            <div className="text-[11px] font-bold text-muted-foreground pb-0.5 select-none">
              ساعت
            </div>

            {/* Stepper Up Button */}
            <button
              type="button"
              onClick={() => handleHourStep(-1)}
              className="w-full h-6 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors active:scale-95"
              title="ساعت قبل"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Scroll Container */}
            <div
              ref={hourListRef}
              onWheel={handleHourWheel}
              onTouchStart={handleHourTouchStart}
              onTouchMove={handleHourTouchMove}
              className="relative w-full h-40 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-contain select-none py-[64px]"
            >
              {/* Highlight Bar */}
              <div className="pointer-events-none absolute inset-x-1 top-1/2 -translate-y-1/2 h-8 rounded-lg bg-primary/15 border border-primary/30 z-0" />

              {/* Fades */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-card/90 via-card/50 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card/90 via-card/50 to-transparent z-10" />

              {HOURS.map((h) => {
                const isSelected = h === currentHour;
                return (
                  <button
                    key={h}
                    type="button"
                    data-active={isSelected}
                    onClick={() => handleHourSelect(h)}
                    className={cn(
                      'relative z-20 w-full h-8 flex items-center justify-center rounded-lg text-xs font-sans transition-all',
                      isSelected
                        ? 'text-primary font-black scale-110'
                        : 'text-muted-foreground/80 hover:text-foreground hover:bg-muted/30 font-medium',
                    )}
                  >
                    {toPersianDigits(h)}
                  </button>
                );
              })}
            </div>

            {/* Stepper Down Button */}
            <button
              type="button"
              onClick={() => handleHourStep(1)}
              className="w-full h-6 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors active:scale-95"
              title="ساعت بعد"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Minute Column (دقیقه) */}
          <div className="flex flex-col items-center bg-muted/20 border border-border/50 rounded-xl p-1 relative">
            <div className="text-[11px] font-bold text-muted-foreground pb-0.5 select-none">
              دقیقه
            </div>

            {/* Stepper Up Button */}
            <button
              type="button"
              onClick={() => handleMinuteStep(-1)}
              className="w-full h-6 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors active:scale-95"
              title="دقیقه قبل"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Scroll Container */}
            <div
              ref={minuteListRef}
              onWheel={handleMinuteWheel}
              onTouchStart={handleMinuteTouchStart}
              onTouchMove={handleMinuteTouchMove}
              className="relative w-full h-40 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overscroll-contain select-none py-[64px]"
            >
              {/* Highlight Bar */}
              <div className="pointer-events-none absolute inset-x-1 top-1/2 -translate-y-1/2 h-8 rounded-lg bg-primary/15 border border-primary/30 z-0" />

              {/* Fades */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-card/90 via-card/50 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card/90 via-card/50 to-transparent z-10" />

              {MINUTES.map((m) => {
                const isSelected = m === currentMinute;
                return (
                  <button
                    key={m}
                    type="button"
                    data-active={isSelected}
                    onClick={() => handleMinuteSelect(m)}
                    className={cn(
                      'relative z-20 w-full h-8 flex items-center justify-center rounded-lg text-xs font-sans transition-all',
                      isSelected
                        ? 'text-primary font-black scale-110'
                        : 'text-muted-foreground/80 hover:text-foreground hover:bg-muted/30 font-medium',
                    )}
                  >
                    {toPersianDigits(m)}
                  </button>
                );
              })}
            </div>

            {/* Stepper Down Button */}
            <button
              type="button"
              onClick={() => handleMinuteStep(1)}
              className="w-full h-6 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors active:scale-95"
              title="دقیقه بعد"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-2.5 mt-2.5 border-t border-border/60">
          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(false)}
            className="w-full h-9 text-xs font-semibold font-sans gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>تایید زمان ({toPersianDigits(`${currentHour}:${currentMinute}`)})</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
