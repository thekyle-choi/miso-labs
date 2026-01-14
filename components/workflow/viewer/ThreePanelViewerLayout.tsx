'use client';

import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import yaml from 'js-yaml';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout';
import { WorkflowViewer } from './WorkflowViewer';
import { WorkflowChatPanel } from '../chat';
import { useViewerStore } from '@/store/viewer-store';
import { useToast } from '@/hooks/use-toast';

interface ThreePanelViewerLayoutProps {
  /**
   * 우측 패널 (NodeInfoPanel)
   */
  children?: React.ReactNode;
  /**
   * 채팅 패널 표시 여부
   */
  showChat?: boolean;
}

/**
 * 3-패널 워크플로우 뷰어 레이아웃
 * - 좌측: 채팅 인터페이스 (워크플로우 질문)
 * - 중앙: 워크플로우 캔버스 (React Flow)
 * - 우측: 노드 정보 패널 (조건부)
 */
export function ThreePanelViewerLayout({
  children,
  showChat = true,
}: ThreePanelViewerLayoutProps) {
  const router = useRouter();
  const { workflowData, clearWorkflow, isLoading } = useViewerStore();
  const { toast } = useToast();

  const handleDownloadYaml = () => {
    if (!workflowData) return;

    try {
      // YAML 문자열로 변환
      const yamlString = yaml.dump(workflowData);

      // Blob 생성
      const blob = new Blob([yamlString], { type: 'text/yaml;charset=utf-8' });

      // 다운로드 링크 생성
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // 파일명 생성 (워크플로우 이름 또는 기본값)
      const fileName = workflowData.workflow?.name || workflowData.app?.name || 'workflow';
      link.download = `${fileName}.yml`;

      // 다운로드 트리거
      document.body.appendChild(link);
      link.click();

      // 정리
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // 토스트 메시지 표시
      toast({
        title: '앱 다운로드 완료!',
        description: '다운받은 앱은 MISO의 앱리스트 - 기존 앱 가져오기 에서 업로드할 수 있어요!',
        variant: 'sky',
      });
    } catch (error) {
      console.error('YAML 다운로드 실패:', error);
      toast({
        title: '다운로드 실패',
        description: '파일 다운로드 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <AppHeader
        title={workflowData.workflow.name || workflowData.app.name || '이름 없음'}
        rightAction={
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            onClick={handleDownloadYaml}
          >
            <Download className="h-4 w-4" />
            <span className="font-medium">앱 다운로드</span>
          </Button>
        }
      />

      {/* 3-Panel Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat Panel */}
        {showChat && (
          <aside className="w-[420px] bg-white border-r border-gray-100 flex-shrink-0">
            <WorkflowChatPanel />
          </aside>
        )}

        {/* Center: Workflow Viewer Canvas */}
        <main className="flex-1 bg-gray-50">
          <WorkflowViewer className="h-full" />
        </main>

        {/* Right: NodeInfoPanel (children) */}
        {children}
      </div>
    </div>
  );
}
