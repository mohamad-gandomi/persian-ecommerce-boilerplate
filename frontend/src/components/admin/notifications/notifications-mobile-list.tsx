'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Check, Trash2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NotificationItem } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { getTypeBadge, getPriorityBadge } from './notifications-table';

interface NotificationsMobileListProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onDelete: (notification: NotificationItem) => void;
}

export function NotificationsMobileList({
  notifications,
  onMarkRead,
  onDelete,
}: NotificationsMobileListProps) {
  const router = useRouter();

  const handleCardClick = (item: NotificationItem) => {
    if (!item.isRead) {
      onMarkRead(item.id);
    }
    if (item.link) {
      router.push(item.link);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:hidden font-sans" dir="rtl">
      {notifications.map((item) => {
        const typeInfo = getTypeBadge(item.type);
        const priorityBadge = getPriorityBadge(item.priority);

        return (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 text-right shadow-2xs ${
              !item.isRead
                ? 'bg-card border-primary/40 ring-1 ring-primary/20'
                : 'bg-card border-border hover:border-primary/40'
            }`}
          >
            {/* Card Header: Type Badge + Priority + Time */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${typeInfo.className}`}
                >
                  {typeInfo.icon}
                  <span>{typeInfo.label}</span>
                </span>
                {priorityBadge}
                {!item.isRead && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 px-1.5 py-0"
                  >
                    جدید
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-sans shrink-0">
                <Clock className="w-3 h-3 text-muted-foreground/60" />
                <span>
                  {new Date(item.createdAt).toLocaleTimeString('fa-IR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Card Body: Title + Message */}
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-foreground">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.message}
              </p>
            </div>

            {/* Card Link: Destination button if available */}
            {item.link && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!item.isRead) onMarkRead(item.id);
                    router.push(item.link!);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-primary/10 hover:bg-primary/15 text-primary text-xs font-semibold transition-colors"
                >
                  <span>رفتن به صفحه مرتبط</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Card Footer: Detailed Date + Action Buttons */}
            <div
              className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[11px] text-muted-foreground/80 font-sans">
                {formatDateTime(item.createdAt)}
              </span>

              <div className="flex items-center gap-1">
                {!item.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkRead(item.id)}
                    className="h-7 px-2 text-[11px] gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  >
                    <Check className="w-3 h-3" />
                    <span>خوانده شد</span>
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(item)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
