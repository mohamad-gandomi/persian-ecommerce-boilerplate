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
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  onClick?: () => void;
}

export const shopNavItems: NavItem[] = [
  {
    title: 'سفارش‌ها',
    href: '/orders',
    icon: ShoppingBag,
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
  },
  {
    title: 'دسته‌بندی‌های مقالات',
    href: '/admin/blog/categories',
    icon: BookmarkCheck,
  },
];
