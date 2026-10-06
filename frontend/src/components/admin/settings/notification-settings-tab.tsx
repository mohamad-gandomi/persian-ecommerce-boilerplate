'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Bell,
  MessageSquare,
  Send,
  Save,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Server,
  Layers,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Sparkles,
  Zap,
  AlignLeft,
  ShoppingCart,
  Wallet,
  AlertTriangle,
  FileText,
  Copy,
  Plus,
  User,
  Shield,
  Search,
} from 'lucide-react';
import {
  api,
  NotificationSettings,
  NotificationEventConfig,
  EVENT_PLACEHOLDERS,
  EventPlaceholder,
} from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type EventCategory = 'all' | 'orders' | 'wallet' | 'inventory' | 'blog';

export function NotificationSettingsTab() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = React.useState<EventCategory>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedEvents, setExpandedEvents] = React.useState<Record<string, boolean>>({
    order_created: true,
  });
  const [testPhone, setTestPhone] = React.useState('');
  const [adminPhoneInput, setAdminPhoneInput] = React.useState('');

  // Smart Variables Modal state
  const [variablesModalOpen, setVariablesModalOpen] = React.useState(false);
  const [activeModalEventKey, setActiveModalEventKey] = React.useState<string | null>(null);

  // 1. Fetch remote notification settings
  const { data: remoteSettings, isLoading } = useQuery<NotificationSettings>({
    queryKey: ['system-setting', 'notifications'],
    queryFn: () => api.getNotificationSettings(),
  });

  const [settings, setSettings] = React.useState<NotificationSettings | null>(null);

  React.useEffect(() => {
    if (remoteSettings) {
      setSettings(remoteSettings);
      if (remoteSettings.sms?.adminAlertPhones?.length) {
        setAdminPhoneInput(remoteSettings.sms.adminAlertPhones.join(', '));
      }
    }
  }, [remoteSettings]);

  // Mutation to save settings
  const saveMutation = useMutation({
    mutationFn: (data: Partial<NotificationSettings>) => api.updateNotificationSettings(data),
    onSuccess: (updated) => {
      toast.success('تنظیمات اعلان‌ها و درگاه پیامک با موفقیت ذخیره شد');
      setSettings(updated);
      queryClient.setQueryData(['system-setting', 'notifications'], updated);
      queryClient.invalidateQueries({ queryKey: ['system-setting', 'notifications'] });
    },
    onError: (err: any) => toast.error(err.message || 'خطا در ذخیره تنظیمات اعلان‌ها'),
  });

  // Mutation to test SMS connection
  const testSmsMutation = useMutation({
    mutationFn: () => {
      if (!settings) throw new Error('تنظیمات بارگذاری نشده است');
      const activeProvider = settings.sms.activeProvider;
      const creds = settings.sms.providers[activeProvider] || {};
      return api.testSmsConnection({
        providerId: activeProvider,
        phone: testPhone,
        credentials: creds,
      });
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(
          res.isDev
            ? 'پیامک در کنسول سرور لاگ شد (حالت شبیه‌ساز/توسعه)'
            : 'پیامک آزمایشی با موفقیت ارسال شد!',
        );
      } else {
        toast.error(`خطا در ارسال: ${res.message || 'ناموفق'}`);
      }
    },
    onError: (err: any) => toast.error(err.message || 'خطا در اتصال به وب‌سرویس پیامک'),
  });

  if (isLoading || !settings) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        در حال بارگذاری تنظیمات اعلان‌ها و پیامک...
      </div>
    );
  }

  const activeProvider = settings.sms.activeProvider;

  const toggleEventAccordion = (key: string) => {
    setExpandedEvents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProviderChange = (providerId: 'kavenegar' | 'melipayamak' | 'mock') => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sms: {
          ...prev.sms,
          activeProvider: providerId,
        },
      };
    });
  };

  const handleAdminPhonesBlur = () => {
    const phones = adminPhoneInput
      .split(/[,،\n]+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 5);

    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sms: {
          ...prev.sms,
          adminAlertPhones: phones,
        },
      };
    });
  };

  const handleEventSwitch = (
    eventKey: string,
    field: 'userInApp' | 'adminInApp' | 'userSms' | 'adminSms',
    val: boolean,
  ) => {
    setSettings((prev) => {
      if (!prev) return prev;
      const event = prev.events[eventKey];
      if (!event) return prev;
      return {
        ...prev,
        events: {
          ...prev.events,
          [eventKey]: {
            ...event,
            [field]: val,
          },
        },
      };
    });
  };

  const handleEventField = (eventKey: string, field: keyof NotificationEventConfig, val: any) => {
    setSettings((prev) => {
      if (!prev) return prev;
      const event = prev.events[eventKey];
      if (!event) return prev;
      return {
        ...prev,
        events: {
          ...prev.events,
          [eventKey]: {
            ...event,
            [field]: val,
          },
        },
      };
    });
  };

  const insertPlaceholder = (
    eventKey: string,
    placeholderKey: string,
    targetField: 'userCustomText' | 'adminCustomText' = 'userCustomText',
  ) => {
    const event = settings.events[eventKey];
    if (!event) return;
    const tag = `{${placeholderKey}}`;
    const current = (event[targetField] as string) || (event.customText as string) || '';
    const updated = current + (current && !current.endsWith(' ') ? ' ' : '') + tag;
    handleEventField(eventKey, targetField, updated);
    toast.success(`متغیر ${tag} به متن اضافه شد`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`متغیر ${text} در حافظه کپی شد`);
  };

  const openVariablesModal = (eventKey: string) => {
    setActiveModalEventKey(eventKey);
    setVariablesModalOpen(true);
  };

  // Helper to reliably resolve category even if legacy DB records didn't have it
  const getEventCategory = (key: string, event: NotificationEventConfig): EventCategory => {
    if (event.category) return event.category as EventCategory;
    if (key.startsWith('order')) return 'orders';
    if (key.startsWith('wallet')) return 'wallet';
    if (key.startsWith('inventory')) return 'inventory';
    if (key.startsWith('blog')) return 'blog';
    return 'orders';
  };

  // Separate OTP from store domain events
  const otpEvent = settings.events['auth_otp'];
  const domainEvents = Object.entries(settings.events).filter(([key]) => key !== 'auth_otp');

  // Counts by category (pure calculation, no hooks needed)
  const counts: Record<string, number> = { all: domainEvents.length, orders: 0, wallet: 0, inventory: 0, blog: 0 };
  for (const [key, event] of domainEvents) {
    const cat = getEventCategory(key, event);
    if (counts[cat] !== undefined) {
      counts[cat]++;
    }
  }

  // Filter events by category & search query
  const filteredEvents = domainEvents.filter(([key, event]) => {
    const cat = getEventCategory(key, event);
    const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;

    const matchesSearch =
      !searchQuery ||
      event.title.includes(searchQuery) ||
      key.includes(searchQuery) ||
      (event.description && event.description.includes(searchQuery));

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'orders':
        return <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />;
      case 'wallet':
        return <Wallet className="w-3.5 h-3.5 text-blue-600" />;
      case 'inventory':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'blog':
        return <FileText className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-primary" />;
    }
  };

  const activeModalEvent = activeModalEventKey ? settings.events[activeModalEventKey] : null;
  const modalPlaceholders: EventPlaceholder[] = activeModalEventKey
    ? EVENT_PLACEHOLDERS[activeModalEventKey] || []
    : [];

  return (
    <div className="space-y-6 font-sans text-right" dir="rtl">
      {/* ---------------------------------------------------- */}
      {/* CARD 1: SMS Gateway & Multi-Provider Settings */}
      {/* ---------------------------------------------------- */}
      <Card className="border-border/80 shadow-2xs overflow-hidden">
        <CardHeader className="text-right p-4 sm:p-6 space-y-3">
          <div className="space-y-1">
            <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2">
              <Server className="w-4 h-4 text-primary shrink-0" />
              <span>پیکربندی درگاه پیامک چندگانه</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground leading-relaxed">
              انتخاب ارائه‌دهنده پیامک فعال، تنظیم اطلاعات احراز هویت و شماره‌های همراه مدیران فروشگاه.
            </CardDescription>
          </div>

          <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-muted/40 border border-border/60">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground block">ارسال پیامک سراسری سیستم</span>
              <span className="text-[11px] text-muted-foreground block">فعال یا غیرفعال‌سازی کلیه پیامک‌های خروجی سامانه</span>
            </div>
            <Switch
              checked={settings.sms.enabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => (prev ? { ...prev, sms: { ...prev.sms, enabled: checked } } : prev))
              }
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-4 sm:p-6 pt-0 sm:pt-0">
          {/* Provider Selection Cards */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground block">
              انتخاب پنل پیامکی فعال در سامانه:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* Kavenegar */}
              <div
                onClick={() => handleProviderChange('kavenegar')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  activeProvider === 'kavenegar'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border/70 hover:border-border hover:bg-muted/30'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">کاوه‌نگار</span>
                    {activeProvider === 'kavenegar' && (
                      <Badge variant="default" className="text-[9px] px-1 py-0 h-4">فعال</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    الگوهای اعتبارسنجی (Lookup) و خطوط خدماتی
                  </p>
                </div>
              </div>

              {/* Melipayamak */}
              <div
                onClick={() => handleProviderChange('melipayamak')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  activeProvider === 'melipayamak'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border/70 hover:border-border hover:bg-muted/30'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">ملی‌پیامک</span>
                    {activeProvider === 'melipayamak' && (
                      <Badge variant="default" className="text-[9px] px-1 py-0 h-4">فعال</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    وب‌سرویس پترن خدماتی (BaseService) و خطوط اختصاصی
                  </p>
                </div>
              </div>

              {/* Mock / Dev Mode */}
              <div
                onClick={() => handleProviderChange('mock')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  activeProvider === 'mock'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border/70 hover:border-border hover:bg-muted/30'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">شبیه‌ساز (توسعه)</span>
                    {activeProvider === 'mock' && (
                      <Badge variant="default" className="text-[9px] px-1 py-0 h-4">فعال</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    لاگ در کنسول سرور بدون کسر هزینه پیامک
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Provider Credential Inputs */}
          {activeProvider === 'kavenegar' && (
            <div className="p-3.5 sm:p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>اطلاعات اتصال به پنل کاوه‌نگار (Kavenegar)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-foreground">کلید دسترسی (API Key)</label>
                  <Input
                    type="password"
                    value={settings.sms.providers.kavenegar?.apiKey || ''}
                    onChange={(e) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              sms: {
                                ...prev.sms,
                                providers: {
                                  ...prev.sms.providers,
                                  kavenegar: {
                                    ...prev.sms.providers.kavenegar,
                                    apiKey: e.target.value,
                                  },
                                },
                              },
                            }
                          : prev,
                      )
                    }
                    className="font-sans text-xs dir-ltr text-right h-9"
                    placeholder="API Key کاوه‌نگار"
                  />
                </div>
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-foreground">شماره خط فرستنده (اختیاری برای پترن)</label>
                  <Input
                    value={settings.sms.providers.kavenegar?.sender || ''}
                    onChange={(e) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              sms: {
                                ...prev.sms,
                                providers: {
                                  ...prev.sms.providers,
                                  kavenegar: {
                                    ...prev.sms.providers.kavenegar,
                                    sender: e.target.value,
                                  },
                                },
                              },
                            }
                          : prev,
                      )
                    }
                    className="font-sans text-xs dir-ltr text-right h-9"
                    placeholder="10008585"
                  />
                </div>
              </div>
            </div>
          )}

          {activeProvider === 'melipayamak' && (
            <div className="p-3.5 sm:p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>اطلاعات اتصال به پنل ملی‌پیامک (Melipayamak)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-foreground">نام کاربری / API Key</label>
                  <Input
                    value={settings.sms.providers.melipayamak?.username || ''}
                    onChange={(e) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              sms: {
                                ...prev.sms,
                                providers: {
                                  ...prev.sms.providers,
                                  melipayamak: {
                                    ...prev.sms.providers.melipayamak,
                                    username: e.target.value,
                                  },
                                },
                              },
                            }
                          : prev,
                      )
                    }
                    className="font-sans text-xs dir-ltr text-right h-9"
                    placeholder="نام کاربری"
                  />
                </div>
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-foreground">کلمه عبور (Password)</label>
                  <Input
                    type="password"
                    value={settings.sms.providers.melipayamak?.password || ''}
                    onChange={(e) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              sms: {
                                ...prev.sms,
                                providers: {
                                  ...prev.sms.providers,
                                  melipayamak: {
                                    ...prev.sms.providers.melipayamak,
                                    password: e.target.value,
                                  },
                                },
                              },
                            }
                          : prev,
                      )
                    }
                    className="font-sans text-xs dir-ltr text-right h-9"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-foreground">شماره اختصاصی خط ارسال</label>
                  <Input
                    value={settings.sms.providers.melipayamak?.sender || ''}
                    onChange={(e) =>
                      setSettings((prev) =>
                        prev
                          ? {
                              ...prev,
                              sms: {
                                ...prev.sms,
                                providers: {
                                  ...prev.sms.providers,
                                  melipayamak: {
                                    ...prev.sms.providers.melipayamak,
                                    sender: e.target.value,
                                  },
                                },
                              },
                            }
                          : prev,
                      )
                    }
                    className="font-sans text-xs dir-ltr text-right h-9"
                    placeholder="5000400..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Admin Alert Phone Numbers */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>شماره موبایل مدیران جهت دریافت هشدارهای سیستمی</span>
            </label>
            <Input
              value={adminPhoneInput}
              onChange={(e) => setAdminPhoneInput(e.target.value)}
              onBlur={handleAdminPhonesBlur}
              className="font-sans text-xs dir-ltr text-right h-9"
              placeholder="09121111111, 09122222222"
            />
            <p className="text-[11px] text-muted-foreground">
              می‌توانید چند شماره همراه را با علامت ویرگول انگلیسی (,) از یکدیگر جدا کنید.
            </p>
          </div>

          {/* Test SMS Dispatcher */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-right w-full sm:w-auto">
              <span className="text-xs font-bold text-foreground block">تست اتصال و ارسال پیامک</span>
              <span className="text-[11px] text-muted-foreground block">
                یک پیامک آزمایشی به شماره زیر بفرستید تا وضعیت اتصال درگاه بررسی شود.
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Input
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="۰۹۱۲..."
                className="w-full sm:w-36 text-xs font-sans dir-ltr text-right h-8"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => testSmsMutation.mutate()}
                disabled={testSmsMutation.isPending || !testPhone}
                className="gap-1.5 h-8 text-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-primary" />
                <span>{testSmsMutation.isPending ? 'در حال ارسال...' : 'ارسال آزمایشی'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* CARD 2: Dedicated Clean Authentication OTP Settings */}
      {/* ---------------------------------------------------- */}
      {otpEvent && (
        <Card className="border-border/80 shadow-2xs">
          <CardHeader className="text-right p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <span>کد تأیید ورود و احراز هویت پیامکی (OTP)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  تنظیم الگوی ارسال کد یکبارمصرف لاگین و ثبت‌نام سریع. برای تضمین تحویل فوری و عبور از بلک‌لیست، ورود منحصراً از طریق الگوی خدماتی پترن انجام می‌شود.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-semibold text-muted-foreground">فعال بودن ورود با OTP:</span>
                <Switch
                  checked={otpEvent.userSms}
                  onCheckedChange={(val) => handleEventSwitch('auth_otp', 'userSms', val)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/60">
              <div className="space-y-1 text-right">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>
                    {activeProvider === 'melipayamak'
                      ? 'کد عددی الگوی ملی‌پیامک (BodyId)'
                      : 'نام الگوی خدماتی کاوه‌نگار (Template)'}
                  </span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0 font-normal">خدماتی فوری</Badge>
                </label>
                <Input
                  value={
                    activeProvider === 'melipayamak'
                      ? otpEvent.userMelipayamakPatternCode || otpEvent.melipayamakPatternCode || ''
                      : otpEvent.userKavenegarTemplate || otpEvent.kavenegarTemplate || ''
                  }
                  onChange={(e) => {
                    const field =
                      activeProvider === 'melipayamak' ? 'userMelipayamakPatternCode' : 'userKavenegarTemplate';
                    handleEventField('auth_otp', field, e.target.value);
                  }}
                  className="font-sans text-xs dir-ltr text-right h-9"
                  placeholder={activeProvider === 'melipayamak' ? 'مثلاً: 28491' : 'verify'}
                />
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-xs font-semibold text-foreground block">متغیر کد در الگو</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-0.5">
                  <Badge variant="secondary" className="w-fit text-xs font-mono px-2.5 py-1">
                    {activeProvider === 'melipayamak' ? 'آرگومان اول: {code}' : 'token = {code}'}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground leading-relaxed">
                    کد عددی تصادفی که در متغیر الگو جایگذاری و پیامک می‌شود
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ---------------------------------------------------- */}
      {/* CARD 3: Store Domain Events Notification Matrix */}
      {/* ---------------------------------------------------- */}
      <Card className="border-border/80 shadow-2xs">
        <CardHeader className="text-right p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>ماتریس رویدادهای فروشگاه</span>
              </CardTitle>
              <CardDescription className="text-xs">
                تنظیم متن‌ها و الگوهای مجزا برای خریدار و مدیر سیستم به تفکیک دسته‌بندی موضوعی.
              </CardDescription>
            </div>
          </div>

          {/* Category Filter Pills (Progressive Disclosure - Horizontal Touch-Scroll) */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/60">
            <div className="w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 pt-0.5 -mx-1 px-1">
              <div className="inline-flex items-center gap-1.5 min-w-max">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>همه رویدادها</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/20 font-mono">
                    {counts.all}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('orders')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'orders'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>سفارشات</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/20 font-mono">
                    {counts.orders}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('wallet')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'wallet'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                  <span>کیف پول و مالی</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/20 font-mono">
                    {counts.wallet}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('inventory')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'inventory'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>انبارداری</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/20 font-mono">
                    {counts.inventory}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('blog')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'blog'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0 text-purple-600" />
                  <span>وبلاگ و مجله</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/20 font-mono">
                    {counts.blog}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-48 shrink-0">
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی رویداد..."
                className="h-8 pr-8 text-xs font-sans text-right"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3.5 p-4 sm:p-6 pt-0 sm:pt-0">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              هیچ رویدادی با این فیلتر یافت نشد.
            </div>
          ) : (
            filteredEvents.map(([eventKey, event]) => {
              const isExpanded = !!expandedEvents[eventKey];
              const sendMode = event.sendMode || 'pattern';
              const category = getEventCategory(eventKey, event);

              return (
                <div
                  key={eventKey}
                  className="rounded-xl border border-border/70 overflow-hidden bg-card transition-shadow hover:shadow-2xs"
                >
                  {/* Event Accordion Header */}
                  <div
                    onClick={() => toggleEventAccordion(eventKey)}
                    className="p-3.5 sm:p-4 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer space-y-3"
                  >
                    {/* Top Row: Icon, Title, Description, and Chevron */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="p-2 rounded-xl bg-background border border-border/70 shadow-2xs shrink-0 mt-0.5">
                          {getCategoryIcon(category)}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-foreground">{event.title}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono text-muted-foreground">
                              {eventKey}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      {/* Working Chevron Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEventAccordion(eventKey);
                        }}
                        className="p-1.5 rounded-lg border border-border/60 bg-background/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                        title={isExpanded ? 'بستن تنظیمات' : 'باز کردن تنظیمات رویداد'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Channel Controls: 2 Organized Boxes for Customer & Admin */}
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border/40"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Customer Channel Box */}
                      <div className="p-2 rounded-lg bg-background/70 border border-border/60 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <User className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-xs font-semibold text-foreground">خریدار:</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer">
                            <span>نوتیف</span>
                            <Switch
                              checked={event.userInApp}
                              onCheckedChange={(val) => handleEventSwitch(eventKey, 'userInApp', val)}
                            />
                          </label>
                          <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer">
                            <span>پیامک</span>
                            <Switch
                              checked={event.userSms}
                              onCheckedChange={(val) => handleEventSwitch(eventKey, 'userSms', val)}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Admin Channel Box */}
                      <div className="p-2 rounded-lg bg-background/70 border border-border/60 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Shield className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-xs font-semibold text-foreground">مدیر:</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer">
                            <span>نوتیف</span>
                            <Switch
                              checked={event.adminInApp}
                              onCheckedChange={(val) => handleEventSwitch(eventKey, 'adminInApp', val)}
                            />
                          </label>
                          <label className="flex items-center gap-1 text-[11px] text-muted-foreground cursor-pointer">
                            <span>پیامک</span>
                            <Switch
                              checked={event.adminSms}
                              onCheckedChange={(val) => handleEventSwitch(eventKey, 'adminSms', val)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Body: Patterns, Toolbar & Customer/Admin Messages */}
                  {isExpanded && (
                    <div className="p-3.5 sm:p-5 border-t border-border/60 bg-background/50 space-y-4">
                      {/* Top Bar inside Body: Send Mode & Smart Variables Modal Trigger */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-muted/30 border border-border/60">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-xs font-semibold text-foreground shrink-0">نوع ارسال پیامک:</span>
                          <div className="grid grid-cols-2 sm:flex sm:items-center gap-1 p-0.5 bg-background rounded-lg border border-border/60">
                            <button
                              type="button"
                              onClick={() => handleEventField(eventKey, 'sendMode', 'pattern')}
                              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
                                sendMode === 'pattern'
                                  ? 'bg-primary text-primary-foreground shadow-2xs'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <Zap className="w-3 h-3 shrink-0" />
                              <span>الگوی خدماتی (سریع)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEventField(eventKey, 'sendMode', 'text')}
                              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
                                sendMode === 'text'
                                  ? 'bg-primary text-primary-foreground shadow-2xs'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <AlignLeft className="w-3 h-3 shrink-0" />
                              <span>پیامک متنی سفارشی</span>
                            </button>
                          </div>
                        </div>

                        {/* Button to open Variables Modal */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openVariablesModal(eventKey)}
                          className="w-full sm:w-auto gap-1.5 h-8 text-xs font-sans text-primary hover:text-primary hover:bg-primary/5 border-primary/30"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>مشاهده و درج متغیرهای هوشمند ({EVENT_PLACEHOLDERS[eventKey]?.length || 0})</span>
                        </Button>
                      </div>

                      {/* Customer vs Admin Separate Configurations */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* 1. Customer Message Box */}
                        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-border/60">
                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-emerald-600" />
                              <span>پیام و اعلان برای خریدار (مشتری)</span>
                            </span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">مشتری</Badge>
                          </div>

                          {/* Customer Pattern Code */}
                          {sendMode === 'pattern' && (
                            <div className="space-y-1 text-right">
                              <label className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                                <span>
                                  {activeProvider === 'melipayamak'
                                    ? 'کد پترن ملی‌پیامک خریدار (BodyId)'
                                    : 'نام الگوی کاوه‌نگار خریدار (Template)'}
                                </span>
                              </label>
                              <Input
                                value={
                                  activeProvider === 'melipayamak'
                                    ? event.userMelipayamakPatternCode || event.melipayamakPatternCode || ''
                                    : event.userKavenegarTemplate || event.kavenegarTemplate || ''
                                }
                                onChange={(e) => {
                                  const field =
                                    activeProvider === 'melipayamak'
                                      ? 'userMelipayamakPatternCode'
                                      : 'userKavenegarTemplate';
                                  handleEventField(eventKey, field, e.target.value);
                                }}
                                className="font-sans text-xs dir-ltr text-right h-8"
                                placeholder={activeProvider === 'melipayamak' ? 'کد پترن خریدار' : 'قالب خریدار'}
                              />
                            </div>
                          )}

                          {/* Customer Custom Text */}
                          <div className="space-y-1 text-right">
                            <label className="text-[11px] font-semibold text-muted-foreground block">
                              متن اختصاصی پیامک و نوتیفیکیشن خریدار:
                            </label>
                            <textarea
                              value={event.userCustomText || event.customText || ''}
                              onChange={(e) => handleEventField(eventKey, 'userCustomText', e.target.value)}
                              rows={3}
                              className="w-full rounded-lg border border-input bg-background p-2.5 text-xs font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                              placeholder="متن پیام به خریدار..."
                            />
                          </div>
                        </div>

                        {/* 2. Admin Message Box */}
                        <div className="p-3.5 rounded-xl border border-border/70 bg-card space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-border/60">
                            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-blue-600" />
                              <span>هشدار و اعلان برای مدیر سیستم (ادمین)</span>
                            </span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">مدیریت</Badge>
                          </div>

                          {/* Admin Pattern Code */}
                          {sendMode === 'pattern' && (
                            <div className="space-y-1 text-right">
                              <label className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                                <span>
                                  {activeProvider === 'melipayamak'
                                    ? 'کد پترن ملی‌پیامک ادمین (BodyId)'
                                    : 'نام الگوی کاوه‌نگار ادمین (Template)'}
                                </span>
                              </label>
                              <Input
                                value={
                                  activeProvider === 'melipayamak'
                                    ? event.adminMelipayamakPatternCode || ''
                                    : event.adminKavenegarTemplate || ''
                                }
                                onChange={(e) => {
                                  const field =
                                    activeProvider === 'melipayamak'
                                      ? 'adminMelipayamakPatternCode'
                                      : 'adminKavenegarTemplate';
                                  handleEventField(eventKey, field, e.target.value);
                                }}
                                className="font-sans text-xs dir-ltr text-right h-8"
                                placeholder={activeProvider === 'melipayamak' ? 'کد پترن ادمین' : 'قالب ادمین'}
                              />
                            </div>
                          )}

                          {/* Admin Custom Text */}
                          <div className="space-y-1 text-right">
                            <label className="text-[11px] font-semibold text-muted-foreground block">
                              متن اختصاصی هشدار به مدیران سیستم:
                            </label>
                            <textarea
                              value={event.adminCustomText || ''}
                              onChange={(e) => handleEventField(eventKey, 'adminCustomText', e.target.value)}
                              rows={3}
                              className="w-full rounded-lg border border-input bg-background p-2.5 text-xs font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                              placeholder="متن پیام هشدار به مدیران فروشگاه..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>

        <CardFooter className="flex justify-end p-4 sm:p-6 pt-3 border-t border-border/60">
          <Button
            onClick={() => saveMutation.mutate(settings)}
            disabled={saveMutation.isPending}
            className="gap-2 font-sans text-xs"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? 'در حال ذخیره‌سازی...' : 'ذخیره کل تنظیمات اعلان و پیامک'}</span>
          </Button>
        </CardFooter>
      </Card>

      {/* ---------------------------------------------------- */}
      {/* DIALOG: Smart Variables Inspector & Inserter Modal   */}
      {/* ---------------------------------------------------- */}
      <Dialog open={variablesModalOpen} onOpenChange={setVariablesModalOpen}>
        <DialogContent className="max-w-xl font-sans text-right" dir="rtl">
          <DialogHeader className="text-right space-y-1">
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>متغیرهای هوشمند رویداد: {activeModalEvent?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              با کلیک روی دکمه‌های درج یا کپی، متغیر را به راحتی در متن پیام مشتری یا مدیر قرار دهید.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
            {modalPlaceholders.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                هیچ متغیر پویایی برای این رویداد تعریف نشده است.
              </div>
            ) : (
              <div className="divide-y divide-border/60 border border-border/70 rounded-xl overflow-hidden bg-card">
                {modalPlaceholders.map((ph) => (
                  <div
                    key={ph.key}
                    className="p-3 sm:p-3.5 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="space-y-1 text-right min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <code
                          onClick={() => copyToClipboard(`{${ph.key}}`)}
                          className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-bold dir-ltr cursor-pointer hover:bg-primary/20 transition-colors"
                          title="کلیک برای کپی"
                        >
                          {`{${ph.key}}`}
                        </code>
                        <span className="text-xs font-bold text-foreground">{ph.label}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        نمونه واقعی: <span className="text-foreground/90 font-medium">{ph.example}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 sm:pt-0 border-t sm:border-0 border-border/40 shrink-0">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          if (activeModalEventKey) {
                            insertPlaceholder(activeModalEventKey, ph.key, 'userCustomText');
                          }
                        }}
                        className="h-7 text-[11px] gap-1 px-2.5 font-sans flex-1 sm:flex-initial"
                      >
                        <User className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>درج در خریدار</span>
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          if (activeModalEventKey) {
                            insertPlaceholder(activeModalEventKey, ph.key, 'adminCustomText');
                          }
                        }}
                        className="h-7 text-[11px] gap-1 px-2.5 font-sans flex-1 sm:flex-initial"
                      >
                        <Shield className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>درج در مدیر</span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`{${ph.key}}`)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0"
                        title="کپی متغیر"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
