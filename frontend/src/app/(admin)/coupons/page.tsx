'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { Coupon } from '@/types';
import { CouponsToolbar } from '@/components/admin/coupons/coupons-toolbar';
import { CouponsTable } from '@/components/admin/coupons/coupons-table';
import { CouponsMobileList } from '@/components/admin/coupons/coupons-mobile-list';
import { CouponFormModal } from '@/components/admin/coupons/coupon-form-modal';
import { CouponDeleteModal } from '@/components/admin/coupons/coupon-delete-modal';

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<'ALL' | 'PERCENTAGE' | 'FIXED_AMOUNT'>('ALL');
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [editingCoupon, setEditingCoupon] = React.useState<Coupon | null>(null);
  const [deleteCoupon, setDeleteCoupon] = React.useState<Coupon | null>(null);
  const [formError, setFormError] = React.useState('');

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => api.getCoupons(),
  });

  const createCouponMutation = useMutation({
    mutationFn: (data: any) => api.createCoupon(data),
    onSuccess: () => {
      toast.success('کد تخفیف با موفقیت ایجاد شد');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setIsFormModalOpen(false);
      setEditingCoupon(null);
    },
    onError: (err: any) => setFormError(err.message || 'خطا در ایجاد کد تخفیف'),
  });

  const updateCouponMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateCoupon(id, data),
    onSuccess: () => {
      toast.success('کد تخفیف با موفقیت به‌روزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setIsFormModalOpen(false);
      setEditingCoupon(null);
    },
    onError: (err: any) => setFormError(err.message || 'خطا در به‌روزرسانی کد تخفیف'),
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (id: string) => api.deleteCoupon(id),
    onSuccess: () => {
      toast.success('کد تخفیف حذف شد');
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setDeleteCoupon(null);
    },
    onError: (err: any) => toast.error(err.message || 'خطا در حذف کد تخفیف'),
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`کد «${code}» کپی شد`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubmit = (payload: any) => {
    setFormError('');
    if (editingCoupon) {
      updateCouponMutation.mutate({ id: editingCoupon.id, data: payload });
    } else {
      createCouponMutation.mutate(payload);
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'ALL' ? true : c.discountType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 pb-16 font-sans" dir="rtl">
      <Header title="کدهای تخفیف و جشنواره" />

      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        <CouponsToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          totalCount={filteredCoupons.length}
          onCreateClick={() => { setEditingCoupon(null); setIsFormModalOpen(true); }}
        />

        <CouponsMobileList
          coupons={filteredCoupons}
          isLoading={isLoading}
          copiedCode={copiedCode}
          onCopy={handleCopy}
          onEdit={(c) => { setEditingCoupon(c); setIsFormModalOpen(true); }}
          onDeleteClick={(c) => setDeleteCoupon(c)}
        />

        <CouponsTable
          coupons={filteredCoupons}
          isLoading={isLoading}
          copiedCode={copiedCode}
          onCopy={handleCopy}
          onEdit={(c) => { setEditingCoupon(c); setIsFormModalOpen(true); }}
          onDeleteClick={(c) => setDeleteCoupon(c)}
          onToggleActive={(c) => updateCouponMutation.mutate({ id: c.id, data: { isActive: !c.isActive } })}
        />
      </div>

      <CouponFormModal
        isOpen={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        editingCoupon={editingCoupon}
        onSubmit={handleSubmit}
        isPending={createCouponMutation.isPending || updateCouponMutation.isPending}
        errorMsg={formError}
      />

      <CouponDeleteModal
        coupon={deleteCoupon}
        onClose={() => setDeleteCoupon(null)}
        onConfirmDelete={(id) => deleteCouponMutation.mutate(id)}
        isPending={deleteCouponMutation.isPending}
      />
    </div>
  );
}
