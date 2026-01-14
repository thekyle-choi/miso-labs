'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface DropZoneProps {
  onFileDrop: (file: File) => void;
  isLoading?: boolean;
  error?: string | null;
  accept?: string;
  className?: string;
}

/**
 * 드래그 앤 드롭 파일 업로드 영역
 */
export function DropZone({
  onFileDrop,
  isLoading = false,
  error = null,
  accept = '.yaml,.yml',
  className,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        const isValidExt = accept
          .split(',')
          .some((ext) => file.name.toLowerCase().endsWith(ext.trim()));

        if (isValidExt) {
          setFileName(file.name);
          onFileDrop(file);
        }
      }
    },
    [accept, onFileDrop]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        onFileDrop(file);
      }
    },
    [onFileDrop]
  );

  return (
    <Card
      className={cn(
        'relative border-2 border-dashed rounded-xl p-12',
        'transition-all duration-200 cursor-pointer',
        isDragging && 'border-primary bg-primary/5 scale-[1.02]',
        !isDragging && !error && 'border-muted-foreground/25 hover:border-muted-foreground/50',
        error && 'border-destructive/50 bg-destructive/5',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isLoading}
      />

      <div className="flex flex-col items-center gap-4 text-center pointer-events-none">
        {isLoading ? (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div>
              <p className="text-lg font-medium">처리 중...</p>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-12 h-12 text-destructive" />
            <div>
              <p className="text-lg font-medium text-destructive">오류 발생</p>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </>
        ) : fileName ? (
          <>
            <FileText className="w-12 h-12 text-primary" />
            <div>
              <p className="text-lg font-medium">{fileName}</p>
              <p className="text-sm text-muted-foreground">처리 준비 완료</p>
            </div>
          </>
        ) : (
          <>
            <Upload
              className={cn(
                'w-12 h-12 transition-colors',
                isDragging ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <div>
              <p className="text-lg font-medium">
                YAML 파일을 여기에 드롭하세요
              </p>
              <p className="text-sm text-muted-foreground">
                또는 클릭하여 파일 선택
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
