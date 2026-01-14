'use client';

import { cn } from '@/lib/utils';
import { getNodeColor } from '../tokens/colors';
import { nodeLayout } from '../tokens/spacing';
import { nodeTypography } from '../tokens/typography';
import { NodeIcon } from './NodeIcon';
import { NODE_TITLES } from '@/lib/constants';

interface NodeCardProps {
  id: string;
  type: string;
  title?: string;
  selected?: boolean;
  isIteration?: boolean;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  className?: string;
}

/**
 * 노드 카드 - miso 스타일 기반 + 개선
 * 좌측 컬러 바 + 깔끔한 그림자
 */
export function NodeCard({
  id,
  type,
  title,
  selected,
  isIteration,
  width,
  height,
  children,
  className,
}: NodeCardProps) {
  const color = getNodeColor(type);
  const displayTitle = title || NODE_TITLES[type] || type;

  return (
    <div
      className={cn(
        // 기본 스타일
        'relative bg-white rounded-xl overflow-hidden',
        // 그림자
        'shadow-[0_1px_3px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)]',
        // 트랜지션
        'transition-all duration-150 ease-out',
        // 호버 상태
        'hover:shadow-[0_4px_12px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.08)]',
        // 선택 상태 - miso 스타일 (검정 테두리)
        selected && 'ring-2 ring-gray-900 shadow-[0_4px_16px_rgba(0,0,0,0.12),0_8px_32px_rgba(0,0,0,0.08)]',
        className
      )}
      style={{
        width: isIteration ? width : nodeLayout.width,
        height: isIteration ? height : 'auto',
        minHeight: isIteration ? undefined : nodeLayout.minHeight,
      }}
    >
      {/* 좌측 컬러 바 - 항상 표시 (miso 스타일) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 z-10"
        style={{ backgroundColor: color.bg }}
      />

      {/* 노드 내용 */}
      <div
        className="relative"
        style={{
          padding: `${nodeLayout.paddingY}px ${nodeLayout.paddingX}px`,
          paddingLeft: `${nodeLayout.paddingX + 4}px`, // 컬러 바 공간
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center gap-2">
          {/* 아이콘 */}
          <NodeIcon type={type} size={18} />

          {/* 타이틀 */}
          <h3 className={cn(nodeTypography.title, 'truncate flex-1')}>
            {displayTitle}
          </h3>
        </div>

        {/* 내용 (자식 컴포넌트) */}
        {children && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
