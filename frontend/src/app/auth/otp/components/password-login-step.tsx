'use client';

import * as React from 'react';
import { User, Lock, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

interface PasswordLoginStepProps {
  onSuccess: (user: any) => void;
  onSwitchToOtp: () => void;
}

export function PasswordLoginStep({ onSuccess, onSwitchToOtp }: PasswordLoginStepProps) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    if (!cleanUser || !password) {
      setError('لطفاً نام کاربری/ایمیل و رمز عبور را وارد فرمایید');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.login(cleanUser, password);
      onSuccess(res.user);
    } catch (err: any) {
      const msg = err.message || 'نام کاربری یا رمز عبور نامعتبر است';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (userVal: string, passVal: string) => {
    setUsername(userVal);
    setPassword(passVal);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right font-sans">
      {/* Username / Email field */}
      <div className="space-y-1.5">
        <label
          htmlFor="username-input"
          className="text-xs font-semibold text-foreground flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>نام کاربری، ایمیل یا شماره موبایل</span>
          </span>
        </label>
        <Input
          id="username-input"
          type="text"
          autoFocus
          dir="ltr"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (error) setError(null);
          }}
          placeholder="admin@store.local یا ۰۹۳۵۵۳۹۶۸۰۴"
          className="h-11 px-3 text-sm font-sans tracking-wide rounded-xl border-border/80 focus-visible:ring-primary text-left"
          disabled={isLoading}
        />
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <label
          htmlFor="password-input"
          className="text-xs font-semibold text-foreground flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>کلمه عبور</span>
          </span>
        </label>
        <div className="relative">
          <Input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            dir="ltr"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="••••••••"
            className="h-11 pr-3 pl-10 text-sm font-sans tracking-wider rounded-xl border-border/80 focus-visible:ring-primary text-left"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            title={showPassword ? 'مخفی‌سازی رمز عبور' : 'نمایش رمز عبور'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 font-medium animate-in fade-in-50 duration-150 pt-1">
          {error}
        </p>
      )}

      {/* Quick Demo Pre-fill for Testing */}
      <div className="p-3 rounded-xl bg-muted/50 border border-border/60 text-[11px] text-muted-foreground space-y-1.5">
        <div className="font-semibold text-foreground flex items-center justify-between">
          <span>ورود سریع آزمایشی:</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => handleQuickDemo('admin@store.local', 'Admin@123456')}
            className="px-2 py-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-sans text-[10px] font-semibold cursor-pointer"
          >
            admin@store.local (مدیر سیستم)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('09355396804', 'Admin@123456')}
            className="px-2 py-1 rounded-md bg-card border border-border/70 hover:border-primary hover:text-primary transition-colors font-sans text-[10px] cursor-pointer"
          >
            09355396804 (موبایل مدیر)
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !username.trim() || !password}
        className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin ml-2" />
            <span>در حال اعتبارسنجی و ورود...</span>
          </>
        ) : (
          <>
            <span>ورود به حساب کاربری</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>

      {/* Switch to OTP Login Option */}
      <div className="pt-2 text-center border-t border-border/60">
        <button
          type="button"
          onClick={onSwitchToOtp}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer py-1"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>ورود با شماره همراه و کد پیامکی (OTP)</span>
        </button>
      </div>

      {/* Trust & Privacy Notice */}
      <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>ارتباط امن رمزنگاری‌شده با توکن استاندارد JWT</span>
      </div>
    </form>
  );
}
