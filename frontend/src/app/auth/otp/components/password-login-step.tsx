'use client';

import * as React from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Smartphone,
  UserPlus,
  KeyRound,
  User,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { toast } from 'sonner';

type SubView = 'LOGIN' | 'REGISTER' | 'FORGOT' | 'RESET';

interface PasswordLoginStepProps {
  onSuccess: (user: any) => void;
  onSwitchToOtp?: () => void;
  isOtpAllowed?: boolean;
}

export function PasswordLoginStep({
  onSuccess,
  onSwitchToOtp,
  isOtpAllowed = true,
}: PasswordLoginStepProps) {
  const [view, setView] = React.useState<SubView>('LOGIN');

  // Login form state
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // Register form state
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [regEmail, setRegEmail] = React.useState('');
  const [regPassword, setRegPassword] = React.useState('');

  // Forgot / Reset form state
  const [forgotEmail, setForgotEmail] = React.useState('');
  const [resetToken, setResetToken] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = React.useState<string | null>(null);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setError('لطفاً آدرس ایمیل و کلمه عبور را وارد فرمایید');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.login(cleanEmail, password);
      toast.success('با موفقیت وارد شدید!');
      onSuccess(res.user);
    } catch (err: any) {
      const msg = err.message || 'آدرس ایمیل یا کلمه عبور واردشده معتبر نمی‌باشد';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !regEmail.trim() || !regPassword) {
      setError('لطفاً تمامی فیلدهای الزامی را پر نمایید');
      return;
    }

    if (regPassword.length < 6) {
      setError('کلمه عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
      });
      toast.success('ثبت‌نام با موفقیت انجام شد و وارد شدید!');
      onSuccess(res.user);
    } catch (err: any) {
      const msg = err.message || 'خطا در ثبت‌نام حساب کاربری';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = forgotEmail.trim().toLowerCase();
    if (!clean) {
      setError('لطفاً آدرس ایمیل را وارد فرمایید');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.forgotPassword(clean);
      setForgotSuccessMsg(res.message || 'دستورالعمل بازیابی با موفقیت ثبت شد.');
      toast.success(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err: any) {
      const msg = err.message || 'خطا در ارسال درخواست بازنشانی رمز عبور';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim() || !newPassword) {
      setError('لطفاً توکن بازنشانی و رمز عبور جدید را وارد فرمایید');
      return;
    }

    if (newPassword.length < 6) {
      setError('کلمه عبور جدید باید حداقل ۶ کاراکتر باشد');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.resetPassword(resetToken.trim(), newPassword);
      toast.success(res.message || 'رمز عبور با موفقیت به‌روزرسانی شد');
      setView('LOGIN');
      setPassword(newPassword);
      setEmail(forgotEmail);
    } catch (err: any) {
      const msg = err.message || 'خطا در بازنشانی رمز عبور';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (userVal: string, passVal: string) => {
    setEmail(userVal);
    setPassword(passVal);
    setError(null);
  };

  // ----------------------------------------------------
  // VIEW: REGISTER
  // ----------------------------------------------------
  if (view === 'REGISTER') {
    return (
      <form onSubmit={handleRegisterSubmit} className="space-y-4 text-right font-sans">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-primary" />
            <span>ایجاد حساب کاربری جدید</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setView('LOGIN');
              setError(null);
            }}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            قبلاً ثبت‌نام کرده‌اید؟ ورود
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">نام</label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="علی"
              className="h-10 text-xs font-sans rounded-xl border-border/80"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">نام خانوادگی</label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="رضایی"
              className="h-10 text-xs font-sans rounded-xl border-border/80"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" />
            <span>آدرس ایمیل</span>
          </label>
          <Input
            type="email"
            dir="ltr"
            value={regEmail}
            onChange={(e) => {
              setRegEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="example@mail.com"
            className="h-10 text-xs font-sans rounded-xl border-border/80 text-left"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>کلمه عبور (حداقل ۶ کاراکتر)</span>
          </label>
          <Input
            type="password"
            dir="ltr"
            value={regPassword}
            onChange={(e) => {
              setRegPassword(e.target.value);
              if (error) setError(null);
            }}
            placeholder="••••••••"
            className="h-10 text-xs font-sans rounded-xl border-border/80 text-left tracking-wider"
            required
          />
        </div>

        {error && <p className="text-xs text-red-600 font-medium pt-1">{error}</p>}

        <Button
          type="submit"
          disabled={isLoading || !firstName.trim() || !regEmail.trim() || !regPassword}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
              <span>در حال ایجاد حساب...</span>
            </>
          ) : (
            <>
              <span>تکمیل ثبت‌نام و ورود</span>
              <ArrowLeft className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    );
  }

  // ----------------------------------------------------
  // VIEW: FORGOT PASSWORD
  // ----------------------------------------------------
  if (view === 'FORGOT') {
    return (
      <form onSubmit={handleForgotSubmit} className="space-y-4 text-right font-sans">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>بازیابی و فراموشی رمز عبور</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setView('LOGIN');
              setError(null);
              setForgotSuccessMsg(null);
            }}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            بازگشت به ورود
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          آدرس ایمیل حسابی را که هنگام ثبت سفارش یا عضویت وارد کرده‌اید بنویسید تا لینک بازنشانی برای شما صادر شود.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" />
            <span>آدرس ایمیل ثبت‌شده</span>
          </label>
          <Input
            type="email"
            dir="ltr"
            autoFocus
            value={forgotEmail}
            onChange={(e) => {
              setForgotEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="example@mail.com"
            className="h-11 px-3 text-sm font-sans rounded-xl border-border/80 text-left"
            required
          />
        </div>

        {error && <p className="text-xs text-red-600 font-medium pt-1">{error}</p>}

        {forgotSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{forgotSuccessMsg}</span>
            </div>
            {resetToken && (
              <div className="pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setView('RESET')}
                  className="w-full text-xs font-sans h-8"
                >
                  انتقال به مرحله تنظیم رمز جدید
                </Button>
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !forgotEmail.trim()}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
              <span>در حال ارسال درخواست...</span>
            </>
          ) : (
            <span>دریافت لینک بازنشانی رمز</span>
          )}
        </Button>
      </form>
    );
  }

  // ----------------------------------------------------
  // VIEW: RESET PASSWORD (WITH TOKEN)
  // ----------------------------------------------------
  if (view === 'RESET') {
    return (
      <form onSubmit={handleResetSubmit} className="space-y-4 text-right font-sans">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-primary" />
            <span>تنظیم کلمه عبور جدید</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setView('LOGIN');
              setError(null);
            }}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            لغو و بازگشت
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">کد یا توکن بازنشانی</label>
          <Input
            type="text"
            dir="ltr"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            placeholder="توکن امنیتی..."
            className="h-10 text-xs font-mono rounded-xl border-border/80 text-left"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">کلمه عبور جدید (حداقل ۶ کاراکتر)</label>
          <Input
            type="password"
            dir="ltr"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="h-10 text-xs font-sans rounded-xl border-border/80 text-left tracking-wider"
            required
          />
        </div>

        {error && <p className="text-xs text-red-600 font-medium pt-1">{error}</p>}

        <Button
          type="submit"
          disabled={isLoading || !resetToken.trim() || !newPassword}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
              <span>در حال ثبت رمز جدید...</span>
            </>
          ) : (
            <span>ذخیره کلمه عبور جدید</span>
          )}
        </Button>
      </form>
    );
  }

  // ----------------------------------------------------
  // VIEW: LOGIN (DEFAULT)
  // ----------------------------------------------------
  return (
    <form onSubmit={handleLoginSubmit} className="space-y-4 text-right font-sans">
      {/* Email / Username field */}
      <div className="space-y-1.5">
        <label
          htmlFor="email-input"
          className="text-xs font-semibold text-foreground flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" />
            <span>آدرس ایمیل</span>
          </span>
        </label>
        <Input
          id="email-input"
          type="email"
          autoFocus
          dir="ltr"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="admin@store.local یا user@example.com"
          className="h-11 px-3 text-sm font-sans tracking-wide rounded-xl border-border/80 focus-visible:ring-primary text-left"
          disabled={isLoading}
        />
      </div>

      {/* Password field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password-input"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>کلمه عبور</span>
          </label>
          <button
            type="button"
            onClick={() => {
              setView('FORGOT');
              setForgotEmail(email);
              setError(null);
            }}
            className="text-[11px] text-primary hover:underline cursor-pointer"
          >
            فراموشی رمز عبور؟
          </button>
        </div>
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
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !email.trim() || !password}
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

      {/* Register Option (when user has no account) */}
      <div className="pt-2 flex items-center justify-between text-xs border-t border-border/60">
        <span className="text-muted-foreground">حساب کاربری ندارید؟</span>
        <button
          type="button"
          onClick={() => {
            setView('REGISTER');
            setError(null);
          }}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          ثبت‌نام حساب جدید
        </button>
      </div>

      {/* Switch to OTP Login Option (only if OTP is allowed) */}
      {isOtpAllowed && onSwitchToOtp && (
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
      )}

      {/* Trust & Privacy Notice */}
      <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
        <span>ارتباط امن رمزنگاری‌شده با توکن استاندارد JWT</span>
      </div>
    </form>
  );
}
