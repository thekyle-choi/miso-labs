'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { parseWorkflowFile } from '@/lib/yaml-parser';
import { useViewerStore } from '@/store/viewer-store';

export function HeroSection() {
  const router = useRouter();
  const setWorkflowData = useViewerStore((s) => s.setWorkflowData);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.yaml') && !file.name.endsWith('.yml')) {
      setError('.yaml 또는 .yml 파일만 가능합니다.');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const result = await parseWorkflowFile(file);

      if (!result.success) {
        setError(result.error || '파일 파싱 실패');
        setIsUploading(false);
        return;
      }

      if (!result.data) {
        setError('워크플로우 데이터를 읽을 수 없습니다.');
        setIsUploading(false);
        return;
      }

      // Viewer store에 저장
      setWorkflowData(result.data);

      // templates viewer로 이동 (type이 'templates'로 설정됨)
      router.push('/templates/viewer');
    } catch (e: any) {
      setError(`파일 처리 중 오류 발생: ${e.message}`);
      setIsUploading(false);
    }
  };

  const handleOpenModal = () => {
    setShowUploadModal(true);
    setError(null);
    setIsUploading(false);
  };

  return (
    <>
      <div className="flex-grow flex flex-col justify-center lg:px-8 py-8">
        {/* Beta Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
            </span>
            <span className="text-sm font-medium text-blue-700 font-sans">
              Beta testing now
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.2] mb-4 text-gray-900 font-heading">
          당신의 MISO는 <br />
          <span className="text-gray-400">어떤 모습인가요?</span>
        </h1>
        <p className="text-lg text-gray-400 mb-10 font-sans tracking-wide">
          MISO LABS | Where ideas find their MISO
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/templates"
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold font-kr px-8 py-4 rounded-full transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            MISO 활용 사례
          </Link>
          <button
            onClick={handleOpenModal}
            className="bg-surface-light hover:bg-gray-200 text-gray-900 font-medium font-kr px-8 py-4 rounded-full transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            내 MISO 분석하기
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">내 MISO 분석하기</DialogTitle>
            <DialogDescription className="text-base pt-2">
              YAML 파일을 업로드하면 워크플로우를 분석하고 시각화합니다
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4">
            <label
              className={cn(
                'block w-full h-48 rounded-xl border-2 transition-all cursor-pointer',
                'flex flex-col items-center justify-center',
                isDragOver && 'border-gray-900 bg-gray-50',
                !isDragOver && 'border-gray-200 hover:border-gray-300',
                isUploading && 'pointer-events-none opacity-50'
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all',
                  isDragOver ? 'bg-gray-900 scale-110' : 'bg-gray-100'
                )}>
                  <Upload className={cn(
                    'h-6 w-6 transition-colors',
                    isDragOver ? 'text-white' : 'text-gray-400'
                  )} />
                </div>
                <p className="text-base font-semibold text-gray-900 mb-2">
                  {isUploading ? '업로드 중...' : isDragOver ? '여기에 놓으세요' : '파일을 드래그하거나 클릭하세요'}
                </p>
                <p className="text-xs text-gray-400">.yml 또는 .yaml 파일</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".yaml,.yml"
                onChange={handleFileInput}
                disabled={isUploading}
              />
            </label>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
