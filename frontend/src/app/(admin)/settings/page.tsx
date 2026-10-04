'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Settings,
  Store,
  Gift,
  ImageIcon,
  Save,
  Sparkles,
  Percent,
  Coins,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { api, MediaSettings } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReferralSettings } from '@/types';
import { useFeatures } from '@/lib/use-features';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { isEnabled } = useFeatures();
  const [activeTab, setActiveTab] = React.useState('store');

  React.useEffect(() => {
    if (!isEnabled('referral') && activeTab === 'referral') {
      setActiveTab('store');
    }
  }, [isEnabled, activeTab]);

  // ----------------------------------------------------
  // 1. Store General Settings
  // ----------------------------------------------------
  const [storeSettings, setStoreSettings] = React.useState({
    name: 'فروشگاه اینترنتی چوب و مبلمان',
    email: 'support@store.local',
    phone: '۰۲۱-۸۸۹۹۰۰۱۱',
    address: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی',
    currency: 'IRT',
  });

  const { data: remoteStoreSettings } = useQuery({
    queryKey: ['system-setting', 'store'],
    queryFn: () => api.getSetting('store'),
  });

  React.useEffect(() => {
    if (remoteStoreSettings) {
      setStoreSettings((prev) => ({ ...prev, ...remoteStoreSettings }));
    }
  }, [remoteStoreSettings]);

  const updateStoreMutation = useMutation({
    mutationFn: (data: any) => api.updateSetting('store', data),
    onSuccess: () => {
      toast.success('تنظیمات عمومی فروشگاه ذخیره شد');
      queryClient.invalidateQueries({ queryKey: ['system-setting', 'store'] });
    },
    onError: (err: any) => toast.error(err.message || 'خطا در ذخیره تنظیمات فروشگاه'),
  });

  // ----------------------------------------------------
  // 2. Referral & Rewards Settings
  // ----------------------------------------------------
  const [referralSettings, setReferralSettings] = React.useState<ReferralSettings>({
    enabled: true,
    enableGlobalReward: true,
    defaultRewardType: 'PERCENTAGE',
    defaultReferrerValue: 5,
    defaultRefereeValue: 20000,
    minOrderAmount: 100000,
    releaseOnStatus: 'DELIVERED',
    cookieDays: 30,
  });

  const { data: remoteReferralSettings } = useQuery({
    queryKey: ['admin-referral-settings'],
    queryFn: () => api.getAdminReferralSettings(),
    enabled: isEnabled('referral'),
  });

  React.useEffect(() => {
    if (remoteReferralSettings) {
      setReferralSettings({
        ...remoteReferralSettings,
        enableGlobalReward: remoteReferralSettings.enableGlobalReward ?? true,
      });
    }
  }, [remoteReferralSettings]);

  const updateReferralMutation = useMutation({
    mutationFn: (data: ReferralSettings) => api.updateAdminReferralSettings(data),
    onSuccess: () => {
      toast.success('تنظیمات پاداش و معرف با موفقیت ذخیره شد');
      queryClient.invalidateQueries({ queryKey: ['admin-referral-settings'] });
    },
    onError: (err: any) => toast.error(err.message || 'خطا در ذخیره تنظیمات معرف'),
  });

  // ----------------------------------------------------
  // 3. Media & WebP Settings
  // ----------------------------------------------------
  const [mediaSettingsState, setMediaSettingsState] = React.useState<MediaSettings>({
    convertToWebp: true,
    qualityPreset: 80,
    maxWidthOption: 2048,
    showOptimizationOptions: false,
  });

  const { data: remoteMediaSettings } = useQuery<MediaSettings>({
    queryKey: ['system-setting', 'media'],
    queryFn: () => api.getSetting<MediaSettings>('media'),
  });

  React.useEffect(() => {
    if (remoteMediaSettings) {
      setMediaSettingsState((prev) => ({ ...prev, ...remoteMediaSettings }));
    }
  }, [remoteMediaSettings]);

  const updateMediaMutation = useMutation({
    mutationFn: (data: Partial<MediaSettings>) => api.updateSetting<MediaSettings>('media', data),
    onSuccess: (updated) => {
      toast.success('تنظیمات بهینه‌سازی رسانه و WebP ذخیره شد');
      queryClient.setQueryData(['system-setting', 'media'], updated);
      queryClient.invalidateQueries({ queryKey: ['system-setting', 'media'] });
    },
    onError: (err: any) => toast.error(err.message || 'خطا در ذخیره تنظیمات رسانه'),
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
      <Header title="تنظیمات سامانه" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Top Banner */}
        <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card to-primary/5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <span>مرکز پیکربندی و تنظیمات کل فروشگاه</span>
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              مدیریت یکپارچه مشخصات فروشگاه، قوانین و استراتژی‌های سیستم پاداش و معرف، و تنظیمات پردازش و فشرده‌سازی خودکار تصاویر.
            </p>
          </div>
          <Badge variant="secondary" className="self-start sm:self-auto text-xs px-3 py-1 font-sans">
            نسخه بویلرپلیت ۱.۰
          </Badge>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
          <div className="w-full overflow-x-auto pb-1" dir="rtl">
            <TabsList className="inline-flex sm:flex w-max sm:w-full items-center justify-start gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-muted/80 rounded-xl border border-border" dir="rtl">
              <TabsTrigger value="store" className="gap-2 py-2 px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
                <Store className="w-4 h-4 shrink-0 text-primary" />
                <span>مشخصات فروشگاه</span>
              </TabsTrigger>
              {isEnabled('referral') && (
                <TabsTrigger value="referral" className="gap-2 py-2 px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
                  <Gift className="w-4 h-4 shrink-0 text-purple-600" />
                  <span>سیستم معرف و پاداش</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="media" className="gap-2 py-2 px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
                <ImageIcon className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>بهینه‌سازی تصاویر و WebP</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Store General Settings */}
          <TabsContent value="store" className="space-y-6 m-0">
            <Card className="border-border/80 shadow-2xs font-sans">
              <CardHeader className="text-right">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Store className="w-4 h-4 text-primary" />
                  <span>اطلاعات پایه و هویت فروشگاه</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  نام و اطلاعات تماسی که در فاکتورها، هدر ایمیل‌ها و صفحات عمومی نمایش داده می‌شود.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-semibold text-foreground">نام رسمی فروشگاه</label>
                    <Input
                      value={storeSettings.name}
                      onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                      className="font-sans text-xs"
                      placeholder="مثلاً: فروشگاه آنلاین چوب و دکوراسیون"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-semibold text-foreground">شماره تماس پشتیبانی</label>
                    <Input
                      value={storeSettings.phone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                      className="font-sans text-xs dir-ltr text-right"
                      placeholder="۰۲۱-۸۸۹۹۰۰۱۱"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-semibold text-foreground">ایمیل رسمی سامانه</label>
                    <Input
                      type="email"
                      value={storeSettings.email}
                      onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                      className="font-sans text-xs dir-ltr text-right"
                      placeholder="info@yourshop.com"
                    />
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-semibold text-foreground">واحد پول سامانه</label>
                    <Input
                      disabled
                      value="تومان (IRT) - رسمی ایران"
                      className="font-sans text-xs bg-muted/50 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5 text-right sm:col-span-2">
                    <label className="text-xs font-semibold text-foreground">آدرس دفتر مرکزی و مرجوعی کالا</label>
                    <Input
                      value={storeSettings.address}
                      onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                      className="font-sans text-xs"
                      placeholder="نشانی پستی فروشگاه جهت درج در فاکتور سفارشات"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-3 border-t border-border/60">
                <Button
                  onClick={() => updateStoreMutation.mutate(storeSettings)}
                  disabled={updateStoreMutation.isPending}
                  className="font-semibold text-xs h-9 gap-1.5 font-sans"
                >
                  <Save className="w-4 h-4" />
                  <span>{updateStoreMutation.isPending ? 'در حال ذخیره‌سازی...' : 'ذخیره تنظیمات فروشگاه'}</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* TAB 2: Referral & Rewards Settings */}
          {isEnabled('referral') && (
            <TabsContent value="referral" className="space-y-6 m-0">
              <Card className="border-border/80 shadow-2xs font-sans">
              <CardHeader className="text-right">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <Gift className="w-4 h-4" />
                  <span>پیکربندی ماژول معرف، رفرال و پاداش وفاداری</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  تعیین قوانین کلی، نرخ پاداش معرف و خریدار جدید، کف مبلغ سفارش و انتخاب استراتژی پاداش سراسری یا تکی.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 1. Main Enable Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/40">
                  <div className="space-y-0.5 text-right">
                    <span className="text-xs font-bold text-foreground block">فعال‌سازی ماژول رفرال و پاداش</span>
                    <span className="text-[11px] text-muted-foreground block">
                      در صورت غیرفعال بودن، هیچ پاداش جدیدی ثبت نشده و کدهای معرف معلق می‌شوند.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={referralSettings.enabled}
                      onChange={(e) => setReferralSettings({ ...referralSettings, enabled: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* 2. Reward Mode Strategy Selection (Global vs Per-Product Only) */}
                <div className="space-y-3 p-4 rounded-xl border border-purple-200 dark:border-purple-950/60 bg-purple-50/30 dark:bg-purple-950/10">
                  <div className="space-y-0.5 text-right">
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>استراتژی و نحوه تخصیص پاداش (Reward Strategy Mode)</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      می‌توانید مشخص کنید که آیا پاداش به همه کالاها تعلق گیرد یا صرفاً به کالاهایی که خودتان مشخص کرده‌اید:
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Strategy A: Hybrid (Global Default + Product Override) */}
                    <div
                      onClick={() => setReferralSettings({ ...referralSettings, enableGlobalReward: true })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 text-right ${
                        referralSettings.enableGlobalReward !== false
                          ? 'border-purple-500 bg-card shadow-xs ring-1 ring-purple-500/30'
                          : 'border-border/70 bg-card/60 hover:bg-card opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">حالت سراسری + اختصاصی (پیش‌فرض)</span>
                        <input
                          type="radio"
                          name="rewardScope"
                          checked={referralSettings.enableGlobalReward !== false}
                          onChange={() => setReferralSettings({ ...referralSettings, enableGlobalReward: true })}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        تمامی محصولات فروشگاه به طور خودکار مشمول پاداش پیش‌فرض می‌شوند؛ مگر اینکه برای یک محصول در صفحه ویرایش آن پاداش اختصاصی تعیین یا آن را غیرفعال کرده باشید.
                      </p>
                    </div>

                    {/* Strategy B: Per-Product Only (No Global Default) */}
                    <div
                      onClick={() => setReferralSettings({ ...referralSettings, enableGlobalReward: false })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 text-right ${
                        referralSettings.enableGlobalReward === false
                          ? 'border-purple-500 bg-card shadow-xs ring-1 ring-purple-500/30'
                          : 'border-border/70 bg-card/60 hover:bg-card opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">حالت فقط اختصاصی (محصول‌محور)</span>
                        <input
                          type="radio"
                          name="rewardScope"
                          checked={referralSettings.enableGlobalReward === false}
                          onChange={() => setReferralSettings({ ...referralSettings, enableGlobalReward: false })}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        هیچ پاداش پیش‌فرضی به کالاهای فروشگاه داده نمی‌شود! پاداش <strong className="text-purple-700 dark:text-purple-300">تنها و منحصراً</strong> به محصولاتی تعلق می‌گیرد که ادمین در صفحه همان محصول برای آن پاداش درصدی یا ثابت تعریف کرده باشد.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Global Default Rates (Only active when enableGlobalReward is true) */}
                {referralSettings.enableGlobalReward !== false && (
                  <div className="space-y-4 pt-1 border-t border-border/60">
                    <h4 className="text-xs font-bold text-foreground text-right">مقادیر پاداش پیش‌فرض سراسری</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5 text-right">
                        <label className="text-xs font-semibold text-foreground">نوع محاسبه پاداش پیش‌فرض</label>
                        <select
                          value={referralSettings.defaultRewardType}
                          onChange={(e) => setReferralSettings({ ...referralSettings, defaultRewardType: e.target.value as any })}
                          className="w-full text-xs h-9 rounded-md border border-input bg-background px-3 py-1 font-sans focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="PERCENTAGE">درصدی از مبلغ سفارش (%)</option>
                          <option value="FIXED">مبلغ ثابت به ازای هر سفارش (تومان)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-right">
                        <label className="text-xs font-semibold text-foreground">
                          پاداش پیش‌فرض معرف {referralSettings.defaultRewardType === 'PERCENTAGE' ? '(درصد ٪)' : '(تومان)'}
                        </label>
                        <Input
                          type="number"
                          step={referralSettings.defaultRewardType === 'PERCENTAGE' ? '0.1' : '1000'}
                          value={referralSettings.defaultReferrerValue}
                          onChange={(e) => setReferralSettings({ ...referralSettings, defaultReferrerValue: parseFloat(e.target.value) || 0 })}
                          className="font-sans text-xs dir-ltr text-right"
                        />
                      </div>

                      <div className="space-y-1.5 text-right">
                        <label className="text-xs font-semibold text-foreground">
                          پاداش پیش‌فرض خریدار جدید {referralSettings.defaultRewardType === 'PERCENTAGE' ? '(درصد ٪)' : '(تومان)'}
                        </label>
                        <Input
                          type="number"
                          step={referralSettings.defaultRewardType === 'PERCENTAGE' ? '0.1' : '1000'}
                          value={referralSettings.defaultRefereeValue}
                          onChange={(e) => setReferralSettings({ ...referralSettings, defaultRefereeValue: parseFloat(e.target.value) || 0 })}
                          className="font-sans text-xs dir-ltr text-right"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Common Eligibility Rules */}
                <div className="space-y-4 pt-1 border-t border-border/60">
                  <h4 className="text-xs font-bold text-foreground text-right">شروط و مکانیزم امنیتی ضد کلاهبرداری</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 text-right">
                      <label className="text-xs font-semibold text-foreground">کف حداقل مبلغ سفارش (تومان)</label>
                      <Input
                        type="number"
                        step="10000"
                        value={referralSettings.minOrderAmount}
                        onChange={(e) => setReferralSettings({ ...referralSettings, minOrderAmount: parseInt(e.target.value, 10) || 0 })}
                        className="font-sans text-xs dir-ltr text-right"
                      />
                      <span className="text-[10px] text-muted-foreground">سفارش‌های زیر این مبلغ مشمول پاداش نمی‌شوند.</span>
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="text-xs font-semibold text-foreground">وضعیت سفارش برای آزادسازی پاداش</label>
                      <Input
                        disabled
                        value="تحویل نهایی کالا (DELIVERED)"
                        className="font-sans text-xs bg-muted/50 cursor-not-allowed"
                      />
                      <span className="text-[10px] text-muted-foreground">جهت جلوگیری از لغو سفارش پس از دریافت پاداش.</span>
                    </div>

                    <div className="space-y-1.5 text-right">
                      <label className="text-xs font-semibold text-foreground">مدت اعتبار کوکی انتساب (روز)</label>
                      <Input
                        type="number"
                        min="1"
                        max="365"
                        value={referralSettings.cookieDays}
                        onChange={(e) => setReferralSettings({ ...referralSettings, cookieDays: parseInt(e.target.value, 10) || 30 })}
                        className="font-sans text-xs dir-ltr text-right"
                      />
                      <span className="text-[10px] text-muted-foreground">مدت زمانی که کلیک کاربر روی لینک معرف معتبر است.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-3 border-t border-border/60">
                <Button
                  onClick={() => updateReferralMutation.mutate(referralSettings)}
                  disabled={updateReferralMutation.isPending}
                  className="font-semibold text-xs h-9 gap-1.5 font-sans"
                >
                  <Save className="w-4 h-4" />
                  <span>{updateReferralMutation.isPending ? 'در حال ذخیره‌سازی...' : 'ذخیره تنظیمات پاداش و معرف'}</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          )}

          {/* TAB 3: Media & WebP Settings */}
          <TabsContent value="media" className="space-y-6 m-0">
            <Card className="border-border/80 shadow-2xs font-sans">
              <CardHeader className="text-right">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>تنظیمات پردازش رسانه و فشرده‌سازی WebP</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  تنظیم تبدیل خودکار فرمت تصاویر بارگذاری‌شده (مانند PNG و JPEG) به فرمت بهینه نسل جدید WebP جهت افزایش چشمگیر سرعت بارگذاری صفحات.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 1. WebP Conversion Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/40">
                  <div className="space-y-0.5 text-right">
                    <span className="text-xs font-bold text-foreground block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تبدیل خودکار به قالب بهینه WebP (پیشنهادی)</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      کاهش ۷۰ تا ۸۵ درصدی حجم تصاویر بدون افت محسوس کیفیت، بهینه‌شده برای موتور جستجو و استانداردهای Core Web Vitals.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={mediaSettingsState.convertToWebp}
                      onChange={(e) => setMediaSettingsState({ ...mediaSettingsState, convertToWebp: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* 2. Quality and Width presets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Compression Quality */}
                  <div className="p-4 rounded-xl border border-border/70 bg-card space-y-3 text-right">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">کیفیت فشرده‌سازی WebP</span>
                      <span className="text-xs font-bold text-emerald-600 font-sans">{mediaSettingsState.qualityPreset}٪</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'فشرده (۷۰٪)', val: 70 },
                        { label: 'متعادل (۸۰٪)', val: 80 },
                        { label: 'کیفیت بالا (۹۰٪)', val: 90 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setMediaSettingsState({ ...mediaSettingsState, qualityPreset: preset.val })}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all font-sans ${
                            mediaSettingsState.qualityPreset === preset.val
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border/70'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      گزینه ۸۰٪ بهترین تعادل را بین کمترین حجم فایل و بیشترین وضوح در نمایشگرهای رتینا ارائه می‌دهد.
                    </p>
                  </div>

                  {/* Max Width Resize Option */}
                  <div className="p-4 rounded-xl border border-border/70 bg-card space-y-3 text-right">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">حداکثر ابعاد تغییر اندازه خودکار</span>
                      <span className="text-xs font-bold text-primary font-sans">{mediaSettingsState.maxWidthOption}px</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: '1200px', val: 1200 },
                        { label: '1600px', val: 1600 },
                        { label: '2048px', val: 2048 },
                        { label: '2560px', val: 2560 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setMediaSettingsState({ ...mediaSettingsState, maxWidthOption: preset.val })}
                          className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all font-sans ${
                            mediaSettingsState.maxWidthOption === preset.val
                              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                              : 'bg-muted/40 hover:bg-muted text-muted-foreground border-border/70'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      تصاویری با عرض بیشتر از این مقدار به طور هوشمند مقیاس‌دهی می‌شوند تا از اشغال بی‌مورد فضای سرور جلوگیری شود.
                    </p>
                  </div>
                </div>

                {/* Informational callout */}
                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/30 dark:bg-emerald-950/10 flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed text-right">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    هنگامی که این گزینه فعال باشد، در حین بارگذاری تصاویر در کتابخانه رسانه، فرمت فایل بلافاصله با موتور پردازش تصویری Sharp به WebP تبدیل می‌شود و متاداده‌های حجیم دوربین (EXIF) حذف می‌گردند.
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-3 border-t border-border/60">
                <Button
                  onClick={() => updateMediaMutation.mutate(mediaSettingsState)}
                  disabled={updateMediaMutation.isPending}
                  className="font-semibold text-xs h-9 gap-1.5 font-sans"
                >
                  <Save className="w-4 h-4" />
                  <span>{updateMediaMutation.isPending ? 'در حال ذخیره‌سازی...' : 'ذخیره تنظیمات بهینه‌سازی رسانه'}</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
