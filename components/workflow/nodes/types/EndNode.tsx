'use client';

interface EndNodeProps {
  data: {
    outputs?: Array<{
      variable: string;
      value_selector?: string[];
    }>;
  };
}

export function EndNode({ data }: EndNodeProps) {
  // miso와 동일하게 빈 컴포넌트
  return null;
}
