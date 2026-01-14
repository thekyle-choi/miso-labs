'use client';

import { memo } from 'react';
import {
  getBezierPath,
  type EdgeProps,
  useStore,
} from '@xyflow/react';

/**
 * React Flow 커스텀 엣지 렌더러
 * 선택된 노드에 연결된 엣지에 에너지 흐름 애니메이션 적용
 */
function CustomEdgeComponent({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // 선택된 노드 ID 가져오기
  const selectedNodeIds = useStore((state) => {
    const selectedNodes = state.nodes.filter((n) => n.selected);
    return selectedNodes.map((n) => n.id);
  });

  // 이 엣지가 선택된 노드에 연결되어 있는지 확인
  const isConnectedToSelected = selectedNodeIds.includes(source) || selectedNodeIds.includes(target);

  // 선택된 노드에서 나가는 엣지인지 (에너지 흐름 방향)
  const isOutgoing = selectedNodeIds.includes(source);
  const isIncoming = selectedNodeIds.includes(target);

  // 노드 타입별 색상 결정
  const sourceType = data?.sourceType as string | undefined;
  const edgeColor = isConnectedToSelected
    ? getEdgeColor(sourceType)
    : '#b1b1b7';

  return (
    <g className="react-flow__edge">
      {/* 배경 엣지 (glow 효과용) */}
      {isConnectedToSelected && (
        <path
          d={edgePath}
          fill="none"
          stroke={edgeColor}
          strokeWidth={6}
          strokeOpacity={0.15}
          className="edge-glow"
          style={{ color: edgeColor }}
        />
      )}

      {/* 메인 엣지 */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
        stroke={edgeColor}
        strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
        style={{
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
        }}
      />

      {/* 에너지 흐름 애니메이션 레이어 */}
      {isConnectedToSelected && (
        <path
          d={edgePath}
          fill="none"
          stroke={isOutgoing ? edgeColor : (isIncoming ? edgeColor : '#6366f1')}
          strokeWidth={2}
          strokeDasharray="8 16"
          strokeLinecap="round"
          className="edge-energy-flow"
          style={{
            animationDirection: isIncoming ? 'reverse' : 'normal',
          }}
        />
      )}

      {/* 선택된 노드 연결 시 화살표 마커 효과 */}
      {isConnectedToSelected && (
        <circle
          r={3}
          fill={edgeColor}
          className="edge-glow"
          style={{ color: edgeColor }}
        >
          <animateMotion
            dur="1s"
            repeatCount="indefinite"
            path={edgePath}
            keyPoints={isIncoming ? "1;0" : "0;1"}
            keyTimes="0;1"
          />
        </circle>
      )}
    </g>
  );
}

/**
 * 소스 노드 타입에 따른 엣지 색상 결정
 */
function getEdgeColor(sourceType: string | undefined): string {
  const colorMap: Record<string, string> = {
    'start': '#4b4e63',
    'llm': '#6366f1',
    'knowledge-retrieval': '#f79009',
    'answer': '#31B04D',
    'question-classifier': '#31b04d',
    'if-else': '#0ea5e9',
    'iteration': '#E81995',
    'code': '#3b82f6',
    'template-transform': '#3b82f6',
    'http-request': '#222222',
    'tool': '#4b4e63',
    'variable-aggregator': '#3b82f6',
    'parameter-extractor': '#3b82f6',
    'assigner': '#3b82f6',
    'document-extractor': '#3b82f6',
  };

  return sourceType ? (colorMap[sourceType] || '#6366f1') : '#6366f1';
}

export const CustomEdge = memo(CustomEdgeComponent);
