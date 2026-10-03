'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/admin/header';
import { Card, CardContent } from '@/components/ui/card';
import { api, MediaSettings } from '@/lib/api';
import { MediaItem } from '@/types';
import { MediaHeaderBanner } from '@/components/admin/media/media-header-banner';
import { MediaOptimizationCard } from '@/components/admin/media/media-optimization-card';
import { MediaUploadDropzone } from '@/components/admin/media/media-upload-dropzone';
import { MediaToolbar } from '@/components/admin/media/media-toolbar';
import { MediaGridView } from '@/components/admin/media/media-grid-view';
import { MediaTableView } from '@/components/admin/media/media-table-view';
import { MediaInspectModal } from '@/components/admin/media/media-inspect-modal';
import { MediaDeleteModal } from '@/components/admin/media/media-delete-modal';

export default function MediaLibraryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedMime, setSelectedMime] = React.useState('all');
  const [inspectItem, setInspectItem] = React.useState<MediaItem | null>(null);
  const [deleteConfirmMedia, setDeleteConfirmMedia] = React.useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [convertToWebp, setConvertToWebp] = React.useState(true);
  const [qualityPreset, setQualityPreset] = React.useState(80);
  const [maxWidthOption, setMaxWidthOption] = React.useState(2048);
  const [showOptions, setShowOptions] = React.useState(false);

  const { data: mediaSettings } = useQuery<MediaSettings>({
    queryKey: ['system-setting', 'media'],
    queryFn: () => api.getSetting<MediaSettings>('media'),
    staleTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    if (mediaSettings) {
      if (typeof mediaSettings.convertToWebp === 'boolean') setConvertToWebp(mediaSettings.convertToWebp);
      if (typeof mediaSettings.qualityPreset === 'number') setQualityPreset(mediaSettings.qualityPreset);
      if (typeof mediaSettings.maxWidthOption === 'number') setMaxWidthOption(mediaSettings.maxWidthOption);
      if (typeof mediaSettings.showOptimizationOptions === 'boolean') setShowOptions(mediaSettings.showOptimizationOptions);
    }
  }, [mediaSettings]);

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<MediaSettings>) => api.updateSetting<MediaSettings>('media', newSettings),
    onSuccess: (updated) => { queryClient.setQueryData(['system-setting', 'media'], updated); toast.success('تنظیمات بهینه‌سازی رسانه ذخیره شد'); },
    onError: (err: any) => toast.error(err?.message || 'خطا در ذخیره تنظیمات'),
  });

  const { data: mediaList = [], isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['media', search],
    queryFn: () => api.getMedia(search.trim() || undefined),
  });

  const { data: storageStats } = useQuery({
    queryKey: ['media-storage-stats'],
    queryFn: () => api.getStorageStats(),
    staleTime: 5000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['media'] });
    queryClient.invalidateQueries({ queryKey: ['media-count'] });
    queryClient.invalidateQueries({ queryKey: ['media-storage-stats'] });
  };

  const uploadMutation = useMutation({
    mutationFn: async ({ file }: { file: File }) => api.uploadMedia(file, { convertToWebp, quality: qualityPreset, maxWidth: maxWidthOption }),
    onSuccess: (uploaded) => { toast.success(`فایل «${uploaded.originalName}» بارگذاری شد`); invalidate(); },
    onError: (err: Error) => toast.error(err.message || 'خطا در بارگذاری فایل'),
    onSettled: () => setIsUploading(false),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { altText?: string; caption?: string } }) => api.updateMedia(id, data),
    onSuccess: (updated) => { toast.success('متاداده تصویر بروزرسانی شد'); invalidate(); setInspectItem(updated); },
    onError: (err: Error) => toast.error(err.message || 'خطا در ذخیره اطلاعات'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteMedia(id),
    onSuccess: () => { toast.success('پرونده با موفقیت حذف شد'); invalidate(); setDeleteConfirmMedia(null); setInspectItem(null); },
    onError: (err: Error) => toast.error(err.message || 'خطا در حذف فایل'),
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      try { await uploadMutation.mutateAsync({ file: files[i] }); } catch {}
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('پیوند فایل در کلیپ‌بورد کپی شد');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredList = React.useMemo(() => {
    if (selectedMime === 'all') return mediaList;
    return mediaList.filter((m) => m.mimeType.toLowerCase().includes(selectedMime));
  }, [mediaList, selectedMime]);

  const totalBytes = mediaList.reduce((acc, m) => acc + (m.size || 0), 0);

  return (
    <div className="space-y-6 pb-20 font-sans" dir="rtl">
      <Header title="کتابخانه پرونده‌ها و رسانه‌ها" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <MediaHeaderBanner
          totalAssets={mediaList.length}
          catalogSize={storageStats?.catalogSize ?? totalBytes}
          diskSize={storageStats?.diskSize ?? 0}
          isRefetching={isRefetching}
          isUploading={isUploading}
          onRefresh={() => refetch()}
          onUploadClick={() => fileInputRef.current?.click()}
        />

        <MediaOptimizationCard
          convertToWebp={convertToWebp}
          onToggleWebp={(c) => { setConvertToWebp(c); updateSettingsMutation.mutate({ convertToWebp: c }); }}
          qualityPreset={qualityPreset}
          onChangeQuality={(q) => { setQualityPreset(q); updateSettingsMutation.mutate({ qualityPreset: q }); }}
          maxWidthOption={maxWidthOption}
          onChangeMaxWidth={(w) => { setMaxWidthOption(w); updateSettingsMutation.mutate({ maxWidthOption: w }); }}
          showOptions={showOptions}
          onToggleShowOptions={() => { const n = !showOptions; setShowOptions(n); updateSettingsMutation.mutate({ showOptimizationOptions: n }); }}
          isSaving={updateSettingsMutation.isPending}
        />

        <MediaUploadDropzone onFilesSelected={handleFiles} fileInputRef={fileInputRef} isUploading={isUploading} />

        <MediaToolbar search={search} onSearchChange={setSearch} selectedMime={selectedMime} onSelectMime={setSelectedMime} viewMode={viewMode} onViewModeChange={setViewMode} />

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground text-xs font-sans">در حال بارگذاری پرونده‌ها از پایگاه‌داده...</div>
        ) : filteredList.length === 0 ? (
          <Card className="text-center py-16 border-dashed font-sans">
            <CardContent className="space-y-3 max-w-sm mx-auto">
              <ImageIcon className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">پرونده‌ای یافت نشد</h3>
                <p className="text-xs text-muted-foreground">{search ? `موردی مطابق با «${search}» پیدا نشد.` : 'اولین عکس را با کادر بالا بارگذاری کنید.'}</p>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <MediaGridView items={filteredList} copiedId={copiedId} onInspect={setInspectItem} onCopyUrl={handleCopyUrl} onDelete={setDeleteConfirmMedia} />
        ) : (
          <MediaTableView items={filteredList} copiedId={copiedId} onInspect={setInspectItem} onCopyUrl={handleCopyUrl} onDelete={setDeleteConfirmMedia} />
        )}
      </div>

      <MediaInspectModal
        item={inspectItem}
        copiedId={copiedId}
        isUpdating={updateMutation.isPending}
        onClose={() => setInspectItem(null)}
        onCopyUrl={handleCopyUrl}
        onDelete={(item) => { setInspectItem(null); setDeleteConfirmMedia(item); }}
        onSave={(id, data) => updateMutation.mutate({ id, data })}
      />

      <MediaDeleteModal
        item={deleteConfirmMedia}
        isOpen={Boolean(deleteConfirmMedia)}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteConfirmMedia(null)}
        onConfirm={(item) => deleteMutation.mutate(item.id)}
      />
    </div>
  );
}
