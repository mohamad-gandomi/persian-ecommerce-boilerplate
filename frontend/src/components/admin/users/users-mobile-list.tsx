'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Phone, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';

interface UsersMobileListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersMobileList({
  users,
  onEdit,
  onDelete,
}: UsersMobileListProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-3 md:hidden font-sans" dir="rtl">
      {users.map((user) => {
        const initials = `${user.firstName?.[0] || 'U'}${user.lastName?.[0] || ''}`.toUpperCase();
        const addressCount = user._count?.addresses || user.addresses?.length || 0;

        return (
          <div
            key={user.id}
            onClick={() => router.push(`/users/${user.id}`)}
            className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all cursor-pointer space-y-3 text-right"
          >
            {/* Card Header: Avatar + Name + Role Badge */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-wood-200 dark:bg-wood-950 text-wood-900 dark:text-wood-200 text-sm font-bold flex items-center justify-center shrink-0 border border-wood-300 shadow-2xs font-sans">
                {initials}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                    className="text-[10px] shrink-0 font-sans"
                  >
                    {user.role === 'ADMIN' ? 'مدیر' : 'مشتری'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground font-sans truncate dir-ltr text-right">
                  {user.email}
                </div>
              </div>
            </div>

            {/* Card Middle: Phone & Saved Addresses */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground font-sans dir-ltr truncate">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{user.phone || 'بدون شماره'}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border/60 font-sans">
                  <MapPin className="w-3 h-3 text-primary shrink-0" />
                  <span>{addressCount} نشانی</span>
                </span>
              </div>
            </div>

            {/* Card Footer: Status Indicator + Joined Date + Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.isActive ? 'bg-emerald-500' : 'bg-destructive'
                    }`}
                  />
                  <span className="font-medium text-foreground">
                    {user.isActive ? 'فعال' : 'معلق'}
                  </span>
                </div>
                <span>•</span>
                <span>عضویت: {formatDate(user.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(user);
                  }}
                  title="ویرایش سریع کاربر"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(user);
                  }}
                  title="حذف کاربر"
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
