/**
 * Chat Store - Zustand 채팅 상태 관리
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// ============================================
// 타입 정의
// ============================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  nodeId?: string; // 특정 노드와 관련된 질문인 경우
  isWelcome?: boolean; // 환영 메시지 여부 (스트리밍 효과 없음)
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  thinkingMode: boolean;
}

interface ChatActions {
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  updateMessage: (id: string, content: string) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleThinkingMode: () => void;
}

type ChatStore = ChatState & ChatActions;

// ============================================
// 초기 상태
// ============================================

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  thinkingMode: false,
};

// ============================================
// Store 생성
// ============================================

export const useChatStore = create<ChatStore>()(
  immer((set) => ({
    ...initialState,

    addMessage: (message) => {
      const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      set((state) => {
        state.messages.push({
          ...message,
          id,
          timestamp: Date.now(),
        });
      });
      return id;
    },

    updateMessage: (id, content) => {
      set((state) => {
        const message = state.messages.find((m) => m.id === id);
        if (message) {
          message.content = content;
        }
      });
    },

    clearMessages: () => {
      set((state) => {
        state.messages = [];
        state.error = null;
      });
    },

    setLoading: (loading) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setError: (error) => {
      set((state) => {
        state.error = error;
      });
    },

    toggleThinkingMode: () => {
      set((state) => {
        state.thinkingMode = !state.thinkingMode;
      });
    },
  }))
);

// ============================================
// 셀렉터 훅
// ============================================

export const useChatMessages = () => useChatStore((s) => s.messages);
export const useIsChatLoading = () => useChatStore((s) => s.isLoading);
export const useChatError = () => useChatStore((s) => s.error);
export const useThinkingMode = () => useChatStore((s) => s.thinkingMode);
