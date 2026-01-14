'use client';

// Provider별 아이콘 매핑 (remixicon 사용)
// miso는 API에서 아이콘을 가져오지만, 뷰어는 정적 아이콘 사용
const PROVIDER_ICONS: Record<string, { icon: string; color: string; label?: string }> = {
  openai: { icon: 'ri-openai-fill', color: '#10A37F' },
  anthropic: { icon: 'ri-robot-2-line', color: '#D97706' },
  azure_openai: { icon: 'ri-microsoft-fill', color: '#0078D4' },
  google: { icon: 'ri-google-fill', color: '#4285F4' },
  gemini: { icon: 'ri-google-fill', color: '#4285F4' },
  bedrock: { icon: 'ri-amazon-fill', color: '#FF9900', label: 'Bedrock' },
  'amazon-bedrock': { icon: 'ri-amazon-fill', color: '#FF9900', label: 'Bedrock' },
  claude: { icon: 'ri-robot-2-line', color: '#D97706' },
  cohere: { icon: 'ri-cpu-line', color: '#39594D' },
  mistral: { icon: 'ri-sparkling-line', color: '#F7931A' },
  ollama: { icon: 'ri-server-line', color: '#333333' },
  huggingface: { icon: 'ri-emoji-sticker-line', color: '#FFD21E' },
  replicate: { icon: 'ri-flashlight-line', color: '#000000' },
  tongyi: { icon: 'ri-cloud-line', color: '#FF6A00', label: '통의' },
  zhipu: { icon: 'ri-brain-line', color: '#2563EB', label: '지푸' },
  minimax: { icon: 'ri-chat-ai-line', color: '#6366F1' },
  baichuan: { icon: 'ri-chat-1-line', color: '#22C55E' },
  spark: { icon: 'ri-fire-line', color: '#EF4444', label: '스파크' },
  wenxin: { icon: 'ri-quill-pen-line', color: '#2563EB', label: '문심' },
  deepseek: { icon: 'ri-search-eye-line', color: '#4F46E5' },
  groq: { icon: 'ri-speed-line', color: '#F55036' },
  together: { icon: 'ri-team-line', color: '#000000' },
  fireworks: { icon: 'ri-fire-fill', color: '#FF6B00' },
};

// Provider 이름에서 아이콘 정보 가져오기
function getProviderIcon(provider: string): { icon: string; color: string } {
  const lowerProvider = provider.toLowerCase();

  // 정확한 매칭 먼저
  if (PROVIDER_ICONS[lowerProvider]) {
    return PROVIDER_ICONS[lowerProvider];
  }

  // 부분 매칭
  for (const [key, value] of Object.entries(PROVIDER_ICONS)) {
    if (lowerProvider.includes(key) || key.includes(lowerProvider)) {
      return value;
    }
  }

  // 기본 아이콘
  return { icon: 'ri-robot-line', color: '#6B7280' };
}

interface LLMNodeProps {
  data: {
    model?: {
      provider: string;
      name: string;
    };
    context?: { enabled: boolean };
    vision?: { enabled: boolean };
    memory?: { window?: { enabled: boolean } };
  };
}

export function LLMNode({ data }: LLMNodeProps) {
  const { model, context, vision, memory } = data;

  if (!model) {
    return (
      <div className="flex items-center min-h-[33px] p-2 border border-gray-200 rounded-md bg-white">
        <span className="text-[12px] text-gray-400">모델 미선택</span>
      </div>
    );
  }

  const providerIcon = getProviderIcon(model.provider);

  return (
    <div className="flex items-center min-h-[33px] p-2 border border-gray-200 rounded-md bg-white">
      <div className="flex items-center gap-2 font-normal">
        {/* Provider 아이콘 */}
        <i
          className={`${providerIcon.icon} text-[18px]`}
          style={{ color: providerIcon.color }}
        />

        {/* 모델 이름 */}
        <span className="text-[13px] font-semibold text-gray-800">
          {model.name}
        </span>

        {/* 기능 아이콘들 */}
        <span className="flex items-center gap-1 text-[13px]">
          {context?.enabled && (
            <i className="ri-file-text-line text-gray-400" title="컨텍스트" />
          )}
          {vision?.enabled && (
            <i className="ri-image-line text-gray-400" title="비전" />
          )}
          {memory?.window?.enabled && (
            <i className="ri-brain-line text-gray-400" title="메모리" />
          )}
        </span>
      </div>
    </div>
  );
}
