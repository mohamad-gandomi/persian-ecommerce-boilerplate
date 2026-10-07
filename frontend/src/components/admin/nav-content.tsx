'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Settings2,
  ChevronDown,
  ShoppingBag,
  Package,
  Image as ImageIcon,
  BookOpen,
  Layers,
  Server,
  Database,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api, API_BASE } from '@/lib/api';
import { useFeatures } from '@/lib/use-features';
import { NavItemList } from './nav-item-list';
import {
  systemNavItems,
  productNavItems,
  shopNavItems,
  mediaNavItems,
  blogNavItems,
  type NavItem,
} from './nav-data';

export type { NavItem };
export {
  systemNavItems,
  productNavItems,
  shopNavItems,
  mediaNavItems,
  blogNavItems,
};

type AccordionSection = 'system' | 'shop' | 'products' | 'media' | 'blog' | 'tools';

export function NavContent({ onItemClick }: { onItemClick?: () => void }) {
  const { isEnabled } = useFeatures();

  const visibleSystemNavItems = React.useMemo(() => {
    return systemNavItems.filter((item) => !item.featureKey || isEnabled(item.featureKey));
  }, [isEnabled]);

  const visibleShopNavItems = React.useMemo(() => {
    return shopNavItems.filter((item) => !item.featureKey || isEnabled(item.featureKey));
  }, [isEnabled]);

  const visibleProductNavItems = React.useMemo(() => {
    return productNavItems.filter((item) => !item.featureKey || isEnabled(item.featureKey));
  }, [isEnabled]);

  const visibleBlogNavItems = React.useMemo(() => {
    return blogNavItems.filter((item) => !item.featureKey || isEnabled(item.featureKey));
  }, [isEnabled]);

  const [openSections, setOpenSections] = React.useState<Record<AccordionSection, boolean>>({
    system: true,
    shop: false,
    products: false,
    media: false,
    blog: false,
    tools: false,
  });

  const handleToggle = (sec: AccordionSection) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const { isSuccess, isError } = useQuery({
    queryKey: ['backend-health'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/categories`);
      return res.ok;
    },
    refetchInterval: 15000,
  });

  return (
    <div className="flex flex-col min-h-full font-sans">
      <div className="p-3 space-y-2.5 flex-1">
        {/* Section 1: System & Management (پیشخوان + کاربران + اعلان‌ها + تنظیمات) */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggle('system')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all text-right select-none',
              openSections.system
                ? 'bg-slate-100/90 text-slate-900 dark:bg-slate-800/40 dark:text-slate-200 border-b border-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
            )}
          >
            <div className="flex items-center gap-2.5">
              <Settings2 className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
              <span>مدیریت و سامانه</span>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                openSections.system && 'rotate-180 text-foreground',
              )}
            />
          </button>
          {openSections.system && (
            <div className="animate-in fade-in-50 duration-150">
              <NavItemList items={visibleSystemNavItems} onItemClick={onItemClick} />
            </div>
          )}
        </div>

        {/* Section 2: Shop & Orders (سفارش‌ها + کیف‌پول + معرف + ارسال + تخفیف + شگفت‌انگیز) */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggle('shop')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all text-right select-none',
              openSections.shop
                ? 'bg-primary/10 text-primary border-b border-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
            )}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>فروشگاه و سفارش‌ها</span>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                openSections.shop && 'rotate-180 text-foreground',
              )}
            />
          </button>
          {openSections.shop && (
            <div className="animate-in fade-in-50 duration-150">
              <NavItemList items={visibleShopNavItems} onItemClick={onItemClick} />
            </div>
          )}
        </div>

        {/* Section 3: Products & Catalog (محصولات + متغیرها + دسته‌بندی‌ها) */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggle('products')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all text-right select-none',
              openSections.products
                ? 'bg-amber-50/80 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300 border-b border-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
            )}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>محصولات و کاتالوگ</span>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                openSections.products && 'rotate-180 text-foreground',
              )}
            />
          </button>
          {openSections.products && (
            <div className="animate-in fade-in-50 duration-150">
              <NavItemList items={visibleProductNavItems} onItemClick={onItemClick} />
            </div>
          )}
        </div>

        {/* Section 4: Media */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggle('media')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all text-right select-none',
              openSections.media
                ? 'bg-blue-50/80 text-blue-900 dark:bg-blue-950/30 dark:text-blue-300 border-b border-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
            )}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>رسانه و پرونده‌ها</span>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                openSections.media && 'rotate-180 text-foreground',
              )}
            />
          </button>
          {openSections.media && (
            <div className="animate-in fade-in-50 duration-150">
              <NavItemList items={mediaNavItems} onItemClick={onItemClick} />
            </div>
          )}
        </div>

        {/* Section 5: Blog */}
        {isEnabled('blog') && visibleBlogNavItems.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => handleToggle('blog')}
              className={cn(
                'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all text-right select-none',
                openSections.blog
                  ? 'bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300 border-b border-border/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
              )}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>وبلاگ و مقالات</span>
              </div>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                  openSections.blog && 'rotate-180 text-foreground',
                )}
              />
            </button>
            {openSections.blog && (
              <div className="animate-in fade-in-50 duration-150">
                <NavItemList items={visibleBlogNavItems} onItemClick={onItemClick} />
              </div>
            )}
          </div>
        )}

        {/* Section 6: Dev & Tools */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggle('tools')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold tracking-wide transition-all text-right select-none',
              openSections.tools
                ? 'bg-muted/80 text-foreground border-b border-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
            )}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>ابزارهای فنی و پایگاه داده</span>
            </div>
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                openSections.tools && 'rotate-180 text-foreground',
              )}
            />
          </button>
          {openSections.tools && (
            <div className="p-2 space-y-1.5 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/60 bg-background/70 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Server className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium">وب‌سرویس API</span>
                </div>
                {isSuccess ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    متصل
                  </span>
                ) : isError ? (
                  <span className="flex items-center gap-1.5 text-destructive font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                    قطع
                  </span>
                ) : (
                  <span className="text-muted-foreground text-[11px]">بررسی...</span>
                )}
              </div>
              <a
                href={process.env.NEXT_PUBLIC_SWAGGER_URL || 'http://localhost:4000/api/docs'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>مستندات Swagger API</span>
                </div>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="http://localhost:5050"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>مدیریت پایگاه داده pgAdmin</span>
                </div>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-border/60 bg-muted/20 mt-auto">
        <div className="text-[11px] text-muted-foreground text-center font-medium flex items-center justify-center gap-2 font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>سامانه مدیریت فروشگاه آنلاین</span>
        </div>
      </div>
    </div>
  );
}
