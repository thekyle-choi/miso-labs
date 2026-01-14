'use client';

import { VariableTag, hasVariableRef } from '@/components/workflow/common/VariableTag';

interface AnswerNodeProps {
  data: {
    answer?: string;
  };
}

export function AnswerNode({ data }: AnswerNodeProps) {
  const { answer } = data;

  if (!answer) {
    return null;
  }

  // 변수 참조가 있으면 VariableTag로 표시
  if (hasVariableRef(answer)) {
    return (
      <div className="flex items-center min-h-[33px] p-2 border border-gray-200 rounded-md bg-white">
        <VariableTag value={answer} className="text-[12px] text-gray-600 line-clamp-2" />
      </div>
    );
  }

  // 일반 텍스트 미리보기 (60자 제한)
  const preview = answer.length > 60 ? `${answer.substring(0, 60)}...` : answer;

  return (
    <div className="flex items-center min-h-[33px] p-2 border border-gray-200 rounded-md bg-white">
      <span className="text-[12px] text-gray-600 line-clamp-2">
        {preview}
      </span>
    </div>
  );
}
