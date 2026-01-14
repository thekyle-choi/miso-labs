'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThreePanelViewerLayout, NodeInfoPanel } from '@/components/workflow/viewer';
import { useViewerStore } from '@/store/viewer-store';
import { loadSampleWorkflowData } from '@/data/sample-workflows';

function ViewerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workflowData, setWorkflowData, setLoading } = useViewerStore();

  // 샘플 워크플로우 로드
  useEffect(() => {
    const sampleId = searchParams.get('sample');

    if (sampleId) {
      setLoading(true);
      loadSampleWorkflowData(sampleId)
        .then((sampleData) => {
          if (sampleData) {
            setWorkflowData(sampleData);
          } else {
            // 샘플 데이터 로드 실패 시 활용 사례로 리다이렉트
            router.push('/templates');
          }
        })
        .catch((error) => {
          console.error('Failed to load sample workflow:', error);
          router.push('/templates');
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    // 워크플로우 데이터가 없으면 활용 사례로 리다이렉트
    if (!workflowData && !sampleId) {
      router.push('/templates');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <ThreePanelViewerLayout>
      <NodeInfoPanel />
    </ThreePanelViewerLayout>
  );
}

export default function TemplatesViewerPage() {
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
