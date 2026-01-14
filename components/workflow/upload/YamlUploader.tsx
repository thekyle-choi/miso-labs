'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseWorkflowFile } from '@/lib/yaml-parser';
import { useViewerStore } from '@/store/viewer-store';
import { DropZone } from './DropZone';

/**
 * YAML 파일 업로더 컴포넌트
 * 파일 업로드 → 파싱 → 스토어 저장 → 뷰어 페이지 이동
 */
export default function YamlUploader() {
  const router = useRouter();
  const setWorkflowData = useViewerStore((s) => s.setWorkflowData);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        // 파일 확장자 검증
        if (!file.name.endsWith('.yaml') && !file.name.endsWith('.yml')) {
          setError('.yaml 또는 .yml 파일만 업로드할 수 있습니다.');
          setIsLoading(false);
          return;
        }

        // YAML 파싱
        const result = await parseWorkflowFile(file);

        if (!result.success) {
          setError(result.error || '파일 파싱에 실패했습니다.');
          setIsLoading(false);
          return;
        }

        if (result.data) {
          // 스토어에 데이터 저장
          setWorkflowData(result.data);

          // 경고가 있으면 콘솔에 출력
          if (result.warnings) {
            console.warn('YAML 파싱 경고:', result.warnings);
          }

          // 뷰어 페이지로 이동
          router.push('/viewer');
        }
      } catch (e) {
        setError('파일 처리 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    },
    [setWorkflowData, router]
  );

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <DropZone
        onFileDrop={handleFileDrop}
        isLoading={isLoading}
        error={error}
        accept=".yaml,.yml"
      />

      <p className="text-sm text-center text-muted-foreground">
        MISO에서 export한 워크플로우/챗플로우 YAML 파일 (DSL v0.1.x)
      </p>
    </div>
  );
}
