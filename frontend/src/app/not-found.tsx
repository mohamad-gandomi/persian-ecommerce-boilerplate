import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-6 text-center font-sans" dir="rtl">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-primary text-primary-foreground flex items-center justify-center font-serif text-2xl font-bold tracking-widest shadow-lg">
          404
        </div>

        <div className="space-y-2">
          <span className="text-xs font-sans tracking-widest text-primary font-semibold block">
            خطای ۴۰۴ &middot; صفحه یافت نشد
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            صفحه مورد نظر یافت نشد
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            صفحه‌ای که به دنبال آن بودید وجود ندارد یا به نشانی دیگری منتقل شده است.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            asChild
            className="h-11 px-6 rounded-xl font-medium text-xs shadow-sm cursor-pointer"
          >
            <Link href="/admin" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span>بازگشت به پیشخوان مدیریت</span>
            </Link>
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground/70 font-sans pt-6">
          سامانه مدیریت فروشگاه آنلاین &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
