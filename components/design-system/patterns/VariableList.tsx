'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { nodeTypography } from '../tokens/typography';

interface Variable {
  variable: string;
  value_selector?: string[];
  type?: string;
}

interface VariableListProps {
  variables: Variable[];
  maxDisplay?: number;
  showType?: boolean;
  className?: string;
}

/**
 * 변수 목록 표시 패턴
 * 노드의 입력/출력 변수 표시
 */
export function VariableList({
  variables,
  maxDisplay = 3,
  showType = false,
  className,
}: VariableListProps) {
  if (!variables || variables.length === 0) {
    return (
      <span className={cn(nodeTypography.caption, 'text-gray-400')}>
        변수 없음
      </span>
    );
  }

  const displayVars = variables.slice(0, maxDisplay);
  const remaining = variables.length - maxDisplay;

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {displayVars.map((v, index) => (
        <Badge
          key={`${v.variable}-${index}`}
          variant="secondary"
          className="text-[10px] font-mono"
        >
          {v.variable}
          {showType && v.type && (
            <span className="ml-1 text-muted-foreground">: {v.type}</span>
          )}
        </Badge>
      ))}
      {remaining > 0 && (
        <span className={cn(nodeTypography.caption)}>
          +{remaining}개 더
        </span>
      )}
    </div>
  );
}
