'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({
  users,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const router = useRouter();

  return (
    <Card className="hidden md:block overflow-hidden border-border/80 shadow-xs font-sans" dir="rtl">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-muted/30 border-b border-border text-xs text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">مشخصات کاربر</th>
                <th className="py-3 px-4">شماره تماس</th>
                <th className="py-3 px-4">نقش کاربری</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">نشانی‌های ثبت‌شده</th>
                <th className="py-3 px-4">تاریخ عضویت</th>
                <th className="py-3 px-4 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((user) => {
                const initials = `${user.firstName?.[0] || 'U'}${user.lastName?.[0] || ''}`.toUpperCase();
                const addressCount = user._count?.addresses || user.addresses?.length || 0;

                return (
                  <tr
                    key={user.id}
                    onClick={() => router.push(`/users/${user.id}`)}
                    className="cursor-pointer hover:bg-muted/40 transition-colors group/row"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-wood-200 dark:bg-wood-950 text-wood-900 dark:text-wood-200 text-xs font-bold flex items-center justify-center shrink-0 border border-wood-300 font-sans">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-foreground group-hover/row:text-primary transition-colors block truncate">
                            {user.firstName} {user.lastName}
                          </div>
                          <span className="text-xs text-muted-foreground block truncate font-sans dir-ltr text-right">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-muted-foreground font-sans dir-ltr text-right">
                      {user.phone || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                        className="text-xs font-sans"
                      >
                        {user.role === 'ADMIN' ? 'مدیر' : 'مشتری'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                          معلق
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded-md font-medium font-sans">
                        <MapPin className="w-3 h-3 text-primary" />
                        {addressCount} نشانی
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-muted-foreground font-sans">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-left">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(user);
                          }}
                          title="ویرایش سریع"
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
                          title="حذف حساب کاربری"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
