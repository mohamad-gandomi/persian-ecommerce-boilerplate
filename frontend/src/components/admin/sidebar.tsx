'use client';

import { Store } from 'lucide-react';
import { NavContent } from './nav-content';

export function Sidebar() {
  return (
    <aside className="w-64 border-l border-border/70 bg-card/80 backdrop-blur-sm hidden lg:flex flex-col fixed inset-y-0 right-0 z-30 font-sans" dir="rtl">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/60 gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs shrink-0">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight block text-foreground font-serif">
            فروشگاه آنلاین
          </span>
          <span className="text-[11px] text-muted-foreground font-medium tracking-wide block -mt-0.5">
            پیشخوان مدیریت
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto">
        <NavContent />
      </div>
    </aside>
  );
}
