'use client';

interface KnowledgeRetrievalNodeProps {
  data: {
    retrieval_mode?: string;
    dataset_ids?: string[];
    dataset_retrieval_configs?: Array<{
      dataset_id: string;
      dataset_name?: string;
    }>;
  };
}

export function KnowledgeRetrievalNode({ data }: KnowledgeRetrievalNodeProps) {
  const { dataset_ids, dataset_retrieval_configs } = data;

  // 데이터셋 정보 가져오기
  const datasets = dataset_ids?.map(id => {
    const config = dataset_retrieval_configs?.find(c => c.dataset_id === id);
    return {
      id,
      name: config?.dataset_name || id.slice(0, 8),
    };
  }) || [];

  if (datasets.length === 0) {
    return (
      <div className="flex items-center min-h-[33px] p-2 border border-gray-200 rounded-md bg-white">
        <span className="text-[12px] text-gray-400">지식 미선택</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {datasets.map((dataset, index) => (
        <div
          key={index}
          className="flex items-center justify-between min-h-[33px] p-2 border border-gray-200 rounded-md bg-white"
        >
          <div className="flex items-center gap-1.5">
            <i className="ri-link-m text-gray-500" />
            <span className="text-[12px] text-gray-700">{dataset.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
