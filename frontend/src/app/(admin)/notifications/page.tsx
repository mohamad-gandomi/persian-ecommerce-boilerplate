'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { api, NotificationItem } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { NotificationsKpis } from '@/components/admin/notifications/notifications-kpis';
import {
  NotificationsToolbar,
  NotificationTypeFilter,
} from '@/components/admin/notifications/notifications-toolbar';
import { NotificationsTable } from '@/components/admin/notifications/notifications-table';
import { NotificationsMobileList } from '@/components/admin/notifications/notifications-mobile-list';
import { NotificationDeleteModal } from '@/components/admin/notifications/notification-delete-modal';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<NotificationTypeFilter>('ALL');
  const [unreadOnly, setUnreadOnly] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState<NotificationItem | null>(null);

  // 1. Fetch unread count
  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ['admin-notifications-unread-count'],
    queryFn: () => api.getAdminUnreadCount(),
    refetchInterval: 15000,
  });

  // 2. Fetch notifications list
  const {
    data: notifData,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['admin-notifications', searchTerm, selectedType, unreadOnly],
    queryFn: () =>
      api.getAdminNotifications({
        search: searchTerm.trim() || undefined,
        type: selectedType === 'ALL' ? undefined : selectedType,
        unreadOnly: unreadOnly ? true : undefined,
        limit: 100,
      }),
    refetchInterval: 15000,
  });

  const notifications: NotificationItem[] = React.useMemo(() => {
    if (!notifData) return [];
    if (Array.isArray(notifData)) return notifData;
    if (Array.isArray((notifData as any).data)) return (notifData as any).data;
    return [];
  }, [notifData]);

  // 3. Mark single as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-list'] });
    },
    onError: () => {
      toast.error('خطا در به‌روزرسانی وضعیت اعلان');
    },
  });

  // 4. Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: () => api.markAllAdminNotificationsAsRead(),
    onSuccess: () => {
      toast.success('تمامی اعلان‌ها به عنوان خوانده‌شده علامت‌گذاری شدند');
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-list'] });
    },
    onError: () => {
      toast.error('خطا در خوانده شدن اعلان‌ها');
    },
  });

  // 5. Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteNotification(id),
    onSuccess: () => {
      toast.success('اعلان با موفقیت حذف شد');
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-list'] });
      setDeleteItem(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'خطا در حذف اعلان');
    },
  });

  // 6. Compute statistics for KPIs
  const stats = React.useMemo(() => {
    let orderCount = 0;
    let walletCount = 0;

    notifications.forEach((n) => {
      if (n.type === 'ORDER') orderCount++;
      if (n.type === 'WALLET') walletCount++;
    });

    return {
      total: notifications.length,
      unread: unreadCount,
      orderCount,
      walletCount,
    };
  }, [notifications, unreadCount]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background font-sans" dir="rtl">
      <Header title="مرکز اعلان‌ها" />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* KPIs */}
        <NotificationsKpis
          total={stats.total}
          unread={stats.unread}
          orderCount={stats.orderCount}
          walletCount={stats.walletCount}
        />

        {/* Toolbar */}
        <NotificationsToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onSelectedTypeChange={setSelectedType}
          unreadOnly={unreadOnly}
          onUnreadOnlyChange={setUnreadOnly}
          onMarkAllRead={() => markAllReadMutation.mutate()}
          isMarkingAllRead={markAllReadMutation.isPending}
          unreadCount={unreadCount}
        />

        {/* Content list or Loading / Empty states */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground font-sans">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">در حال بارگذاری اعلان‌های سیستم...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl bg-card border-dashed font-sans">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Bell className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground text-base mb-1">
              هیچ اعلانی یافت نشد
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-4">
              {searchTerm || selectedType !== 'ALL' || unreadOnly
                ? 'هیچ اعلانی با فیلترهای انتخابی یا عبارت جستجو همخوانی ندارد.'
                : 'در حال حاضر هیچ اعلانی در سیستم ثبت نشده است.'}
            </p>
            {(searchTerm || selectedType !== 'ALL' || unreadOnly) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('ALL');
                  setUnreadOnly(false);
                }}
                className="gap-2 font-sans"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>پاک‌سازی فیلترها</span>
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <NotificationsTable
              notifications={notifications}
              onMarkRead={(id) => markAsReadMutation.mutate(id)}
              onDelete={(item) => setDeleteItem(item)}
            />

            {/* Mobile Cards List View */}
            <NotificationsMobileList
              notifications={notifications}
              onMarkRead={(id) => markAsReadMutation.mutate(id)}
              onDelete={(item) => setDeleteItem(item)}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <NotificationDeleteModal
        notification={deleteItem}
        isOpen={Boolean(deleteItem)}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteItem(null)}
        onConfirm={(item) => deleteMutation.mutate(item.id)}
      />
    </div>
  );
}
