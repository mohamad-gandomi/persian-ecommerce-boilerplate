'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Truck, CreditCard, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OrderStatus, PaymentStatus } from '@/types';
import { OrderDetailHeader } from '@/components/admin/orders/detail/order-detail-header';
import { OrderItemsTab } from '@/components/admin/orders/detail/order-items-tab';
import { OrderShippingTab } from '@/components/admin/orders/detail/order-shipping-tab';
import { OrderPaymentTab } from '@/components/admin/orders/detail/order-payment-tab';
import { OrderTimelineTab } from '@/components/admin/orders/detail/order-timeline-tab';
import { OrderDetailDeleteModal } from '@/components/admin/orders/detail/order-detail-delete-modal';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = params.id as string;

  const [activeTab, setActiveTab] = React.useState('overview');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [status, setStatus] = React.useState<OrderStatus>('PENDING');
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>('PENDING');
  const [carrier, setCarrier] = React.useState('');
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [trackingUrl, setTrackingUrl] = React.useState('');
  const [internalNotes, setInternalNotes] = React.useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.getOrder(orderId),
    enabled: !!orderId,
  });

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
      setPaymentStatus(order.paymentStatus);
      setCarrier(order.shippingCarrier || '');
      setTrackingNumber(order.trackingNumber || '');
      setTrackingUrl(order.trackingUrl || '');
      setInternalNotes(order.internalNotes || '');
    }
  }, [order]);

  const updateOrderMutation = useMutation({
    mutationFn: (payload: any) => api.updateOrder(orderId, payload),
    onSuccess: () => {
      toast.success('جزئیات سفارش با موفقیت به‌روزرسانی شد');
      ['order', 'orders', 'order-stats'].forEach((k) => queryClient.invalidateQueries({ queryKey: [k] }));
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در به‌روزرسانی سفارش'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: OrderStatus) => api.updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      toast.success('وضعیت مرحله سفارش تغییر یافت');
      ['order', 'orders', 'order-stats'].forEach((k) => queryClient.invalidateQueries({ queryKey: [k] }));
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در تغییر وضعیت سفارش'),
  });

  const deleteOrderMutation = useMutation({
    mutationFn: () => api.deleteOrder(orderId),
    onSuccess: () => {
      toast.success('سفارش با موفقیت حذف شد');
      ['orders', 'order-stats'].forEach((k) => queryClient.invalidateQueries({ queryKey: [k] }));
      router.replace('/orders');
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف سفارش'),
  });

  const handleSaveAll = () => {
    if (order && status !== order.status) {
      updateStatusMutation.mutate(status);
    }
    updateOrderMutation.mutate({
      paymentStatus,
      shippingCarrier: carrier || undefined,
      trackingNumber: trackingNumber || undefined,
      trackingUrl: trackingUrl || undefined,
      internalNotes: internalNotes || undefined,
    });
  };

  if (isLoading || !order) {
    return (
      <div className="space-y-6 font-sans" dir="rtl">
        <Header title="جزئیات سفارش" />
        <div className="p-12 text-center text-muted-foreground text-sm">در حال دریافت اطلاعات سفارش...</div>
      </div>
    );
  }

  const isSaving = updateOrderMutation.isPending || updateStatusMutation.isPending;

  return (
    <div className="space-y-6 pb-20 font-sans" dir="rtl">
      <Header title={`سفارش ${order.orderNumber}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <OrderDetailHeader
          order={order}
          onSave={handleSaveAll}
          onDelete={() => setIsDeleteDialogOpen(true)}
          isSaving={isSaving}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" dir="rtl">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1.5 bg-muted/80 rounded-xl border border-border gap-1" dir="ltr">
            <TabsTrigger value="timeline" className="gap-2 py-2 text-xs font-semibold rounded-lg font-sans">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>مراحل سفارش و یادداشت</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2 py-2 text-xs font-semibold rounded-lg font-sans">
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span>وضعیت پرداخت و تراکنش</span>
            </TabsTrigger>
            <TabsTrigger value="shipping" className="gap-2 py-2 text-xs font-semibold rounded-lg font-sans">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span>روش و وضعیت ارسال</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="gap-2 py-2 text-xs font-semibold rounded-lg font-sans">
              <Package className="w-3.5 h-3.5 shrink-0" />
              <span>اقلام و خلاصه سفارش</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="m-0">
            <OrderItemsTab order={order} />
          </TabsContent>

          <TabsContent value="shipping" className="m-0">
            <OrderShippingTab
              order={order}
              carrier={carrier}
              setCarrier={setCarrier}
              trackingNumber={trackingNumber}
              setTrackingNumber={setTrackingNumber}
              trackingUrl={trackingUrl}
              setTrackingUrl={setTrackingUrl}
              onSave={handleSaveAll}
              isSaving={isSaving}
            />
          </TabsContent>

          <TabsContent value="payments" className="m-0">
            <OrderPaymentTab
              order={order}
              paymentStatus={paymentStatus}
              setPaymentStatus={setPaymentStatus}
              onSave={handleSaveAll}
              isSaving={isSaving}
            />
          </TabsContent>

          <TabsContent value="timeline" className="m-0">
            <OrderTimelineTab
              order={order}
              status={status}
              setStatus={setStatus}
              internalNotes={internalNotes}
              setInternalNotes={setInternalNotes}
              onSave={handleSaveAll}
              isSaving={isSaving}
            />
          </TabsContent>
        </Tabs>
      </div>

      <OrderDetailDeleteModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        orderNumber={order.orderNumber}
        onConfirmDelete={() => deleteOrderMutation.mutate()}
        isDeleting={deleteOrderMutation.isPending}
      />
    </div>
  );
}
