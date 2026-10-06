'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useFeatures } from '@/lib/use-features';
import { OtpHeader } from '@/app/auth/otp/components/otp-header';
import { OtpPhoneStep } from '@/app/auth/otp/components/otp-phone-step';
import { OtpVerifyStep } from '@/app/auth/otp/components/otp-verify-step';
import { PasswordLoginStep } from '@/app/auth/otp/components/password-login-step';

function UnifiedLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const { isEnabled } = useFeatures();
  const isOtpAllowed = isEnabled('notifications');

  const [mode, setMode] = React.useState<'OTP' | 'PASSWORD'>('OTP');
  const [step, setStep] = React.useState<'PHONE' | 'VERIFY'>('PHONE');
  const [phone, setPhone] = React.useState('');
  const [code, setCode] = React.useState<string[]>(['', '', '', '', '']);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [devCode, setDevCode] = React.useState<string | undefined>(undefined);
  const [countdown, setCountdown] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOtpAllowed && mode !== 'PASSWORD') {
      setMode('PASSWORD');
    }
  }, [isOtpAllowed, mode]);

  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async (isResend = false) => {
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('شماره تلفن همراه معتبر ۱۱ رقمی وارد نمایید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    if (isResend) {
      setIsResending(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const res = await api.sendOtp(cleanPhone);
      setDevCode(res.devCode);
      setCountdown(res.expiresIn || 120);
      setCode(['', '', '', '', '']);
      setStep('VERIFY');

      if (isResend) {
        toast.success('کد تأیید جدید از طریق پیامک ارسال شد');
      } else {
        toast.success(`کد تأیید ورود به شماره ${res.phone} ارسال شد`);
      }
    } catch (err: any) {
      const msg = err.message || 'خطا در ارسال پیامک تأیید. لطفاً مجدداً تلاش فرمایید.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const fullCode = code.join('').trim();
    if (fullCode.length !== 5) {
      setError('لطفاً کد ۵ رقمی را به‌طور کامل وارد فرمایید');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.verifyOtp(phone.trim(), fullCode);
      const name = res.user.firstName ? ` ${res.user.firstName}` : '';
      if (res.isNewUser) {
        toast.success(`به فروشگاه خوش آمدید${name}!`);
      } else {
        toast.success(`خوش آمدید${name}!`);
      }

      handleAuthRedirect(res.user);
    } catch (err: any) {
      const msg = err.message || 'کد واردشده نامعتبر یا منقضی شده است';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthRedirect = (user: any) => {
    const redirectParam = searchParams.get('redirect');

    if (user?.role === 'ADMIN') {
      // مدیر سیستم همواره به پنل ادمین ریدایرکت می‌شود
      const target = redirectParam && redirectParam.startsWith('/admin') ? redirectParam : '/admin';
      window.location.href = target;
    } else {
      // کاربران عادی به فروشگاه یا آدرس مقصد غیرادمین هدایت می‌شوند
      const target = redirectParam && !redirectParam.startsWith('/admin') ? redirectParam : '/shop';
      window.location.href = target;
    }
  };

  const handlePasswordSuccess = (user: any) => {
    handleAuthRedirect(user);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-muted/50 via-background to-muted/30 flex flex-col items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-md space-y-6">
        <OtpHeader
          redirectUrl={redirectUrl}
          mode={mode}
          step={step}
          phone={phone}
          isOtpAllowed={isOtpAllowed}
          onBackToPhone={() => {
            setStep('PHONE');
            setError(null);
          }}
        />

        <Card className="border border-border/80 shadow-xl bg-card/95 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {mode === 'PASSWORD' || !isOtpAllowed ? (
              <PasswordLoginStep
                onSuccess={handlePasswordSuccess}
                isOtpAllowed={isOtpAllowed}
                onSwitchToOtp={() => {
                  if (isOtpAllowed) {
                    setMode('OTP');
                    setError(null);
                  }
                }}
              />
            ) : step === 'PHONE' ? (
              <OtpPhoneStep
                phone={phone}
                onChangePhone={(val) => {
                  setPhone(val);
                  if (error) setError(null);
                }}
                onSubmit={() => handleSendOtp(false)}
                onSwitchToPassword={() => {
                  setMode('PASSWORD');
                  setError(null);
                }}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <OtpVerifyStep
                phone={phone}
                code={code}
                onChangeCode={(newCode) => {
                  setCode(newCode);
                  if (error) setError(null);
                }}
                onSubmit={handleVerifyOtp}
                onResend={() => handleSendOtp(true)}
                isLoading={isLoading}
                isResending={isResending}
                countdown={countdown}
                devCode={devCode}
                error={error}
              />
            )}
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground/70 font-sans">
          سامانه مدیریت فروشگاه آنلاین &copy; {new Date().getFullYear()} &middot; امنیت و حریم خصوصی تضمین‌شده
        </p>
      </div>
    </div>
  );
}

export function UnifiedLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <UnifiedLoginContent />
    </React.Suspense>
  );
}
