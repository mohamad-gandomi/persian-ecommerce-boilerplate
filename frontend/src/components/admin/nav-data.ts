import {
  LayoutDashboard,
  Users,
  Bell,
  Settings,
  ShoppingBag,
  Wallet,
  Gift,
  Truck,
  Tag,
  Zap,
  Package,
  Palette,
  FolderTree,
  BookOpen,
  BookmarkCheck,
  Image as ImageIcon,
  UploadCloud,
  type LucideIcon,
} from 'lucide-react';
import { FeaturesConfig } from '@/types';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  featureKey?: keyof FeaturesConfig;
  onClick?: () => void;
}

// گروه ۱: مدیریت و سامانه (پیشخوان + کاربران + مرکز اعلان‌ها + تنظیمات سامانه)
export const systemNavItems: NavItem[] = [
  {
    title: 'پیشخوان مدیریت',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'کاربران و مشتریان',
    href: '/users',
    icon: Users,
  },
  {
    title: 'مرکز اعلان‌ها',
    href: '/notifications',
    icon: Bell,
    featureKey: 'notifications',
  },
  {
    title: 'تنظیمات سامانه',
    href: '/settings',
    icon: Settings,
  },
];

// گروه ۲: محصولات و کاتالوگ (محصولات + ویژگی‌ها + دسته‌بندی‌ها)
export const productNavItems: NavItem[] = [
  {
    title: 'محصولات',
    href: '/products',
    icon: Package,
  },
  {
    title: 'ویژگی‌ها و متغیرها',
    href: '/attributes',
    icon: Palette,
    featureKey: 'attributes',
  },
  {
    title: 'دسته‌بندی‌های محصولات',
    href: '/categories',
    icon: FolderTree,
  },
];

// گروه ۳: فروشگاه و سفارش‌ها (سفارش‌ها + کیف‌پول + سیستم معرف + ارسال + تخفیف + فروش شگفت‌انگیز)
export const shopNavItems: NavItem[] = [
  {
    title: 'سفارش‌ها',
    href: '/orders',
    icon: ShoppingBag,
  },
  {
    title: 'کیف‌پول‌ها',
    href: '/wallets',
    icon: Wallet,
    featureKey: 'wallet',
  },
  {
    title: 'سیستم معرف و پاداش',
    href: '/referrals',
    icon: Gift,
    featureKey: 'referral',
  },
  {
    title: 'روش‌های ارسال',
    href: '/shipping',
    icon: Truck,
  },
  {
    title: 'کدهای تخفیف',
    href: '/coupons',
    icon: Tag,
    featureKey: 'coupons',
  },
  {
    title: 'فروش شگفت‌انگیز',
    href: '/flash-deals',
    icon: Zap,
    featureKey: 'flashDeals',
  },
];

// گروه ۴: رسانه و پرونده‌ها
export const mediaNavItems: NavItem[] = [
  {
    title: 'کتابخانه رسانه',
    href: '/media',
    icon: ImageIcon,
  },
  {
    title: 'بارگذاری فایل جدید',
    href: '/media?action=upload',
    icon: UploadCloud,
  },
];

// گروه ۵: وبلاگ و مقالات
export const blogNavItems: NavItem[] = [
  {
    title: 'نوشته‌ها و مقالات',
    href: '/admin/blog',
    icon: BookOpen,
    featureKey: 'blog',
  },
  {
    title: 'دسته‌بندی‌های مقالات',
    href: '/admin/blog/categories',
    icon: BookmarkCheck,
    featureKey: 'blog',
  },
];
