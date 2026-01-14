'use client';

import { Handle, Position } from '@xyflow/react';
import { NodeCard } from '@/components/design-system/primitives/NodeCard';
import { BlockEnum } from '@/types/workflow';

interface Branch {
  id: string;
  name: string;
}

interface BaseNodeProps {
  id: string;
  type: string;
  title?: string;
  selected?: boolean;
  isIteration?: boolean;
  width?: number;
  height?: number;
  sourceHandleIds?: string[];
  branches?: Branch[];
  children?: React.ReactNode;
}

/**
 * 기본 노드 래퍼 컴포넌트
 * React Flow 핸들과 NodeCard를 결합
 */
export function BaseNode({
  id,
  type,
  title,
  selected,
  isIteration,
  width,
  height,
  sourceHandleIds,
  branches,
  children,
}: BaseNodeProps) {
  const isStart = type === BlockEnum.Start;
  const isEnd = type === BlockEnum.End;
  const isIterationStart = type === BlockEnum.IterationStart || type === BlockEnum.LoopStart;

  // 다중 출력 핸들을 가지는 노드 타입
  const hasMultipleOutputs = type === BlockEnum.IfElse ||
                              type === BlockEnum.QuestionClassifier ||
                              type === BlockEnum.Iteration ||
                              type === BlockEnum.Loop;

  // 출력 핸들 ID 목록 결정
  const outputHandleIds = sourceHandleIds && sourceHandleIds.length > 0
    ? sourceHandleIds
    : ['source'];

  // if-else 노드의 경우 핸들 위치 계산 (분기 라벨과 정렬)
  // 헤더 높이(약 50px) + 구분선 + 분기 시작 위치
  const headerOffset = 62; // 헤더 + 패딩 + 구분선
  const branchItemHeight = 28; // 각 분기 아이템 높이

  // iteration-start/loop-start는 특수 처리 (빈 시작 노드)
  if (isIterationStart) {
    return (
      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
        <Handle
          type="source"
          position={Position.Right}
          id="source"
          className="!w-3 !h-3 !bg-white !border-2 !border-gray-400 hover:!border-gray-600 !transition-colors"
        />
      </div>
    );
  }

  return (
    <>
      {/* 입력 핸들 (시작 노드 제외) */}
      {!isStart && (
        <Handle
          type="target"
          position={Position.Left}
          id="target"
          className="!w-3 !h-3 !bg-white !border-2 !border-gray-400 hover:!border-gray-600 !transition-colors"
        />
      )}

      {/* 노드 카드 */}
      <NodeCard
        id={id}
        type={type}
        title={title}
        selected={selected}
        isIteration={isIteration}
        width={width}
        height={height}
      >
        {children}
      </NodeCard>

      {/* 출력 핸들 - 다중 핸들 지원 */}
      {!isEnd && (
        hasMultipleOutputs && branches && branches.length > 0 ? (
          // if-else 노드: 분기별 핸들 (분기 라벨과 정렬)
          branches.map((branch, index) => (
            <Handle
              key={branch.id}
              type="source"
              position={Position.Right}
              id={branch.id}
              className="!w-3 !h-3 !bg-white !border-2 !border-gray-400 hover:!border-gray-600 !transition-colors"
              style={{
                top: headerOffset + (index * branchItemHeight) + (branchItemHeight / 2),
              }}
            />
          ))
        ) : hasMultipleOutputs ? (
          // 다중 출력 (분기 정보 없을 때 fallback)
          outputHandleIds.map((handleId, index) => (
            <Handle
              key={handleId}
              type="source"
              position={Position.Right}
              id={handleId}
              className="!w-3 !h-3 !bg-white !border-2 !border-gray-400 hover:!border-gray-600 !transition-colors"
              style={{
                top: `${((index + 1) / (outputHandleIds.length + 1)) * 100}%`,
              }}
            />
          ))
        ) : (
          // 단일 출력 핸들
          <Handle
            type="source"
            position={Position.Right}
            id="source"
            className="!w-3 !h-3 !bg-white !border-2 !border-gray-400 hover:!border-gray-600 !transition-colors"
          />
        )
      )}
    </>
  );
}
