'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MockProject } from '@/lib/mock-data';

interface ProjectResultCardProps {
  project: MockProject;
  onClick: () => void;
}

export function ProjectResultCard({ project, onClick }: ProjectResultCardProps) {
  // 상대 시간 포맷
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    return `${Math.floor(diffDays / 30)}개월 전`;
  };

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer',
        'transition-all duration-200',
        'hover:shadow-md hover:border-gray-300',
        'active:scale-[0.99]'
      )}
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* 아이콘 */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ backgroundColor: project.iconBackground }}
        >
          {project.icon}
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3 className="text-lg font-medium text-foreground truncate">
            {project.name}
          </h3>

          {/* 설명 */}
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {project.description}
          </p>

          {/* 메타 정보 */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* 모드 뱃지 */}
            <Badge variant="secondary" className="text-xs">
              {project.mode === 'chatflow' ? 'Chatflow' : 'Workflow'}
            </Badge>

            {/* 노드 개수 */}
            <span className="text-xs text-muted-foreground">
              {project.nodeCount} nodes
            </span>

            {/* 수정 시간 */}
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(project.lastModified)}
            </span>

            {/* 태그 (최대 2개) */}
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
