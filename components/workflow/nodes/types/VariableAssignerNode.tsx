'use client';

interface VariableAssignerNodeProps {
  data: {
    items?: Array<{
      variable_selector: string[];
      operation: string;
      value: any;
    }>;
  };
}

export function VariableAssignerNode({ data }: VariableAssignerNodeProps) {
  // 상세 정보는 패널에서 확인
  return null;
}
