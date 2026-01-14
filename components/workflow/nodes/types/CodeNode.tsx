'use client';

interface CodeNodeProps {
  data: {
    code_language?: string;
    code?: string;
    outputs?: Record<string, { type: string }>;
  };
}

export function CodeNode({ data }: CodeNodeProps) {
  // miso와 동일하게 빈 컴포넌트 - 상세는 NodeInfoPanel에서 표시
  return null;
}
