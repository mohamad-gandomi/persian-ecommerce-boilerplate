'use client';

import * as React from 'react';
import { Menu, Store, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavContent } from './nav-content';
import { NotificationBell } from './notification-bell';
import { api } from '@/lib/api';
import { useFeatures } from '@/lib/use-features';

export function Header({ title }: { title?: string }) {
  const { isEnabled } = useFeatures();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string>('admin@example.com');
  const [userName, setUserName] = React.useState<string>('مدیر سیستم');

  React.useEffect(() => {
    const user = api.getCurrentUser();
    if (user?.email) setUserEmail(user.email);
    if (user?.firstName) setUserName(`${user.firstName} ${user.lastName || ''}`.trim());
  }, []);

  return (
    <header className="h-16 border-b border-border/70 bg-card/85 backdrop-blur-md px-3 sm:px-8 flex items-center justify-between sticky top-0 z-20 font-sans" dir="rtl">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="باز کردن منوی مدیریت"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-72 flex flex-col font-sans" dir="rtl">
            <div className="h-16 flex items-center px-6 border-b border-border/60 gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight block text-foreground font-serif">
                  فروشگاه آنلاین
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wide block -mt-0.5">
                  پنل مدیریت
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavContent onItemClick={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Page Title */}
        <h1 className="text-sm sm:text-base md:text-xl font-bold text-foreground tracking-tight truncate max-w-[130px] xs:max-w-[170px] sm:max-w-[260px] md:max-w-none">
          {title || 'پیشخوان مدیریت'}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification Bell */}
        {isEnabled('notifications') && <NotificationBell />}

        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[11px] font-medium border border-emerald-200/60 dark:border-emerald-800/60">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>سیستم آنلاین</span>
        </div>

        {/* Current Admin User */}
        <div className="flex items-center gap-1.5 sm:gap-2 pr-2 border-r border-border/60">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs border border-primary/20 shrink-0">
            مد
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs font-semibold leading-tight">{userName}</div>
            <div className="text-[11px] text-muted-foreground leading-tight" dir="ltr">{userEmail}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => api.logout()}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50"
            title="خروج از حساب مدیریت"
            aria-label="خروج از حساب مدیریت"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
