'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Image as ImageIcon, Search, UploadCloud, Check, RefreshCw, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api, MediaSettings } from '@/lib/api';
import { MediaItem } from '@/types';
import { formatBytes } from '@/components/admin/media/media-utils';
import { cn } from '@/lib/utils';

export interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaItem) => void;
  title?: string;
  description?: string;
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  title = 'انتخاب رسانه از کتابخانه',
  description = 'یک تصویر از کاتالوگ انتخاب کرده یا پرونده جدیدی بارگذاری نمایید.',
}: MediaPickerDialogProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [convertToWebp, setConvertToWebp] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const { data: mediaSettings } = useQuery<MediaSettings>({
    queryKey: ['system-setting', 'media'],
    queryFn: () => api.getSetting<MediaSettings>('media'),
    staleTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    if (mediaSettings && typeof mediaSettings.convertToWebp === 'boolean') {
      setConvertToWebp(mediaSettings.convertToWebp);
    }
  }, [mediaSettings]);

  const { data: mediaList = [], isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['media-picker', search],
    queryFn: () => api.getMedia(search.trim() || undefined),
    enabled: open,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      api.uploadMedia(file, {
        convertToWebp,
        quality: mediaSettings?.qualityPreset ?? 80,
        maxWidth: mediaSettings?.maxWidthOption ?? 2048,
      }),
    onSuccess: (uploaded) => {
      toast.success(`فایل «${uploaded.originalName}» بارگذاری شد`);
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-picker'] });
      queryClient.invalidateQueries({ queryKey: ['media-count'] });
      queryClient.invalidateQueries({ queryKey: ['media-storage-stats'] });
      onSelect(uploaded);
      onOpenChange(false);
    },
    onError: (err: Error) => toast.error(err.message || 'خطا در بارگذاری فایل'),
  });

  const handleChoose = (media: MediaItem) => {
    setSelectedId(media.id);
    onSelect(media);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[calc(100vw-1.5rem)] sm:w-full max-h-[90dvh] flex flex-col p-3.5 sm:p-6 overflow-x-hidden overscroll-contain font-sans" dir="rtl">
        <DialogHeader className="pb-3 border-b border-border/60 text-right">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-7 sm:pl-6">
            <div>
              <DialogTitle className="text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>{title}</span>
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">{description}</DialogDescription>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching} className="h-8 text-xs gap-1.5 font-sans" title="بروزرسانی">
                <RefreshCw className={cn('w-3.5 h-3.5', isRefetching && 'animate-spin')} />
              </Button>
              <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending} className="h-8 text-xs font-semibold gap-1.5 shadow-xs font-sans">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{uploadMutation.isPending ? 'در حال بارگذاری...' : 'بارگذاری جدید'}</span>
              </Button>
              <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMutation.mutate(f); }} accept="image/*" className="hidden" />
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو با نام فایل یا متن جایگزین..."
                className="pr-8 pl-8 text-xs h-8 text-right font-sans"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground select-none shrink-0 hover:text-foreground font-sans">
              <input type="checkbox" checked={convertToWebp} onChange={(e) => setConvertToWebp(e.target.checked)} className="rounded border-border w-3.5 h-3.5 text-primary focus:ring-primary" />
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>تبدیل به WebP</span>
            </label>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-3">
          {isLoading ? (
            <div className="text-center py-16 text-xs text-muted-foreground font-sans">در حال بارگذاری فایل‌ها...</div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-16 space-y-2 text-muted-foreground font-sans">
              <ImageIcon className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs font-medium text-foreground">پرونده‌ای یافت نشد</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
              {mediaList.map((item) => {
                const isSelected = selectedId === item.id;
                const ext = item.filename.split('.').pop()?.toUpperCase() || 'IMG';
                return (
                  <div
                    key={item.id}
                    onClick={() => handleChoose(item)}
                    className={cn(
                      'group rounded-xl border p-1.5 bg-card cursor-pointer transition-all hover:border-primary hover:shadow-xs relative flex flex-col justify-between select-none font-sans',
                      isSelected ? 'border-primary ring-2 ring-primary/40 bg-primary/5' : 'border-border',
                    )}
                  >
                    <div className="aspect-square bg-muted/60 rounded-lg overflow-hidden relative flex items-center justify-center">
                      <img src={item.url} alt={item.altText || item.originalName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" loading="lazy" />
                      <span className="absolute top-1 right-1 text-[9px] font-sans font-bold bg-black/60 text-white px-1 py-0.2 rounded">
                        {ext}
                      </span>
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="pt-1.5 px-0.5 space-y-0.5 text-right">
                      <p className="text-[11px] font-semibold text-foreground truncate" title={item.originalName}>{item.originalName}</p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-sans">
                        <span>{formatBytes(item.size)}</span>
                        <span className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">← انتخاب</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
