'use client';

import * as React from 'react';

export interface UseHoldToDeleteOptions {
  holdDurationMs?: number;
  disabled?: boolean;
  isPending?: boolean;
  onTrigger?: () => void;
  onConfirm?: () => void;
}

export function useHoldToDelete({
  holdDurationMs = 1500,
  disabled = false,
  isPending = false,
  onTrigger,
  onConfirm,
}: UseHoldToDeleteOptions) {
  const [progress, setProgress] = React.useState(0);
  const [isHolding, setIsHolding] = React.useState(false);

  const startTimeRef = React.useRef<number | null>(null);
  const animFrameRef = React.useRef<number | null>(null);
  const hasTriggeredRef = React.useRef(false);
  const pointerIdRef = React.useRef<number | null>(null);

  const handleAction = React.useCallback(() => {
    if (onTrigger) {
      onTrigger();
    } else if (onConfirm) {
      onConfirm();
    }
  }, [onTrigger, onConfirm]);

  const cancelHold = React.useCallback(() => {
    if (hasTriggeredRef.current) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    startTimeRef.current = null;
    pointerIdRef.current = null;

    if (isHolding) {
      setIsHolding(false);
      setProgress(0);
    }
  }, [isHolding]);

  const startHold = React.useCallback(() => {
    if (disabled || isPending) return;

    hasTriggeredRef.current = false;
    setIsHolding(true);
    startTimeRef.current = performance.now();

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }

    const step = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = now - startTimeRef.current;
      const cur = Math.min(100, (elapsed / holdDurationMs) * 100);
      setProgress(cur);

      if (cur >= 100) {
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setIsHolding(false);
          setProgress(100);

          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate([40, 30, 40]);
            } catch {}
          }

          handleAction();
        }
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [disabled, isPending, holdDurationMs, handleAction]);

  React.useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (!isPending) {
      setProgress(0);
      setIsHolding(false);
      hasTriggeredRef.current = false;
      startTimeRef.current = null;
    }
  }, [isPending]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (disabled || isPending) return;

    pointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    startHold();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (pointerIdRef.current === e.pointerId) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {}
    }
    cancelHold();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (pointerIdRef.current === e.pointerId) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {}
    }
    cancelHold();
  };

  return {
    progress,
    isHolding,
    startHold,
    cancelHold,
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
  };
}
