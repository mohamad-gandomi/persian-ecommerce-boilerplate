'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sliders } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { User } from '@/types';
import { Header } from '@/components/admin/header';
import { Card, CardContent } from '@/components/ui/card';
import { UsersKpis } from '@/components/admin/users/users-kpis';
import { UsersToolbar } from '@/components/admin/users/users-toolbar';
import { UsersMobileList } from '@/components/admin/users/users-mobile-list';
import { UsersTable } from '@/components/admin/users/users-table';
import { UserFormModal } from '@/components/admin/users/user-form-modal';
import { UserDeleteModal } from '@/components/admin/users/user-delete-modal';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<'ALL' | 'CUSTOMER' | 'ADMIN'>('ALL');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = React.useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  });

  const stats = React.useMemo(() => {
    let customerCount = 0, adminCount = 0, activeCount = 0;
    users.forEach((u) => {
      if (u.role === 'ADMIN') adminCount++;
      else customerCount++;
      if (u.isActive) activeCount++;
    });
    return { total: users.length, customers: customerCount, admins: adminCount, active: activeCount };
  }, [users]);

  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || u.firstName.toLowerCase().includes(q) || u.lastName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.toLowerCase().includes(q));
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['users'] });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createUser(data),
    onSuccess: (newUser) => { toast.success(`حساب کاربری ${newUser.firstName} ${newUser.lastName} ایجاد شد`); invalidate(); setIsCreateOpen(false); },
    onError: (err: Error) => toast.error(err.message || 'خطا در ایجاد حساب کاربری'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateUser(id, data),
    onSuccess: (updated) => { toast.success(`اطلاعات ${updated.firstName} ${updated.lastName} بروزرسانی شد`); invalidate(); setEditingUser(null); },
    onError: (err: Error) => toast.error(err.message || 'خطا در بروزرسانی کاربر'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => { toast.success('حساب کاربری برای همیشه حذف گردید'); invalidate(); setDeleteConfirmUser(null); },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف کاربر'),
  });

  return (
    <div className="space-y-8 pb-16 font-sans" dir="rtl">
      <Header title="مدیریت کاربران و مشتریان" />

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <UsersToolbar
          search={search}
          onSearchChange={setSearch}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          onOpenCreate={() => setIsCreateOpen(true)}
        />

        <UsersKpis {...stats} />

        {isLoading ? (
          <div className="py-20 text-center text-xs text-muted-foreground font-sans">در حال بارگذاری پروفایل‌های کاربری...</div>
        ) : filteredUsers.length === 0 ? (
          <Card className="py-16 text-center border-dashed font-sans">
            <CardContent className="space-y-3 max-w-sm mx-auto">
              <Sliders className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">حساب کاربری‌ای یافت نشد</h3>
                <p className="text-xs text-muted-foreground">{search || roleFilter !== 'ALL' ? 'موردی مطابق با فیلتر جستجوی شما یافت نشد.' : 'اولین حساب کاربری را ثبت کنید.'}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <UsersMobileList users={filteredUsers} onEdit={(u) => setEditingUser(u)} onDelete={(u) => setDeleteConfirmUser(u)} />
            <UsersTable users={filteredUsers} onEdit={(u) => setEditingUser(u)} onDelete={(u) => setDeleteConfirmUser(u)} />
          </>
        )}
      </div>

      <UserFormModal
        isOpen={isCreateOpen}
        mode="CREATE"
        isPending={createMutation.isPending}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(payload) => createMutation.mutate(payload)}
      />

      <UserFormModal
        isOpen={Boolean(editingUser)}
        mode="EDIT"
        user={editingUser}
        isPending={updateMutation.isPending}
        onClose={() => setEditingUser(null)}
        onSubmit={(payload) => editingUser && updateMutation.mutate({ id: editingUser.id, data: payload })}
      />

      <UserDeleteModal
        user={deleteConfirmUser}
        isOpen={Boolean(deleteConfirmUser)}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteConfirmUser(null)}
        onConfirm={(u) => deleteMutation.mutate(u.id)}
      />
    </div>
  );
}
