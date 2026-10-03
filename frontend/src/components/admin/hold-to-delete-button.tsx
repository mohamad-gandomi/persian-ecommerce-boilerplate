'use client';

import * as React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHoldToDelete, type UseHoldToDeleteOptions } from './use-hold-to-delete';

export interface HoldToDeleteButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    UseHoldToDeleteOptions {
  label?: string;
  holdingLabel?: string;
  pendingLabel?: string;
  size?: 'sm' | 'default' | 'lg';
  showPercentage?: boolean;
}

export function HoldToDeleteButton({
  onTrigger,
  onConfirm,
  holdDurationMs = 1500,
  isPending = false,
  disabled = false,
  label = 'حذف',
  holdingLabel = 'نگه دارید...',
  pendingLabel = 'در حال حذف...',
  size = 'default',
  showPercentage = true,
  className,
  ...props
}: HoldToDeleteButtonProps) {
  const {
    progress,
    isHolding,
    startHold,
    cancelHold,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  } = useHoldToDelete({
    holdDurationMs,
    disabled,
    isPending,
    onTrigger,
    onConfirm,
  });

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    default: 'h-9 px-4 text-xs sm:text-sm gap-2',
    lg: 'h-10 px-5 text-sm gap-2.5',
  }[size];

  return (
    <button
      type="button"
      disabled={disabled || isPending}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
          e.preventDefault();
          startHold();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          cancelHold();
        }
      }}
      aria-busy={isPending}
      aria-label={`${label}. برای تایید، کلید را به مدت ${holdDurationMs / 1000} ثانیه نگه دارید.`}
      style={{
        touchAction: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      className={cn(
        'relative overflow-hidden group select-none transition-all duration-150 inline-flex items-center justify-center font-medium rounded-lg border touch-none',
        'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/15 dark:bg-destructive/20 dark:hover:bg-destructive/25',
        isHolding && 'scale-[0.98] border-destructive shadow-md ring-2 ring-destructive/30 bg-destructive/20 text-white',
        (disabled || isPending) && 'opacity-60 cursor-not-allowed pointer-events-none',
        sizeClasses,
        className
      )}
      {...props}
    >
      {/* Animated Fill Progress Bar */}
      <div
        className={cn(
          'absolute inset-y-0 start-0 bg-destructive pointer-events-none transition-all',
          isHolding ? 'duration-0 ease-linear' : 'duration-200 ease-out'
        )}
        style={{ width: `${progress}%` }}
      />

      {/* Glowing Edge Line on Progress Front */}
      {isHolding && progress > 0 && progress < 100 && (
        <div
          className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.9)] pointer-events-none transition-none"
          style={{ insetInlineStart: `calc(${progress}% - 2px)` }}
        />
      )}

      {/* Dynamic Foreground Content */}
      <span
        className={cn(
          'relative z-10 flex items-center justify-center gap-1.5 transition-colors duration-150 w-full font-sans',
          (isHolding || progress > 25) && 'text-white font-semibold drop-shadow-xs'
        )}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isHolding ? (
          <Trash2 className="w-3.5 h-3.5 animate-pulse text-white shrink-0" />
        ) : (
          <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110 shrink-0" />
        )}

        <span className="truncate">
          {isPending ? pendingLabel : isHolding ? holdingLabel : label}
        </span>

        {/* Progress Indicator pill */}
        {isHolding && showPercentage && (
          <span className="ms-1 text-[10px] font-sans font-bold tracking-tight px-1.5 py-0.2 rounded bg-black/40 text-white backdrop-blur-xs shrink-0">
            {Math.round(progress)}%
          </span>
        )}

        {/* Subtle (Hold) cue when idle */}
        {!isHolding && !isPending && (
          <span className="text-[10px] font-sans opacity-60 ms-0.5 uppercase tracking-wider font-semibold shrink-0">
            (نگه‌داشتن)
          </span>
        )}
      </span>
    </button>
  );
}
