'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { AppHeader } from '@/components/layout';
import { getAllSampleWorkflows } from '@/data/sample-workflows';

// 카테고리별 아이콘 매핑
const categoryIcons: Record<string, string> = {
  '금융/무역': '💰',
  '문서 처리': '📄',
  '헬스케어': '🏥',
  '리테일/유통': '🛒',
  '마케팅/PR': '📢',
  '법무/계약': '⚖️',
  '안전/보건': '🦺',
  '기타': '📌',
};

const sampleApps = getAllSampleWorkflows().map((workflow) => ({
  id: workflow.id,
  icon: categoryIcons[workflow.category || '기타'] || '📌',
  name: workflow.name,
  description: workflow.description,
  category: workflow.category || '기타',
  mode: workflow.mode,
}));

export default function TemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleAppClick = (appId: string) => {
    router.push(`/templates/viewer?sample=${appId}`);
  };

  // 검색 필터링
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) {
      return sampleApps;
    }

    const query = searchQuery.toLowerCase();
    return sampleApps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      {/* Header */}
      <AppHeader />

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-10 flex items-start justify-between gap-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">
              MISO 활용 사례
            </h1>
            <p className="text-gray-500">
              다양한 워크플로우 샘플을 살펴보고 영감을 얻어보세요
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-80 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="워크플로우 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Results Count */}
        {searchQuery && (
          <div className="mb-4 text-sm text-gray-500">
            {filteredApps.length}개의 워크플로우를 찾았습니다
          </div>
        )}

        {/* App Grid */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className="group p-5 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-gray-100 group-hover:bg-gray-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {app.icon}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {app.name}
                      </h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {app.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{app.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-2">🔍</div>
            <p className="text-gray-500 mb-1">검색 결과가 없습니다</p>
            <p className="text-sm text-gray-400">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </main>
    </div>
  );
}
