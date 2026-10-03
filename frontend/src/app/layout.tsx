import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from '@/components/providers';

const ravi = localFont({
  src: '../../public/fonts/ravi-vf.ttf',
  variable: '--font-ravi',
  display: 'swap',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'پیشخوان مدیریت فروشگاه آنلاین',
  description: 'سامانه جامع مدیریت کاتالوگ محصولات، سفارش‌ها و پیشخوان فروشگاهی',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${ravi.variable} ${ravi.className}`}>
      <body className={`${ravi.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
