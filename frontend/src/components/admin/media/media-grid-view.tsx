'use client';

import * as React from 'react';
import { Eye, Sparkles, Copy, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaItem } from '@/types';
import { formatBytes } from './media-utils';

interface MediaGridViewProps {
  items: MediaItem[];
  copiedId: string | null;
  onInspect: (item: MediaItem) => void;
  onCopyUrl: (url: string, id: string) => void;
  onDelete: (item: MediaItem) => void;
}

export function MediaGridView({
  items,
  copiedId,
  onInspect,
  onCopyUrl,
  onDelete,
}: MediaGridViewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 font-sans" dir="rtl">
      {items.map((item) => {
        const isCopied = copiedId === item.id;
        const ext = item.filename.split('.').pop()?.toUpperCase() || 'FILE';

        return (
          <div
            key={item.id}
            className="group rounded-xl border border-border bg-card overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Image Thumbnail Preview */}
            <div
              onClick={() => onInspect(item)}
              className="aspect-square bg-muted/60 relative overflow-hidden cursor-pointer flex items-center justify-center"
            >
              <img
                src={item.url}
                alt={item.altText || item.originalName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              {/* Format Badge */}
              {ext === 'WEBP' ? (
                <span className="absolute top-2 right-2 text-[10px] font-sans font-bold bg-emerald-700/90 text-white px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-0.5 backdrop-blur-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  WEBP
                </span>
              ) : (
                <span className="absolute top-2 right-2 text-[10px] font-sans font-bold bg-black/60 backdrop-blur-xs text-white px-1.5 py-0.5 rounded shadow-2xs">
                  {ext}
                </span>
              )}

              {/* Dimensions Pill */}
              {item.width && item.height ? (
                <span className="absolute bottom-2 right-2 text-[9px] font-sans font-semibold bg-black/60 backdrop-blur-xs text-white/90 px-1 rounded shadow-2xs dir-ltr">
                  {item.width}×{item.height}
                </span>
              ) : null}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white">
                <Eye className="w-4 h-4 drop-shadow" />
                <span className="text-xs font-medium drop-shadow font-sans">مشاهده جزئیات</span>
              </div>
            </div>

            {/* Card Info & Quick Actions */}
            <div className="p-2.5 space-y-2 text-right">
              <div className="space-y-0.5">
                <p
                  className="text-xs font-semibold text-foreground truncate cursor-pointer hover:underline text-right"
                  onClick={() => onInspect(item)}
                  title={item.originalName}
                >
                  {item.originalName}
                </p>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-sans">
                  <span>{formatBytes(item.size)}</span>
                  {item.altText && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-1 rounded truncate max-w-[80px]">
                      متن جایگزین
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Button Row */}
              <div className="flex items-center gap-1 pt-1 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyUrl(item.url, item.id);
                  }}
                  className="h-7 px-2 text-[11px] gap-1 flex-1 text-muted-foreground hover:text-foreground font-sans"
                  title="کپی پیوند مستقیم رسانه"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>کپی لینک</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  title="حذف رسانه"
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
