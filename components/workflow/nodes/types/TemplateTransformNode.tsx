'use client';

interface TemplateTransformNodeProps {
  data: {
    template_language?: string;
    template?: string;
    outputs?: Record<string, { type: string }>;
  };
}

export function TemplateTransformNode({ data }: TemplateTransformNodeProps) {
  // miso와 동일하게 빈 컴포넌트
  return null;
}
