'use client';

interface ToolNodeProps {
  data: {
    tool_label?: string;
    tool_name?: string;
    provider_name?: string;
    provider_type?: string;
  };
}

export function ToolNode({ data }: ToolNodeProps) {
  // miso와 비슷하게 - 도구 정보만 간단히 표시
  // 파라미터는 패널에서 확인
  return null;
}
