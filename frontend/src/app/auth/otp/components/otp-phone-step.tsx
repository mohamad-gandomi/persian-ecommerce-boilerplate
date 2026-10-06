'use client';

import * as React from 'react';
import { Phone, ArrowLeft, Loader2, ShieldCheck, CheckCircle2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OtpPhoneStepProps {
  phone: string;
  onChangePhone: (phone: string) => void;
  onSubmit: () => void;
  onSwitchToPassword?: () => void;
  isLoading: boolean;
  error: string | null;
}

export function OtpPhoneStep({
  phone,
  onChangePhone,
  onSubmit,
  onSwitchToPassword,
  isLoading,
  error,
}: OtpPhoneStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleQuickDemo = (demoPhone: string) => {
    onChangePhone(demoPhone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-right">
      <div className="space-y-2">
        <label
          htmlFor="phone-input"
          className="text-xs font-semibold text-foreground flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span>شماره تلفن همراه</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-sans">ایران (۹۸+)</span>
        </label>

        <div className="relative">
          <Input
            id="phone-input"
            type="tel"
            autoFocus
            dir="ltr"
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            className="h-12 pr-4 pl-10 text-base font-sans tracking-wide rounded-xl border-border/80 focus-visible:ring-primary text-left"
            disabled={isLoading}
          />
          {phone.trim().length >= 10 && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-600 font-medium animate-in fade-in-50 duration-150">
            {error}
          </p>
        )}

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          یک کد احراز هویت ۵ رقمی از طریق پیامک برای شما ارسال خواهد شد.
        </p>
      </div>

      {/* Quick Demo Pre-fill for Testing */}
      <div className="p-3 rounded-xl bg-muted/50 border border-border/60 text-[11px] text-muted-foreground space-y-1.5">
        <div className="font-semibold text-foreground flex items-center justify-between">
          <span>شماره‌های تستی سریع:</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => handleQuickDemo('09355396804')}
            className="px-2 py-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-sans text-[10px] font-semibold cursor-pointer"
          >
            09355396804 (مدیر سیستم)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('09129876543')}
            className="px-2 py-1 rounded-md bg-card border border-border/70 hover:border-primary hover:text-primary transition-colors font-sans text-[10px] cursor-pointer"
          >
            09129876543 (کاربر ادمین)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('09123456789')}
            className="px-2 py-1 rounded-md bg-card border border-border/70 hover:border-primary hover:text-primary transition-colors font-sans text-[10px] cursor-pointer"
          >
            09123456789 (کاربر تست)
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !phone.trim()}
        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin ml-2" />
            <span>در حال ارسال پیامک...</span>
          </>
        ) : (
          <>
            <span>ارسال کد تأیید ورود</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>

      {/* Switch to Password Login Option */}
      {onSwitchToPassword && (
        <div className="pt-2 text-center border-t border-border/60">
          <button
            type="button"
            onClick={onSwitchToPassword}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer py-1"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>ورود با ایمیل و رمز عبور</span>
          </button>
        </div>
      )}

      {/* Trust & Privacy Notice */}
      <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>ورود ایمن و بدون رمز عبور با پیامک تأیید</span>
      </div>
    </form>
  );
}
