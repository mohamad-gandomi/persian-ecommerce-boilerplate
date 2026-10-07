'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  FolderTree,
  BookOpen,
  Users,
  Palette,
  ShoppingBag,
  Tag,
  Zap,
  Image as ImageIcon,
  Settings,
  Bell,
  Wallet,
  Gift,
  Truck,
  MessageSquare,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useFeatures } from '@/lib/use-features';
import { Header } from '@/components/admin/header';
import { DashboardHeader } from '@/components/admin/dashboard/dashboard-header';
import {
  DashboardSearch,
  type SearchResultsData,
  type SearchActionItem,
} from '@/components/admin/dashboard/dashboard-search';
import { DashboardKpis } from '@/components/admin/dashboard/dashboard-kpis';
import { DashboardOrdersCard } from '@/components/admin/dashboard/dashboard-orders-card';
import { DashboardShortcuts } from '@/components/admin/dashboard/dashboard-shortcuts';
import { DashboardInventoryCard } from '@/components/admin/dashboard/dashboard-inventory-card';
import { DashboardPromosCard } from '@/components/admin/dashboard/dashboard-promos-card';
import { DashboardSnapshotCard } from '@/components/admin/dashboard/dashboard-snapshot-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { isEnabled } = useFeatures();
  const [searchQuery, setSearchQuery] = React.useState('');

  // 1. Core Orders & Store Statistics
  const { data: orderStats, isLoading: statsLoading } = useQuery({
    queryKey: ['order-stats'],
    queryFn: () => api.getOrderStats(),
  });

  // 2. Products Query
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  // 3. Coupons Query (only if coupons module is enabled)
  const { data: coupons = [], isLoading: couponsLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => api.getCoupons(),
    enabled: isEnabled('coupons'),
  });

  // 4. Attributes Query (only if attributes module is enabled)
  const { data: attributes = [] } = useQuery({
    queryKey: ['attributes'],
    queryFn: () => api.getAttributes(),
    enabled: isEnabled('attributes'),
  });

  // 5. Blog Query (only if blog module is enabled)
  const { data: blogPosts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => api.getBlogPosts(),
    enabled: isEnabled('blog'),
  });

  // 6. Media Items Query
  const { data: mediaItems = [] } = useQuery({
    queryKey: ['media-count'],
    queryFn: () => api.getMedia(),
  });

  // 7. Wallet Statistics Query (only if wallet module is enabled)
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['admin-wallets-stats'],
    queryFn: () => api.getAdminWallets(undefined, 5),
    enabled: isEnabled('wallet'),
  });

  // 8. Notifications Unread Count (only if notifications module is enabled)
  const { data: unreadNotifications = 0 } = useQuery({
    queryKey: ['admin-notifications-unread-count'],
    queryFn: () => api.getAdminUnreadCount(),
    enabled: isEnabled('notifications'),
  });

  // 9. Active Flash Deal Query (only if flashDeals module is enabled)
  const { data: activeFlashDeal } = useQuery({
    queryKey: ['active-flash-deal'],
    queryFn: () => api.getActiveFlashDeal(),
    enabled: isEnabled('flashDeals'),
  });

  const totalRevenue = orderStats?.totalRevenue || 0;
  const totalOrders = orderStats?.totalOrders || 0;
  const averageOrderValue = orderStats?.averageOrderValue || 0;
  const pendingCount = orderStats?.pendingCount || 0;
  const processingCount = orderStats?.processingCount || 0;
  const ordersToFulfill = pendingCount + processingCount;

  const lowStockProducts = React.useMemo(() => {
    return products.filter(
      (p) => p.stockQuantity !== null && p.stockQuantity !== undefined && p.stockQuantity <= 5,
    );
  }, [products]);

  const outOfStockCount = React.useMemo(() => {
    return products.filter((p) => p.stockQuantity === 0).length;
  }, [products]);

  const activeCoupons = React.useMemo(
    () => (isEnabled('coupons') ? coupons.filter((c) => c.isActive) : []),
    [coupons, isEnabled],
  );

  const variableCount = products.filter((p) => p.productType === 'VARIABLE').length;
  const simpleCount = products.filter((p) => p.productType === 'SIMPLE').length;
  const totalVariants = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);

  // All Searchable Quick Actions & Navigation Shortcuts
  const allQuickActions = React.useMemo<SearchActionItem[]>(
    () => [
      {
        title: 'ثبت محصول جدید',
        description: 'ایجاد محصول ساده یا متغیر در کاتالوگ فروشگاه',
        keywords: ['محصول', 'کالا', 'جدید', 'افزودن', 'product', 'new', 'انبار'],
        href: '/products/new',
        icon: Package,
        category: 'محصولات',
      },
      {
        title: 'صف سفارش‌ها و ارسال',
        description: 'بررسی سفارش‌های جدید، تسویه حساب و آماده‌سازی مرسولات',
        keywords: ['سفارش', 'خرید', 'فاکتور', 'order', 'پرداخت', 'مرسوله', 'فروش'],
        href: '/orders',
        icon: ShoppingBag,
        category: 'سفارش‌ها',
      },
      {
        title: 'روش‌های ارسال و حمل و نقل',
        description: 'تنظیم هزینه‌ها و روش‌های پیک، پست پیشتاز و تیپاکس',
        keywords: ['ارسال', 'پست', 'تیپاکس', 'پیک', 'کرایه', 'shipping', 'حمل و نقل'],
        href: '/shipping',
        icon: Truck,
        category: 'فروشگاه',
      },
      {
        title: 'فهرست مشتریان و کاربران',
        description: 'مدیریت کاربران، نشانی‌ها، اطلاعات شناسنامه‌ای و دسترسی‌ها',
        keywords: ['کاربر', 'مشتری', 'users', 'پروفایل', 'شماره تماس', 'ایمیل', 'کد ملی'],
        href: '/users',
        icon: Users,
        category: 'کاربران',
      },
      {
        title: 'کتابخانه رسانه و فایل‌ها',
        description: 'مدیریت تصاویر کالاها، بهینه‌سازی و فایل‌های چندرسانه‌ای',
        keywords: ['رسانه', 'عکس', 'تصویر', 'فایل', 'media', 'آپلود', 'گالری', 'تصاویر'],
        href: '/media',
        icon: ImageIcon,
        category: 'رسانه',
      },
      {
        title: 'تنظیمات عمومی سامانه',
        description: 'پیکربندی اطلاعات فروشگاه، درگاه‌های پرداخت آنلاین و ماژول‌ها',
        keywords: ['تنظیمات', 'سامانه', 'درگاه پرداخت', 'settings', 'پیکربندی', 'ماژول'],
        href: '/settings',
        icon: Settings,
        category: 'سامانه',
      },
      {
        title: 'مرکز اعلان‌های سامانه',
        description: 'مشاهده رویدادها، هشدارهای انبار، پیام‌ها و اعلان‌های ادمین',
        keywords: ['اعلان', 'نوتیف', 'نوتیفیکیشن', 'notification', 'هشدار', 'رویداد', 'زنگوله'],
        href: '/notifications',
        icon: Bell,
        category: 'سامانه',
        featureKey: 'notifications',
      },
      {
        title: 'تنظیمات پیامک و پیام‌رسانی (SMS)',
        description: 'پیکربندی کاوه‌نگار، ملی‌پیامک، ماتریس رویدادها و الگوهای OTP',
        keywords: ['پیامک', 'اس ام اس', 'sms', 'کاوه‌نگار', 'ملی پیامک', 'ارسال پیامک', 'قالب پیامک', 'کد تایید'],
        href: '/settings#notifications',
        icon: MessageSquare,
        category: 'سامانه',
        featureKey: 'notifications',
      },
      {
        title: 'کیف‌پول‌ها و اعتبار کاربران',
        description: 'مدیریت موجودی کیف‌پول، شارژ دستی، گزارش تراکنش‌ها و انقضای شارژ',
        keywords: ['کیف پول', 'شارژ', 'اعتبار', 'wallet', 'موجودی', 'انقضای کیف پول', 'کسر موجودی'],
        href: '/wallets',
        icon: Wallet,
        category: 'مالی',
        featureKey: 'wallet',
      },
      {
        title: 'سیستم معرف و پاداش خرید (رفرال)',
        description: 'کدهای معرف، کمیسیون همکاران در فروش و تنظیمات پاداش خرید',
        keywords: ['معرف', 'پاداش', 'رفرال', 'referral', 'دعوت', 'کمیسیون', 'همکاری در فروش'],
        href: '/referrals',
        icon: Gift,
        category: 'بازاریابی',
        featureKey: 'referral',
      },
      {
        title: 'فروش شگفت‌انگیز و آفرها',
        description: 'مدیریت کمپین‌های تخفیف زمان‌دار با تایمر معکوس و کش‌بک',
        keywords: ['شگفت انگیز', 'آفر', 'تخفیف زمان دار', 'تایمر', 'flash deal', 'پیشنهاد شگفت انگیز'],
        href: '/flash-deals',
        icon: Zap,
        category: 'بازاریابی',
        featureKey: 'flashDeals',
      },
      {
        title: 'تعریف و مدیریت کدهای تخفیف',
        description: 'کوپن‌های درصدی یا ثابت با تاریخ انقضا و سقف استفاده',
        keywords: ['کد تخفیف', 'کوپن', 'تخفیف', 'coupon', 'تخفیف درصدی', 'جشنواره'],
        href: '/coupons',
        icon: Tag,
        category: 'بازاریابی',
        featureKey: 'coupons',
      },
      {
        title: 'ویژگی‌ها و متغیرها',
        description: 'مدیریت رنگ‌ها، سایزها، گارانتی و مشخصات فنی کالاها',
        keywords: ['ویژگی', 'مشخصات', 'رنگ', 'سایز', 'attribute', 'متغیر', 'تنوع'],
        href: '/attributes',
        icon: Palette,
        category: 'محصولات',
        featureKey: 'attributes',
      },
      {
        title: 'سلسله‌مراتب دسته‌بندی‌ها',
        description: 'سازماندهی دسته‌بندی‌های تودرتو و سئوی گروه‌های کالایی',
        keywords: ['دسته‌بندی', 'دسته', 'گروه کالا', 'category', 'سلسله مراتب'],
        href: '/categories',
        icon: FolderTree,
        category: 'محصولات',
      },
      {
        title: 'وبلاگ و مقالات آموزشی',
        description: 'انتشار مقالات سئو، اخبار، نقد و بررسی و راهنماهای خرید',
        keywords: ['وبلاگ', 'مقاله', 'نوشته', 'پست', 'blog', 'محتوا', 'سئو'],
        href: '/admin/blog',
        icon: BookOpen,
        category: 'محتوا',
        featureKey: 'blog',
      },
    ],
    [],
  );

  // Search results calculation
  const searchResults: SearchResultsData | null = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedOrders = (orderStats?.recentOrders || []).filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q),
    );

    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)),
    );

    const matchedCoupons = isEnabled('coupons')
      ? coupons.filter(
          (c) =>
            c.code.toLowerCase().includes(q) ||
            (c.description && c.description.toLowerCase().includes(q)),
        )
      : [];

    const matchedActions = allQuickActions
      .filter((a) => !a.featureKey || isEnabled(a.featureKey))
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.keywords && a.keywords.some((k) => k.toLowerCase().includes(q))),
      );

    return {
      orders: matchedOrders,
      products: matchedProducts,
      coupons: matchedCoupons,
      actions: matchedActions,
      totalCount:
        matchedOrders.length +
        matchedProducts.length +
        matchedCoupons.length +
        matchedActions.length,
    };
  }, [searchQuery, orderStats?.recentOrders, products, coupons, allQuickActions, isEnabled]);

  const displayedOrders = orderStats?.recentOrders || [];

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 font-sans" dir="rtl">
      <Header title="پیشخوان مدیریت" />

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        <DashboardHeader ordersToFulfill={ordersToFulfill} />

        {/* Global Instant Search Bar */}
        <DashboardSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
        />

        {/* Adaptive KPI Cards */}
        <DashboardKpis
          statsLoading={statsLoading}
          totalRevenue={totalRevenue}
          totalOrders={totalOrders}
          averageOrderValue={averageOrderValue}
          ordersToFulfill={ordersToFulfill}
          pendingCount={pendingCount}
          processingCount={processingCount}
          productsLoading={productsLoading}
          lowStockProducts={lowStockProducts}
          outOfStockCount={outOfStockCount}
          couponsLoading={couponsLoading}
          activeCoupons={activeCoupons}
          totalCouponsCount={coupons.length}
          walletStats={walletData?.stats}
          walletLoading={walletLoading}
          unreadNotificationsCount={unreadNotifications}
          activeFlashDeal={activeFlashDeal}
        />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Orders & Shortcuts */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
            <DashboardOrdersCard
              statsLoading={statsLoading}
              displayedOrders={displayedOrders}
            />
            <DashboardShortcuts />
          </div>

          {/* Right Column: Inventory + Active Promo/Marketing Widget + Database Snapshot */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 sm:space-y-8">
            <DashboardInventoryCard
              productsLoading={productsLoading}
              lowStockProducts={lowStockProducts}
            />

            {/* Dynamic Promo / Marketing Card */}
            {isEnabled('coupons') ? (
              <DashboardPromosCard
                couponsLoading={couponsLoading}
                activeCoupons={activeCoupons}
              />
            ) : isEnabled('flashDeals') && activeFlashDeal ? (
              <Card className="shadow-2xs border-border/70 font-sans" dir="rtl">
                <CardHeader className="pb-3 px-4 sm:px-6 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>کمپین فروش شگفت‌انگیز</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {activeFlashDeal.title}
                    </CardDescription>
                  </div>
                  <Link href="/flash-deals">
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary h-7 px-2">
                      مدیریت
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-5 space-y-3">
                  <div className="p-3 rounded-xl border border-amber-200/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-foreground">
                      <span>تعداد اقلام حراج:</span>
                      <span className="font-sans">{activeFlashDeal.items?.length || 0} کالا</span>
                    </div>
                    {activeFlashDeal.badgeText && (
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        نشان: {activeFlashDeal.badgeText}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : isEnabled('wallet') && walletData ? (
              <Card className="shadow-2xs border-border/70 font-sans" dir="rtl">
                <CardHeader className="pb-3 px-4 sm:px-6 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <Wallet className="w-4 h-4 text-blue-600" />
                      <span>اعتبار و کیف‌پول مشتریان</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      خلاصه دارایی‌ها و تراکنش‌های سامانه
                    </CardDescription>
                  </div>
                  <Link href="/wallets">
                    <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary h-7 px-2">
                      مشاهده
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-5 space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">کل موجودی نزد کاربران</span>
                    <span className="font-bold text-foreground font-sans">
                      {api ? walletData.stats.totalSystemBalance.toLocaleString('fa-IR') : '۰'} تومان
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-muted-foreground">تعداد کیف‌پول‌ها</span>
                    <span className="font-bold text-foreground font-sans">
                      {walletData.stats.totalWalletsCount}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Snapshot Card (Filtered by active features) */}
            <DashboardSnapshotCard
              productsCount={products.length}
              variableCount={variableCount}
              totalVariants={totalVariants}
              simpleCount={simpleCount}
              attributesCount={attributes.length}
              blogPostsCount={blogPosts.length}
              mediaItemsCount={mediaItems.length}
              totalWalletsCount={walletData?.stats?.totalWalletsCount}
              unreadNotificationsCount={unreadNotifications}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
