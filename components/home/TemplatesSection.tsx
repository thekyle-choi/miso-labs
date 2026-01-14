'use client';

import { useRouter } from 'next/navigation';
import { GlowSearchBar } from './GlowSearchBar';

// 샘플 앱 목록 (실제로는 API에서 가져올 데이터)
const sampleApps = [
  {
    id: 'pdf-summary',
    icon: '📄',
    name: 'PDF 요약 분석',
    description: 'PDF 문서를 업로드하면 자동으로 요약해줘요',
    nodeCount: 4,
    category: '문서',
  },
  {
    id: 'customer-support',
    icon: '💬',
    name: '고객 문의 자동응답',
    description: 'FAQ 기반으로 고객 질문에 답변해요',
    nodeCount: 6,
    category: '고객지원',
  },
  {
    id: 'content-generator',
    icon: '✍️',
    name: '블로그 콘텐츠 생성',
    description: '키워드만 입력하면 글을 작성해줘요',
    nodeCount: 5,
    category: '콘텐츠',
  },
  {
    id: 'email-classifier',
    icon: '📧',
    name: '이메일 분류기',
    description: '받은 이메일을 자동으로 분류해요',
    nodeCount: 7,
    category: '업무자동화',
  },
  {
    id: 'meeting-summary',
    icon: '🎙️',
    name: '회의록 정리',
    description: '회의 녹음을 텍스트로 정리해줘요',
    nodeCount: 5,
    category: '업무자동화',
  },
  {
    id: 'data-extractor',
    icon: '📊',
    name: '데이터 추출기',
    description: '문서에서 필요한 정보만 뽑아줘요',
    nodeCount: 4,
    category: '데이터',
  },
  {
    id: 'translation-bot',
    icon: '🌐',
    name: '다국어 번역',
    description: '여러 언어로 자동 번역해줘요',
    nodeCount: 3,
    category: '번역',
  },
  {
    id: 'sentiment-analysis',
    icon: '😊',
    name: '감정 분석',
    description: '텍스트의 감정을 분석해줘요',
    nodeCount: 4,
    category: '분석',
  },
  {
    id: 'code-reviewer',
    icon: '👨‍💻',
    name: '코드 리뷰어',
    description: '코드를 검토하고 개선점을 알려줘요',
    nodeCount: 5,
    category: '개발',
  },
  {
    id: 'report-generator',
    icon: '📈',
    name: '리포트 생성기',
    description: '데이터로 보고서를 자동 생성해요',
    nodeCount: 6,
    category: '비즈니스',
  },
];

export function TemplatesSection() {
  const router = useRouter();

  const handleAppClick = (appId: string) => {
    router.push(`/viewer?sample=${appId}`);
  };

  return (
    <section className="p-6 lg:p-10 flex flex-col h-full bg-white text-gray-900 overflow-hidden">
      {/* Section Header - Fixed */}
      <div className="flex-shrink-0 mb-6">
        <div className="inline-flex items-center gap-2 mb-3 px-3 h-8 bg-indigo-500/10 rounded-full border border-indigo-500/20">
          <span className="text-base leading-none">💡</span>
          <span className="text-xs font-medium text-indigo-600">처음이신가요?</span>
        </div>
        <h1 className="text-xl lg:text-2xl font-semibold leading-tight text-gray-900">
          &quot;처음인데, 뭐부터 해야 하나요?&quot;
        </h1>
        <p className="mt-2 text-gray-500 text-sm">
          샘플 앱을 눌러서 워크플로우 구조를 확인해보세요
        </p>
      </div>

      {/* Search Bar - Fixed */}
      <div className="flex-shrink-0 mb-4">
        <GlowSearchBar placeholder="앱 검색..." />
      </div>

      {/* App List - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-hide">
        <div className="space-y-0.5 pb-4">
          {sampleApps.map((app) => (
            <div
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 cursor-pointer transition-all"
            >
              <div className="w-10 h-10 bg-gray-100 group-hover:bg-white rounded-lg flex items-center justify-center text-lg transition-colors">
                {app.icon}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                    {app.name}
                  </h3>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">
                    {app.nodeCount}개 노드
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate">{app.description}</p>
              </div>
              <span className="material-symbols-outlined text-gray-300 group-hover:text-indigo-500 transition-colors text-base opacity-0 group-hover:opacity-100">
                arrow_forward
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer hint - Fixed */}
      <div className="flex-shrink-0 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          직접 만든 YAML 파일이 있다면 드래그해서 올려보세요
        </p>
      </div>
    </section>
  );
}

export default TemplatesSection;
