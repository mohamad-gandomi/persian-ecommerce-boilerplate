'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface OtpHeaderProps {
  redirectUrl?: string;
  mode?: 'OTP' | 'PASSWORD';
  step?: 'PHONE' | 'VERIFY';
  phone?: string;
  isOtpAllowed?: boolean;
  onBackToPhone?: () => void;
}

export function OtpHeader({
  redirectUrl = '/admin',
  mode = 'OTP',
  step = 'PHONE',
  phone,
  isOtpAllowed = true,
  onBackToPhone,
}: OtpHeaderProps) {
  return (
    <div className="w-full space-y-6">
      {/* Top Navigation Row: Back Link */}
      <div className="flex items-center justify-between">
        {mode === 'OTP' && step === 'VERIFY' ? (
          <button
            type="button"
            onClick={onBackToPhone}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>ویرایش شماره</span>
          </button>
        ) : (
          <Link
            href={redirectUrl}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت</span>
          </Link>
        )}

        <div className="flex items-center gap-1.5 text-[11px] font-sans text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-primary" />
          <span>{!isOtpAllowed || mode === 'PASSWORD' ? 'ورود با ایمیل و رمز عبور' : 'ورود امن پیامکی'}</span>
        </div>
      </div>

      {/* Brand Monogram & Title */}
      <div className="text-center space-y-2">
        <Link href="/admin" className="inline-flex flex-col items-center group">
          <span className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            سامانه مدیریت
          </span>
          <span className="text-[11px] tracking-wider text-muted-foreground font-medium">
            ورود به پیشخوان فروشگاه آنلاین
          </span>
        </Link>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
          {!isOtpAllowed || mode === 'PASSWORD'
            ? 'جهت دسترسی به حساب کاربری، آدرس ایمیل و کلمه عبور خود را وارد نمایید.'
            : step === 'PHONE'
            ? 'ورود یا عضویت سریع و بدون نیاز به کلمه عبور با شماره تلفن همراه.'
            : `کد تأیید ۵ رقمی پیامک‌شده به شماره ${phone || 'همراه شما'} را وارد نمایید.`}
        </p>
      </div>
    </div>
  );
}
