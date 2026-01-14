'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useSmoothStream } from '@/hooks/use-smooth-stream';
import { MarkdownContent } from './MarkdownContent';
import type { ChatMessage as ChatMessageType } from '@/store/chat-store';

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isLoading = !isUser && message.content === '';

  // 부드러운 스트리밍 효과 적용 (Assistant 메시지만, 환영 메시지 제외)
  const smoothContent = useSmoothStream(message.content);
  const displayedContent = isUser || message.isWelcome ? message.content : smoothContent;

  // 커서 표시 여부: 스트리밍 중이거나, 아직 부드러운 출력이 다 안 나왔을 때 (환영 메시지 제외)
  const showCursor = !isUser && !message.isWelcome && (isStreaming || displayedContent.length < message.content.length);

  return (
    <div
      className={cn(
        'flex gap-3 items-start',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar - MISO만 표시 */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-transparent">
          <Image
            src="/miso_face.png"
            alt="MISO"
            width={28}
            height={28}
            className="object-cover"
          />
        </div>
      )}

      {/* Message content */}
      <div className="flex flex-col gap-1 max-w-[85%]">
        {isLoading ? (
          // 로딩 인디케이터
          <div className="flex items-center gap-1.5 py-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <>
            <div className="text-sm leading-[1.6] text-gray-800">
              {isUser ? (
                // 사용자 메시지는 플레인 텍스트
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              ) : (
                // AI 메시지는 마크다운 파싱 + 커서
                <MarkdownContent content={displayedContent + (showCursor ? ' ▍' : '')} />
              )}
            </div>
            <div
              className={cn(
                'text-xs',
                isUser ? 'text-right text-gray-400' : 'text-left text-gray-400'
              )}
            >
              {formatTimestamp(message.timestamp)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
