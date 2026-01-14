'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkflowViewer } from './WorkflowViewer';
import { useViewerStore } from '@/store/viewer-store';

interface WorkflowViewerLayoutProps {
  children?: React.ReactNode;
  showHeader?: boolean;
  onNewUpload?: () => void;
}

/**
 * 공통 워크플로우 뷰어 레이아웃
 * 좌측: 워크플로우 캔버스
 * 우측: children (NodeInfoPanel 또는 커스텀 패널)
 */
export function WorkflowViewerLayout({
  children,
  showHeader = true,
  onNewUpload
}: WorkflowViewerLayoutProps) {
  const router = useRouter();
  const { workflowData, clearWorkflow, isLoading } = useViewerStore();

  const handleNewUpload = () => {
    if (onNewUpload) {
      onNewUpload();
    } else {
      clearWorkflow();
      router.push('/');
    }
  };

  if (isLoading || !workflowData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">워크플로우를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      {showHeader && (
        <header className="h-14 border-b bg-white flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                홈으로
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-semibold text-sm">
              {workflowData.workflow.name || '이름 없음'}
            </h1>
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleNewUpload}>
            <Upload className="h-4 w-4" />
            새 파일 업로드
          </Button>
        </header>
      )}

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 뷰어 캔버스 */}
        <div className="flex-1">
          <WorkflowViewer className="h-full" />
        </div>

        {/* 우측 패널 (NodeInfoPanel 또는 커스텀) */}
        {children}
      </div>
    </div>
  );
}
