'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavItem } from './nav-data';

interface NavItemListProps {
  items: NavItem[];
  onItemClick?: () => void;
}

export function NavItemList({ items, onItemClick }: NavItemListProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-1 pt-1 pb-2 px-1">
      {items.map((item) => {
        let isActive = false;
        if (item.href === '/') {
          isActive = pathname === '/';
        } else if (item.href === '/admin') {
          isActive = pathname === '/admin';
        } else if (item.href.includes('?')) {
          isActive =
            pathname === item.href.split('?')[0] &&
            typeof window !== 'undefined' &&
            window.location.search.includes('action=upload');
        } else if (item.href === '/admin/blog') {
          isActive =
            pathname === '/admin/blog' ||
            (pathname.startsWith('/admin/blog/') &&
              !pathname.startsWith('/admin/blog/categories'));
        } else {
          isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        }
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group font-sans',
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground group-hover:text-foreground',
                )}
              />
              <span className="truncate">{item.title}</span>
            </div>
            {item.badge && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded font-sans shrink-0',
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-wood-100 text-wood-800',
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
