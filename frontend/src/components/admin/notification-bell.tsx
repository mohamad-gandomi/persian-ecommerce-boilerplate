'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCheck,
  ShoppingCart,
  Wallet,
  AlertTriangle,
  FileText,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { api, API_BASE, NotificationItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function NotificationBell() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);

  // 1. Fetch unread count (polls every 15s)
  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ['admin-notifications-unread-count'],
    queryFn: () => api.getAdminUnreadCount(),
    refetchInterval: 15000,
  });

  // 2. Fetch latest notifications when popover is open
  const { data: notifData, isLoading } = useQuery({
    queryKey: ['admin-notifications-list'],
    queryFn: () => api.getAdminNotifications({ limit: 8 }),
    enabled: isOpen,
    refetchInterval: isOpen ? 10000 : false,
  });

  // Handle both array directly or { data: items } from interceptor
  const notifications: NotificationItem[] = React.useMemo(() => {
    if (!notifData) return [];
    if (Array.isArray(notifData)) return notifData;
    if (Array.isArray((notifData as any).data)) return (notifData as any).data;
    return [];
  }, [notifData]);

  // 3. Realtime stream via Server-Sent Events (SSE)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    let es: EventSource | null = null;
    try {
      es = new EventSource(`${API_BASE}/notifications/stream`);

      es.addEventListener('notification', (e) => {
        try {
          const item: NotificationItem = JSON.parse(e.data);
          toast.info(item.title, {
            description: item.message,
            duration: 6000,
          });
          queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
          queryClient.invalidateQueries({ queryKey: ['admin-notifications-list'] });
        } catch (err) {
          console.error('Error parsing SSE payload', err);
        }
      });
    } catch (err) {
      console.warn('SSE connection failed, falling back to polling', err);
    }

    return () => {
      if (es) es.close();
    };
  }, [queryClient]);

  // Mark single as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-list'] });
    },
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: () => api.markAllAdminNotificationsAsRead(),
    onSuccess: () => {
      toast.success('تمامی اعلان‌ها خوانده شدند');
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['admin-notifications-list'] });
    },
  });

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id);
    }
    if (item.link) {
      setIsOpen(false);
      router.push(item.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER':
        return <ShoppingCart className="w-4 h-4 text-emerald-600" />;
      case 'WALLET':
        return <Wallet className="w-4 h-4 text-blue-600" />;
      case 'INVENTORY':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'BLOG':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-full border-border/70 hover:bg-accent text-muted-foreground hover:text-foreground"
          aria-label="اعلان‌های سیستم"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 font-sans shadow-xl border-border/80"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-foreground">اعلان‌های سامانه</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {unreadCount} خوانده‌نشده
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="h-7 text-[11px] gap-1 px-2 text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>خوانده شدن همه</span>
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">در حال بارگذاری اعلان‌ها...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center space-y-1">
              <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <div className="text-xs font-semibold text-muted-foreground">هیچ اعلانی ثبت نشده است</div>
              <div className="text-[11px] text-muted-foreground/70">رویدادهای جدید اینجا نمایش داده می‌شوند.</div>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3 transition-colors flex items-start gap-2.5 cursor-pointer hover:bg-muted/50 ${
                  !item.isRead ? 'bg-primary/5' : ''
                }`}
              >
                <div className="mt-0.5 p-1.5 rounded-lg bg-background border border-border/60 shadow-2xs shrink-0">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1 text-right">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-foreground truncate">{item.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0" dir="ltr">
                      {new Date(item.createdAt).toLocaleTimeString('fa-IR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {item.message}
                  </p>
                  {item.link && (
                    <div className="flex items-center gap-1 text-[10px] text-primary pt-0.5">
                      <span>مشاهده جزئیات</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
