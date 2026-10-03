'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { ShippingMethodOption } from '@/types';
import { ShippingMethodModal } from '@/components/admin/shipping/shipping-method-modal';
import { ShippingMethodDeleteModal } from '@/components/admin/shipping/shipping-method-delete-modal';
import { ShippingMethodsTable } from '@/components/admin/shipping/shipping-methods-table';

export default function ShippingAdminPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingMethod, setEditingMethod] = React.useState<ShippingMethodOption | null>(null);
  const [deletingMethod, setDeletingMethod] = React.useState<ShippingMethodOption | null>(null);

  const { data: methods = [], isLoading } = useQuery({
    queryKey: ['admin-shipping-methods'],
    queryFn: () => api.getAdminShippingMethods(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.createShippingMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-methods'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      toast.success('روش ارسال با موفقیت ایجاد شد');
      setIsModalOpen(false);
      setEditingMethod(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'خطا در ایجاد روش ارسال');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.updateShippingMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-methods'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      toast.success('روش ارسال با موفقیت به‌روزرسانی شد');
      setIsModalOpen(false);
      setEditingMethod(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'خطا در به‌روزرسانی روش ارسال');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteShippingMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-methods'] });
      queryClient.invalidateQueries({ queryKey: ['shipping-methods'] });
      toast.success('روش ارسال با موفقیت حذف شد');
      setDeletingMethod(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'خطا در حذف روش ارسال');
    },
  });

  const handleSubmitModal = (payload: any) => {
    if (!payload.name) {
      toast.error('لطفاً عنوان روش ارسال را وارد کنید');
      return;
    }
    if (editingMethod) {
      updateMutation.mutate({ id: editingMethod.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteRequest = (id: string, methodName: string) => {
    const found = methods.find((m) => m.id === id) || { id, name: methodName } as ShippingMethodOption;
    setDeletingMethod(found);
  };

  return (
    <div className="space-y-8 pb-16 font-sans" dir="rtl">
      <Header title="روش‌های ارسال کالا" />

      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">روش‌های تعریف‌شده ارسال سفارشات</h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-light">
              تعیین تعرفه‌ها، شرکت‌های پستی، پیک موتوری و تحویل حضوری فروشگاه.
            </p>
          </div>
          <Button
            onClick={() => { setEditingMethod(null); setIsModalOpen(true); }}
            className="h-9 text-xs gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن روش ارسال جدید</span>
          </Button>
        </div>

        <ShippingMethodsTable
          methods={methods}
          isLoading={isLoading}
          onEdit={(m) => { setEditingMethod(m); setIsModalOpen(true); }}
          onDelete={handleDeleteRequest}
          onToggleActive={(id, active) => updateMutation.mutate({ id, data: { isActive: active } })}
          onSetDefault={(id) => updateMutation.mutate({ id, data: { isDefault: true } })}
        />
      </div>

      <ShippingMethodModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingMethod={editingMethod}
        onSubmit={handleSubmitModal}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <ShippingMethodDeleteModal
        isOpen={Boolean(deletingMethod)}
        method={deletingMethod}
        onClose={() => setDeletingMethod(null)}
        onConfirm={() => deletingMethod && deleteMutation.mutate(deletingMethod.id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
