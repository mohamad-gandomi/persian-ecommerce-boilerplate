'use client';

import * as React from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaUploadDropzoneProps {
  onFilesSelected: (files: FileList | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
}

export function MediaUploadDropzone({
  onFilesSelected,
  fileInputRef,
  isUploading,
}: MediaUploadDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        onFilesSelected(e.dataTransfer.files);
      }}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        'border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all font-sans',
        isDragging
          ? 'border-primary bg-primary/5 scale-[0.99]'
          : 'border-border/80 hover:border-primary/50 hover:bg-muted/30 bg-card/40',
      )}
      dir="rtl"
    >
      <div className="max-w-md mx-auto space-y-2 pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-2xs">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            فایل‌ها را به اینجا بکشید یا جهت <span className="text-primary underline">انتخاب فایل</span> کلیک کنید
          </p>
          <p className="text-xs text-muted-foreground">
            پشتیبانی از قالب‌های JPG، PNG، WEBP، SVG و GIF تا سقف ۱۰ مگابایت. فایل‌ها مستقیماً در پایگاه‌داده و سرور ذخیره می‌شوند.
          </p>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => onFilesSelected(e.target.files)}
        multiple
        accept="image/*"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}
