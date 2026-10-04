import {
  Package,
  Palette,
  FolderTree,
  BookOpen,
  BookmarkCheck,
  Users,
  Image as ImageIcon,
  UploadCloud,
  ShoppingBag,
  Tag,
  Truck,
  Wallet,
  Gift,
  Zap,
  Settings,
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
  {
    title: 'کاربران و مشتریان',
    href: '/users',
    icon: Users,
  },
  {
    title: 'تنظیمات سامانه',
    href: '/settings',
    icon: Settings,
  },
];

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
