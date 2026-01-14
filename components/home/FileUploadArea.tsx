'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface FileUploadAreaProps {
  label?: string;
  acceptedFormats?: string[];
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export function FileUploadArea({
  label = '파일 첨부하기',
  acceptedFormats = ['.png', '.jpg', '.zip'],
  onFilesSelected,
  className,
}: FileUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (onFilesSelected && files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (onFilesSelected && files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  return (
    <div className={cn('space-y-2 flex-1 flex flex-col min-h-0', className)}>
      <label className="text-sm text-white font-medium block flex-shrink-0">{label}</label>
      <label
        className={cn(
          'flex-1 min-h-[140px] rounded-xl border-2 border-dashed transition-all cursor-pointer',
          'group flex flex-col items-center justify-center p-6 relative overflow-hidden',
          isDragOver
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-white/15 bg-[#161616] hover:border-white/25 hover:bg-[#1a1a1a]'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Upload Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all',
            isDragOver
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-white/10 text-gray-400 group-hover:bg-white/15 group-hover:text-gray-300'
          )}
        >
          <span className="material-symbols-outlined text-2xl">cloud_upload</span>
        </div>

        {/* Text */}
        <p className="text-sm text-gray-300 font-medium mb-1">
          {isDragOver ? '여기에 놓으세요' : '파일을 드래그하거나 클릭'}
        </p>
        <p className="text-xs text-gray-500">
          {acceptedFormats.join(', ')} 지원
        </p>

        {/* Hidden File Input */}
        <input
          type="file"
          className="hidden"
          accept={acceptedFormats.join(',')}
          multiple
          onChange={handleFileInput}
        />
      </label>
    </div>
  );
}

export default FileUploadArea;
