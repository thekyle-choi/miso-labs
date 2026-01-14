'use client';

interface IterationNodeProps {
  data: {
    is_parallel?: boolean;
    parallel_nums?: number;
    error_handle_mode?: string;
    _children?: string[];
  };
}

export function IterationNode({ data }: IterationNodeProps) {
  // Iteration 노드는 컨테이너 역할 - 내용 없음
  return null;
}
