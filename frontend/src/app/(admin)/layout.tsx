import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/admin/sidebar';
import { AdminAuthGuard } from '@/components/admin/admin-auth-guard';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('auth_role')?.value;

  if (role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-background text-foreground font-sans" dir="rtl">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 lg:pr-64">
          <main className="flex-1 pb-12">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
