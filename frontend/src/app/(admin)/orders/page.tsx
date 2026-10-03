'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { Order, OrderStatus } from '@/types';
import { OrdersKpis } from '@/components/admin/orders/orders-kpis';
import { OrdersToolbar } from '@/components/admin/orders/orders-toolbar';
import { OrdersTable } from '@/components/admin/orders/orders-table';
import { OrdersMobileList } from '@/components/admin/orders/orders-mobile-list';
import { OrdersDeleteDialog } from '@/components/admin/orders/orders-delete-dialog';

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = React.useState<string>('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deleteOrder, setDeleteOrder] = React.useState<Order | null>(null);

  const { data: stats } = useQuery({
    queryKey: ['order-stats'],
    queryFn: () => api.getOrderStats(),
  });

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', selectedStatus, searchTerm],
    queryFn: () =>
      api.getOrders({
        status: selectedStatus === 'ALL' ? undefined : (selectedStatus as OrderStatus),
        search: searchTerm || undefined,
        limit: 50,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteOrder(id),
    onSuccess: () => {
      toast.success('سفارش با موفقیت حذف شد');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
      setDeleteOrder(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'خطا در حذف سفارش');
    },
  });

  const orders: Order[] = Array.isArray(ordersData)
    ? ordersData
    : (ordersData as any)?.data || [];

  return (
    <div className="space-y-8 pb-16 font-sans" dir="rtl">
      <Header title="سفارش‌ها و مرسولات" />

      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        <OrdersKpis stats={stats} />

        <OrdersToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          totalOrdersCount={orders.length}
        />

        <OrdersMobileList
          orders={orders}
          isLoading={isLoading}
          onDeleteClick={(order) => setDeleteOrder(order)}
        />

        <OrdersTable
          orders={orders}
          isLoading={isLoading}
          onDeleteClick={(order) => setDeleteOrder(order)}
        />
      </div>

      <OrdersDeleteDialog
        order={deleteOrder}
        onClose={() => setDeleteOrder(null)}
        onConfirmDelete={(id) => deleteMutation.mutate(id)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
