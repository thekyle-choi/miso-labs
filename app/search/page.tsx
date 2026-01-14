'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FloatingHeader } from '@/components/layout';
import { UnifiedSearchBar } from '@/components/search';
import { ResultsList } from '@/components/search-results';
import { searchProjects } from '@/lib/mock-data';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // 검색 결과
  const results = useMemo(() => {
    return searchProjects(query);
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Header */}
      <FloatingHeader />

      {/* Main Content */}
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Search Bar (Secondary) */}
          <div className="mb-8">
            <UnifiedSearchBar variant="main" initialQuery={query} />
          </div>

          {/* Search Results */}
          <ResultsList results={results} query={query} />
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
