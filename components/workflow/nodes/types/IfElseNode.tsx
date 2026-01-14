'use client';

import { cn } from '@/lib/utils';
import { useViewerStore } from '@/store/viewer-store';
import { COMPARISON_OPERATOR_KR, LOGICAL_OPERATOR_KR } from '@/lib/constants';

interface Condition {
  variable_selector?: string[];
  comparison_operator?: string;
  value: string | string[];
}

interface CaseItem {
  case_id: string;
  logical_operator: string;
  conditions: Condition[];
}

interface IfElseNodeProps {
  data: {
    _targetBranches?: Array<{ id: string; name: string }>;
    cases?: CaseItem[];
  };
}

export function IfElseNode({ data }: IfElseNodeProps) {
  const { nodes } = useViewerStore();
  const { cases } = data;

  // 노드 ID로 노드 제목 가져오기
  const getNodeTitle = (nodeId: string): string => {
    const node = nodes.find((n) => n.id === nodeId);
    return (node?.data?.title as string) || nodeId.slice(0, 8);
  };

  if (!cases || cases.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {cases.map((caseItem, caseIdx) => {
        const isElse = caseItem.case_id === 'false';
        const isIf = caseItem.case_id === 'true' || caseIdx === 0;
        const label = isIf && !isElse ? 'IF' : isElse ? 'ELSE' : 'ELIF';

        return (
          <div
            key={caseItem.case_id}
            className="p-2 border border-gray-200 rounded-lg bg-white space-y-1.5"
          >
            {/* Case 헤더 */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-[11px] font-bold px-1.5 py-0.5 rounded',
                  isElse && 'bg-gray-100 text-gray-500',
                  isIf && !isElse && 'bg-sky-100 text-sky-600',
                  !isIf && !isElse && 'bg-sky-50 text-sky-500',
                )}
              >
                {label}
              </span>
              {!isElse && caseItem.conditions.length > 1 && (
                <span className="text-[10px] text-gray-400 px-1.5 py-0.5 rounded bg-gray-50">
                  {LOGICAL_OPERATOR_KR[caseItem.logical_operator] || caseItem.logical_operator}
                </span>
              )}
            </div>

            {/* 조건들 - ELSE는 조건 없음 */}
            {!isElse && caseItem.conditions.length > 0 && (
              <div className="space-y-1">
                {caseItem.conditions.slice(0, 2).map((condition, condIdx) => (
                  <ConditionRow
                    key={condIdx}
                    condition={condition}
                    showLogical={condIdx > 0}
                    logicalOperator={caseItem.logical_operator}
                    getNodeTitle={getNodeTitle}
                  />
                ))}
                {caseItem.conditions.length > 2 && (
                  <span className="text-[10px] text-gray-400">
                    +{caseItem.conditions.length - 2}개 더...
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 조건 행 컴포넌트
function ConditionRow({
  condition,
  showLogical,
  logicalOperator,
  getNodeTitle,
}: {
  condition: Condition;
  showLogical: boolean;
  logicalOperator: string;
  getNodeTitle: (nodeId: string) => string;
}) {
  const varSelector = condition.variable_selector || [];
  const isEnv = varSelector[0] === 'env';
  const nodeId = varSelector[0];
  const varName = varSelector[varSelector.length - 1];
  const nodeTitle = isEnv ? 'env' : getNodeTitle(nodeId);

  const operator = COMPARISON_OPERATOR_KR[condition.comparison_operator || ''] || condition.comparison_operator || '';
  const value = Array.isArray(condition.value)
    ? condition.value.join(', ')
    : String(condition.value || '');

  return (
    <div className="flex items-center gap-1 flex-wrap text-[11px] min-h-[24px] px-1.5 py-1 bg-gray-50 rounded overflow-hidden">
      {/* 논리 연산자 */}
      {showLogical && (
        <span className="text-gray-400 text-[10px] mr-1 flex-shrink-0">
          {LOGICAL_OPERATOR_KR[logicalOperator] || logicalOperator}
        </span>
      )}

      {/* 변수 (노드/변수명) */}
      <span className="inline-flex items-center gap-0.5 min-w-0">
        <span
          className={cn(
            'min-w-[14px] h-[14px] text-[9px] font-medium rounded flex items-center justify-center text-white flex-shrink-0',
            isEnv ? 'bg-orange-500' : 'bg-blue-500',
          )}
        >
          {isEnv ? 'e' : 'v'}
        </span>
        <span className="font-medium text-gray-700 truncate max-w-[80px]">
          {nodeTitle}/{varName}
        </span>
      </span>

      {/* 연산자 */}
      <span className="text-gray-500 flex-shrink-0">{operator}</span>

      {/* 값 */}
      {value && (
        <span className="text-gray-600 truncate max-w-[60px]">
          {value}
        </span>
      )}
    </div>
  );
}
