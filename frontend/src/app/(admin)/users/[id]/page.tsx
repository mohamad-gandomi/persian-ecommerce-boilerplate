'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCheck, MapPin, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { isValidIranianNationalId } from '@/lib/jalali';
import { Address, Role } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { UserDetailHeader } from '@/components/admin/users/detail/user-detail-header';
import { UserProfileTab } from '@/components/admin/users/detail/user-profile-tab';
import { UserAddressesTab } from '@/components/admin/users/detail/user-addresses-tab';
import { UserSecurityTab } from '@/components/admin/users/detail/user-security-tab';
import { UserAddressModal } from '@/components/admin/users/detail/user-address-modal';
import { UserAddressDeleteModal } from '@/components/admin/users/detail/user-address-delete-modal';
import { UserDetailDeleteModal } from '@/components/admin/users/detail/user-detail-delete-modal';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = params.id;
  const [activeTab, setActiveTab] = React.useState('profile');

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
  });

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [nationalId, setNationalId] = React.useState('');
  const [birthDate, setBirthDate] = React.useState<Date | null>(null);
  const [role, setRole] = React.useState<Role>('CUSTOMER');
  const [isActive, setIsActive] = React.useState(true);
  const [password, setPassword] = React.useState('');

  const [addressModal, setAddressModal] = React.useState<{ isOpen: boolean; mode: 'CREATE' | 'EDIT'; address?: Address | null }>({ isOpen: false, mode: 'CREATE' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteAddrId, setDeleteAddrId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setNationalId(user.nationalId || '');
      setBirthDate(user.birthDate ? new Date(user.birthDate) : null);
      setRole(user.role || 'CUSTOMER');
      setIsActive(user.isActive ?? true);
      setPassword('');
    }
  }, [user]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['user', userId] });
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateUser(userId, data),
    onSuccess: (updated) => { toast.success(`پروفایل ${updated.firstName} ${updated.lastName} ذخیره شد`); invalidate(); setPassword(''); },
    onError: (err: Error) => toast.error(err.message || 'خطا در ذخیره پروفایل'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteUser(userId),
    onSuccess: () => { toast.success('حساب کاربر حذف شد'); queryClient.invalidateQueries({ queryKey: ['users'] }); router.push('/users'); },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف کاربر'),
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: any) => api.addUserAddress(userId, data),
    onSuccess: () => { toast.success('نشانی جدید افزوده شد'); invalidate(); setAddressModal({ isOpen: false, mode: 'CREATE' }); },
    onError: (err: Error) => toast.error(err.message || 'خطا در افزودن نشانی'),
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, data }: { addressId: string; data: any }) => api.updateUserAddress(userId, addressId, data),
    onSuccess: () => { toast.success('نشانی بروزرسانی شد'); invalidate(); setAddressModal({ isOpen: false, mode: 'CREATE' }); },
    onError: (err: Error) => toast.error(err.message || 'خطا در بروزرسانی نشانی'),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addrId: string) => api.deleteUserAddress(userId, addrId),
    onSuccess: () => { toast.success('نشانی حذف شد'); invalidate(); setDeleteAddrId(null); },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف نشانی'),
  });

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error('نام، نام خانوادگی و ایمیل الزامی هستند');
      return;
    }

    const cleanNational = nationalId.trim();
    if (cleanNational && !isValidIranianNationalId(cleanNational)) {
      toast.error('کد ملی وارد شده طبق الگوریتم رسمی نامعتبر است (باید ۱۰ رقم معتبر باشد)');
      return;
    }

    const payload: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      nationalId: cleanNational || null,
      birthDate: birthDate ? birthDate.toISOString() : null,
      role,
      isActive,
    };
    if (password.trim()) payload.password = password.trim();
    updateMutation.mutate(payload);
  };

  if (isLoading) return <div className="space-y-8 pb-16 font-sans" dir="rtl"><Header title="جزئیات کاربر" /><div className="py-24 text-center text-sm text-muted-foreground">در حال بارگذاری پروفایل مشتری...</div></div>;
  if (isError || !user) return <div className="space-y-8 pb-16 font-sans" dir="rtl"><Header title="کاربر یافت نشد" /><div className="py-24 text-center space-y-4"><p className="text-base text-destructive font-semibold">{error instanceof Error ? error.message : 'کاربر مورد نظر یافت نشد'}</p><Button asChild variant="outline"><Link href="/users">بازگشت به فهرست کاربران</Link></Button></div></div>;

  const addressList = user.addresses || [];

  return (
    <div className="space-y-8 pb-20 font-sans" dir="rtl">
      <Header title={`کاربر: ${user.firstName} ${user.lastName}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <UserDetailHeader user={user} isSaving={updateMutation.isPending} onSave={() => handleSaveProfile()} onOpenDelete={() => setIsDeleteDialogOpen(true)} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full h-auto p-1.5 bg-muted/80 rounded-xl border border-border gap-1 font-sans">
            <TabsTrigger value="profile" className="gap-2 py-2 text-xs font-semibold rounded-lg font-sans">
              <UserCheck className="w-3.5 h-3.5 shrink-0 text-primary" />
              <span>پروفایل و حساب کاربری</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2 py-2 text-xs font-semibold rounded-lg font-sans">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-wood-700" />
              <span>نشانی‌های تحویل سفارش</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-wood-200 text-wood-900 rounded-full font-bold font-sans">{addressList.length}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 py-2 text-xs font-semibold rounded-lg font-sans">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>امنیت و متاداده</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <UserProfileTab
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              nationalId={nationalId}
              setNationalId={setNationalId}
              birthDate={birthDate}
              setBirthDate={setBirthDate}
              role={role}
              setRole={setRole}
              password={password}
              setPassword={setPassword}
              isSaving={updateMutation.isPending}
              onSave={handleSaveProfile}
            />
          </TabsContent>

          <TabsContent value="addresses">
            <UserAddressesTab addresses={addressList} onOpenAdd={() => setAddressModal({ isOpen: true, mode: 'CREATE' })} onOpenEdit={(a) => setAddressModal({ isOpen: true, mode: 'EDIT', address: a })} onOpenDelete={(id) => setDeleteAddrId(id)} />
          </TabsContent>

          <TabsContent value="security">
            <UserSecurityTab user={user} addresses={addressList} isUpdating={updateMutation.isPending} onToggleStatus={() => { const next = !user.isActive; setIsActive(next); updateMutation.mutate({ isActive: next }); }} onOpenDelete={() => setIsDeleteDialogOpen(true)} />
          </TabsContent>
        </Tabs>
      </div>

      <UserAddressModal
        isOpen={addressModal.isOpen}
        mode={addressModal.mode}
        user={user}
        address={addressModal.address}
        isPending={addAddressMutation.isPending || updateAddressMutation.isPending}
        onClose={() => setAddressModal({ isOpen: false, mode: 'CREATE' })}
        onSubmit={(data) => addressModal.mode === 'CREATE' ? addAddressMutation.mutate(data) : addressModal.address && updateAddressMutation.mutate({ addressId: addressModal.address.id, data })}
      />

      <UserAddressDeleteModal
        isOpen={Boolean(deleteAddrId)}
        isPending={deleteAddressMutation.isPending}
        onClose={() => setDeleteAddrId(null)}
        onConfirm={() => deleteAddrId && deleteAddressMutation.mutate(deleteAddrId)}
      />

      <UserDetailDeleteModal
        user={user}
        addressCount={addressList.length}
        isOpen={isDeleteDialogOpen}
        isPending={deleteMutation.isPending}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}
