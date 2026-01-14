'use client';

import { cn } from '@/lib/utils';
import { nodeTypography } from '../tokens/typography';
import { LOGICAL_OPERATOR_KR } from '@/lib/constants';

interface CaseItem {
  case_id: string;
  logical_operator: string;
  conditions: Array<{
    variable_selector?: string[];
    comparison_operator?: string;
    value: string | string[];
  }>;
}

interface ConditionDisplayProps {
  cases: CaseItem[];
  maxDisplay?: number;
  className?: string;
}

/**
 * 조건 분기 표시 패턴
 * IF/ELSE 노드의 조건 로직 표시
 */
export function ConditionDisplay({
  cases,
  maxDisplay = 3,
  className,
}: ConditionDisplayProps) {
  if (!cases || cases.length === 0) {
    return (
      <span className={cn(nodeTypography.caption, 'text-gray-400')}>
        조건 없음
      </span>
    );
  }

  const displayCases = cases.slice(0, maxDisplay);
  const remaining = cases.length - maxDisplay;

  return (
    <div className={cn('space-y-1 border-t pt-2', className)}>
      {displayCases.map((caseItem, index) => (
        <div
          key={caseItem.case_id}
          className="flex items-center gap-2 text-xs"
        >
          <span className="font-medium text-sky-600">
            {index === 0 ? 'IF' : 'ELIF'}
          </span>
          <span className="text-muted-foreground">
            {caseItem.conditions.length}개 조건
            <span className="ml-1 text-gray-400">
              ({LOGICAL_OPERATOR_KR[caseItem.logical_operator] || caseItem.logical_operator})
            </span>
          </span>
        </div>
      ))}
      {remaining > 0 && (
        <span className={cn(nodeTypography.caption, 'text-gray-400')}>
          +{remaining}개 더...
        </span>
      )}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-medium text-gray-600">ELSE</span>
      </div>
    </div>
  );
}
