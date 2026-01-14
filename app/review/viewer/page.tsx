'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThreePanelViewerLayout, NodeInfoPanel } from '@/components/workflow/viewer';
import { useViewerStore } from '@/store/viewer-store';

function ViewerContent() {
  const router = useRouter();
  const { workflowData } = useViewerStore();

  useEffect(() => {
    // 워크플로우 데이터가 없으면 분석하기로 리다이렉트
    if (!workflowData) {
      router.push('/review');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThreePanelViewerLayout>
      <NodeInfoPanel />
    </ThreePanelViewerLayout>
  );
}

export default function ReviewViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      }
    >
      <ViewerContent />
    </Suspense>
  );
}
