'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInput } from './SearchInput';
import { parseWorkflowFile } from '@/lib/yaml-parser';
import { useViewerStore } from '@/store/viewer-store';
import { searchLayout } from '@/components/design-system/tokens/search';

interface UnifiedSearchBarProps {
  variant?: 'main' | 'compact';
  initialQuery?: string;
  className?: string;
  autoFocus?: boolean;
}

export function UnifiedSearchBar({
  variant = 'main',
  initialQuery = '',
  className,
  autoFocus = false,
}: UnifiedSearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const setWorkflowData = useViewerStore((s) => s.setWorkflowData);

  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const layout = searchLayout[variant];

  // 파일 드롭 처리
  const handleFileDrop = useCallback(
    async (file: File) => {
      const validExtensions = ['.yaml', '.yml'];
      const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

      if (!validExtensions.includes(fileExt)) {
        setError('YAML 파일만 업로드할 수 있습니다 (.yaml, .yml)');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await parseWorkflowFile(file);

        if (result.success && result.data) {
          setWorkflowData(result.data);
          router.push('/viewer');
        } else {
          setError(result.error || 'YAML 파일 파싱에 실패했습니다');
        }
      } catch (err) {
        setError('파일 처리 중 오류가 발생했습니다');
      } finally {
        setIsLoading(false);
      }
    },
    [router, setWorkflowData]
  );

  // 드래그 이벤트 핸들러
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
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

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileDrop(files[0]);
      }
    },
    [handleFileDrop]
  );

  // 검색 실행
  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, router]);

  // 입력 초기화
  const handleClear = useCallback(() => {
    setQuery('');
    setError(null);
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className={cn('relative w-full', className)}
      style={{ maxWidth: layout.maxWidth }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 드래그 오버레이 */}
      {isDragging && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'bg-primary/10 border-2 border-dashed border-primary rounded-full',
            'pointer-events-none z-10'
          )}
          style={{ borderRadius: layout.borderRadius }}
        >
          <div className="flex items-center gap-2 text-primary font-medium">
            <Upload size={20} />
            <span>YAML 파일 드롭</span>
          </div>
        </div>
      )}

      {/* 검색 입력 */}
      <SearchInput
        ref={inputRef}
        value={query}
        onChange={setQuery}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        variant={variant}
        isFocused={isFocused}
        isDragging={isDragging}
        placeholder={
          isLoading
            ? '파일 처리 중...'
            : 'Search workflows or drop YAML file...'
        }
      />

      {/* 에러 메시지 */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 text-center">
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}
    </div>
  );
}
