'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ArrowUp, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tailwind utility for hiding scrollbar but allowing functionality if needed
const scrollbarHideClass = '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  thinkingMode?: boolean;
  onToggleThinkingMode?: () => void;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요...',
  thinkingMode = false,
  onToggleThinkingMode,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const minHeight = 24; // 기본 textarea 높이

  // Auto-resize textarea
  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), 120);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = value.trim() && !disabled;

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 px-4 py-3 min-h-[56px] rounded-2xl",
        "border border-gray-200 bg-gray-50/80",
        "focus-within:bg-white focus-within:border-gray-300 focus-within:shadow-sm",
        "transition-all duration-200 ease-out",
        disabled && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Left: Thinking Mode Toggle */}
      {onToggleThinkingMode && (
        <button
          type="button"
          onClick={onToggleThinkingMode}
          disabled={disabled}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-xl shrink-0",
            "transition-all duration-200 ease-out",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400",
            thinkingMode
              ? "bg-purple-100 text-purple-600 hover:bg-purple-200 shadow-sm"
              : "bg-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600",
            disabled && "pointer-events-none"
          )}
          title={thinkingMode ? "사고 모드 켜짐" : "사고 모드 꺼짐"}
        >
          <Brain className={cn(
            "w-5 h-5 transition-transform duration-200",
            thinkingMode && "scale-110"
          )} />
        </button>
      )}

      {/* Center: Textarea */}
      <div className="flex-1 flex items-center min-h-[24px]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? '워크플로우를 불러와주세요' : placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full bg-transparent border-none resize-none outline-none",
            "text-[15px] leading-[1.5] text-gray-900 placeholder:text-gray-400",
            scrollbarHideClass,
            "disabled:cursor-not-allowed"
          )}
          style={{ height: `${minHeight}px` }}
        />
      </div>

      {/* Right: Send Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSend}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-xl shrink-0",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          canSend
            ? "bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        )}
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
}
