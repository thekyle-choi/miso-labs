'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import yaml from 'js-yaml';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useViewerStore } from '@/store/viewer-store';
import { useChatStore, useChatMessages, useThinkingMode } from '@/store/chat-store';
import { sendChatMessage } from '@/lib/miso-api';
import { getWelcomeMessage } from '@/data/welcome-messages';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface WorkflowChatPanelProps {
  className?: string;
}

export function WorkflowChatPanel({ className }: WorkflowChatPanelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const workflowData = useViewerStore((s) => s.workflowData);
  const messages = useChatMessages();
  const { addMessage, updateMessage, setLoading, setError, clearMessages, toggleThinkingMode } = useChatStore();
  const isLoading = useChatStore((s) => s.isLoading);
  const error = useChatStore((s) => s.error);
  const thinkingMode = useThinkingMode();
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<string>('');
  const welcomeMessageShownRef = useRef<boolean>(false);

  // 현재 경로에 따라 type 결정
  const viewerType = pathname.startsWith('/templates/') ? 'templates' : 'review';
  const sampleId = searchParams.get('sample');

  // 컴포넌트 마운트 시 대화 초기화 및 환영 메시지 표시
  useEffect(() => {
    // sampleId가 변경되면 대화 초기화
    clearMessages();
    conversationIdRef.current = '';
    welcomeMessageShownRef.current = false;

    // templates 페이지에서 온 경우 환영 메시지 표시
    if (pathname.startsWith('/templates/') && sampleId) {
      const welcomeMsg = getWelcomeMessage(sampleId);
      if (welcomeMsg) {
        addMessage({
          role: 'assistant',
          content: welcomeMsg,
          isWelcome: true, // 스트리밍 효과 없이 바로 표시
        });
        welcomeMessageShownRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sampleId]);

  // Auto-scroll to bottom when new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!workflowData) {
      setError('워크플로우 데이터가 없습니다.');
      return;
    }

    // 사용자 메시지 추가
    addMessage({ role: 'user', content });
    setLoading(true);
    setError(null);

    // 빈 어시스턴트 메시지 생성 (스트리밍용) 및 ID 받기
    const assistantMessageId = addMessage({
      role: 'assistant',
      content: ''
    });

    console.log('[Chat] Assistant message created:', assistantMessageId);

    // YAML을 문자열로 변환
    const yamlString = yaml.dump(workflowData);

    // 사고 모드가 켜져 있으면 type을 'thinking'으로 변경
    const requestType = thinkingMode ? 'thinking' : viewerType;

    try {
      await sendChatMessage(
        {
          inputs: {
            yaml: yamlString,
            type: requestType,
          },
          query: content,
          mode: 'streaming',
          conversation_id: conversationIdRef.current,
          user: 'web-viewer-user',
          response_mode: thinkingMode ? 'blocking' : 'streaming',
        },
        // onChunk: 스트리밍 청크 받을 때마다 호출
        (chunk: string) => {
          console.log('[Chat] Updating message:', assistantMessageId, 'with chunk length:', chunk.length);
          // Store에서 직접 업데이트
          useChatStore.getState().updateMessage(assistantMessageId, chunk);
        },
        // onError: 에러 발생 시
        (error: string) => {
          setError(error);
          useChatStore.getState().updateMessage(assistantMessageId, `오류: ${error}`);
          setLoading(false);
        },
        // onComplete: 완료 시 (conversation_id 저장)
        (conversationId?: string) => {
          console.log('[Chat] Complete. Conversation ID:', conversationId);
          if (conversationId) {
            conversationIdRef.current = conversationId;
          }
          setLoading(false);
        }
      );
    } catch (error: any) {
      setError(error.message || '알 수 없는 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className={cn('h-full flex flex-col bg-white', className)}>
      {/* Header - Minimal Medium style */}
      <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="/miso_face.png"
              alt="MISO"
              width={36}
              height={36}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">MISO</h3>
            <p className="text-xs text-gray-500">워크플로우 전문가</p>
          </div>
        </div>
      </div>

      {/* Messages Area - Generous spacing */}
      <div className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-full overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isStreaming={isLoading && index === messages.length - 1 && msg.role === 'assistant'}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Area - Clean separation */}
      <div className="px-6 py-5 border-t border-gray-100 flex-shrink-0 bg-white">
        {/* Error Message */}
        {error && (
          <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <ChatInput
          onSend={handleSend}
          disabled={!workflowData || isLoading}
          placeholder={
            isLoading
              ? 'MISO가 생각 중...'
              : workflowData
                ? 'MISO에 대해 물어보세요...'
                : '워크플로우를 불러와주세요'
          }
          thinkingMode={thinkingMode}
          onToggleThinkingMode={toggleThinkingMode}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 py-12">
      <div className="w-48 h-48 flex items-center justify-center mb-8 overflow-hidden">
        <Image
          src="/miso_compute.png"
          alt="MISO"
          width={192}
          height={192}
          className="object-contain"
        />
      </div>
      <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
        MISO 앱에 대해 뭐든 물어보세요
      </p>
    </div>
  );
}
