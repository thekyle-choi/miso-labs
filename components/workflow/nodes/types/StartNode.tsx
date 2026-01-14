'use client';

// 입력 타입 한글 매핑
const INPUT_TYPE_KR: Record<string, string> = {
  'text-input': '텍스트',
  'paragraph': '문단',
  'number': '숫자',
  'select': '선택',
  'file': '파일',
  'file-list': '파일 목록',
};

interface StartNodeProps {
  data: {
    variables?: Array<{
      variable: string;
      type?: string;
      label?: string;
      required?: boolean;
    }>;
  };
}

export function StartNode({ data }: StartNodeProps) {
  const { variables } = data;

  if (!variables || variables.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1.5">
      {variables.map((variable, index) => (
        <div
          key={index}
          className="flex items-center justify-between min-h-[33px] p-2 border border-gray-200 rounded-md bg-white"
        >
          {variable.variable && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="min-w-[14px] h-[14px] text-[10px] font-medium rounded flex items-center justify-center bg-blue-500 text-white">
                  v
                </span>
                <span className="text-[12px] font-semibold text-gray-800">
                  {variable.variable}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                {variable.required && <span className="italic">필수</span>}
                <span className="italic">{INPUT_TYPE_KR[variable.type || ''] || variable.type}</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
