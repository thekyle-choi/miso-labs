'use client';

// Provider별 아이콘 매핑 (remixicon 사용)
const PROVIDER_ICONS: Record<string, { icon: string; color: string }> = {
  openai: { icon: 'ri-openai-fill', color: '#10A37F' },
  anthropic: { icon: 'ri-robot-2-line', color: '#D97706' },
  azure_openai: { icon: 'ri-microsoft-fill', color: '#0078D4' },
  google: { icon: 'ri-google-fill', color: '#4285F4' },
  gemini: { icon: 'ri-google-fill', color: '#4285F4' },
  bedrock: { icon: 'ri-amazon-fill', color: '#FF9900' },
  'amazon-bedrock': { icon: 'ri-amazon-fill', color: '#FF9900' },
  claude: { icon: 'ri-robot-2-line', color: '#D97706' },
  mistral: { icon: 'ri-sparkling-line', color: '#F7931A' },
  ollama: { icon: 'ri-server-line', color: '#333333' },
  deepseek: { icon: 'ri-search-eye-line', color: '#4F46E5' },
  groq: { icon: 'ri-speed-line', color: '#F55036' },
};

function getProviderIcon(provider: string): { icon: string; color: string } {
  const lowerProvider = provider.toLowerCase();
  if (PROVIDER_ICONS[lowerProvider]) return PROVIDER_ICONS[lowerProvider];
  for (const [key, value] of Object.entries(PROVIDER_ICONS)) {
    if (lowerProvider.includes(key)) return value;
  }
  return { icon: 'ri-robot-line', color: '#6B7280' };
}

interface QuestionClassifierNodeProps {
  data: {
    classes?: Array<{ id: string; name: string }>;
    _targetBranches?: Array<{ id: string; name: string }>;
    model?: { provider: string; name: string };
  };
}

export function QuestionClassifierNode({ data }: QuestionClassifierNodeProps) {
  const { classes, _targetBranches, model } = data;

  // 분기 정보: _targetBranches 또는 classes에서 가져옴
  const branches = _targetBranches || classes || [];
  const providerIcon = model ? getProviderIcon(model.provider) : null;

  return (
    <div className="space-y-1.5">
      {/* 모델 정보 */}
      {model && (
        <div className="flex items-center min-h-[33px] p-2 border border-gray-200 rounded-md bg-white">
          <div className="flex items-center gap-2">
            {providerIcon && (
              <i
                className={`${providerIcon.icon} text-[18px]`}
                style={{ color: providerIcon.color }}
              />
            )}
            <span className="text-[13px] font-semibold text-gray-800">
              {model.name}
            </span>
          </div>
        </div>
      )}

      {/* 분류 목록 */}
      {branches.map((branch, index) => (
        <div
          key={branch.id}
          className="flex items-center min-h-[33px] p-2 border border-gray-200 rounded-md bg-white"
        >
          <div className="flex flex-col gap-0.5 w-full">
            <span className="text-[11px] text-gray-400">{`의도${index + 1}`}</span>
            <span className="text-[12px] font-semibold text-gray-800">{branch.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
