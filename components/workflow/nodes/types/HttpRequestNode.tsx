'use client';

import { VariableTag, hasVariableRef } from '@/components/workflow/common/VariableTag';

interface HttpRequestNodeProps {
  data: {
    method?: string;
    url?: string;
    authorization?: { type: string };
  };
}

export function HttpRequestNode({ data }: HttpRequestNodeProps) {
  const { method, url } = data;

  return (
    <div className="flex items-center min-h-[33px] p-2 border border-gray-200 rounded-md bg-white">
      <div className="flex items-center gap-1.5 text-[12px] text-gray-800">
        <span className="font-semibold whitespace-nowrap">
          {(method || 'GET').toUpperCase()}
        </span>
        {url && hasVariableRef(url) ? (
          <VariableTag value={url} className="text-gray-600 truncate max-w-[180px]" />
        ) : (
          <span className="text-gray-600 truncate max-w-[200px]">
            {url || ''}
          </span>
        )}
      </div>
    </div>
  );
}
