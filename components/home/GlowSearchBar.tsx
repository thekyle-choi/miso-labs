'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GlowSearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export function GlowSearchBar({
  placeholder = 'Search templates (e.g. Portfolio, Store)...',
  className,
  onSearch,
}: GlowSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(query);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full group z-10 neon-search rounded-xl transition-all duration-300 border border-gray-200',
        className
      )}
    >
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-indigo-600 transition-colors text-lg">
          search
        </span>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="block w-full pl-11 pr-12 py-4 rounded-xl leading-5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm font-mono transition-all border-none"
        placeholder={placeholder}
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <kbd className="inline-flex items-center border border-gray-200 rounded px-2 py-1 text-[10px] font-mono text-gray-400 bg-gray-50">
          CTRL+K
        </kbd>
      </div>
    </div>
  );
}

export default GlowSearchBar;
