'use client';

import * as React from 'react';
import { Info, DollarSign, Image as ImageIcon, Layers, TreePine } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductEditorTabsNavProps {
  specCount: number;
  variantCount: number;
  imageCount: number;
}

export function ProductEditorTabsNav({
  specCount,
  variantCount,
  imageCount,
}: ProductEditorTabsNavProps) {
  return (
    <div className="w-full overflow-x-auto pb-1" dir="rtl">
      <TabsList className="inline-flex sm:flex w-max sm:w-full items-center justify-start gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-muted/80 rounded-xl border border-border" dir="rtl">
        <TabsTrigger value="overview" className="gap-2 py-2 px-3 sm:px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>مشخصات پایه</span>
        </TabsTrigger>
        <TabsTrigger value="specifications" className="gap-2 py-2 px-3 sm:px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
          <TreePine className="w-3.5 h-3.5 shrink-0" />
          <span>مشخصات فنی ({specCount})</span>
        </TabsTrigger>
        <TabsTrigger value="pricing" className="gap-2 py-2 px-3 sm:px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
          <DollarSign className="w-3.5 h-3.5 shrink-0" />
          <span>قیمت و انبار</span>
        </TabsTrigger>
        <TabsTrigger value="variations" className="gap-2 py-2 px-3 sm:px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span>تنوع‌ها ({variantCount})</span>
        </TabsTrigger>
        <TabsTrigger value="media" className="gap-2 py-2 px-3 sm:px-3.5 text-xs font-semibold rounded-lg font-sans shrink-0 whitespace-nowrap">
          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
          <span>گالری ({imageCount})</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
