'use client';

import { useRouter } from 'next/navigation';
import { FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectResultCard } from './ProjectResultCard';
import { useViewerStore } from '@/store/viewer-store';
import type { MockProject } from '@/lib/mock-data';
import { generateMockWorkflowData } from '@/lib/mock-data';

interface ResultsListProps {
  results: MockProject[];
  query: string;
  className?: string;
}

export function ResultsList({ results, query, className }: ResultsListProps) {
  const router = useRouter();
  const setWorkflowData = useViewerStore((s) => s.setWorkflowData);

  const handleProjectClick = (project: MockProject) => {
    // Mock 데이터 생성 후 뷰어로 이동
    const workflowData = generateMockWorkflowData(project);
    setWorkflowData(workflowData);
    router.push('/viewer');
  };

  // 결과 없음
  if (results.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-16', className)}>
        <FileQuestion className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          &quot;{query}&quot;에 대한 결과를 찾을 수 없습니다.
          <br />
          다른 키워드로 검색해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* 결과 개수 */}
      <p className="text-sm text-muted-foreground">
        {results.length}개의 결과
      </p>

      {/* 결과 목록 */}
      <div className="space-y-3">
        {results.map((project) => (
          <ProjectResultCard
            key={project.id}
            project={project}
            onClick={() => handleProjectClick(project)}
          />
        ))}
      </div>
    </div>
  );
}
