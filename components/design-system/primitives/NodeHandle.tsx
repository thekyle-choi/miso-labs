'use client';

import { Handle, Position, type HandleProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

interface NodeHandleProps extends Omit<HandleProps, 'position'> {
  position: Position;
  className?: string;
}

/**
 * 노드 연결 핸들 컴포넌트
 * React Flow Handle의 스타일링된 버전
 */
export function NodeHandle({
  type,
  position,
  id,
  className,
  ...props
}: NodeHandleProps) {
  return (
    <Handle
      type={type}
      position={position}
      id={id}
      className={cn(
        'w-2 h-2 rounded-full',
        'bg-gray-400 border-2 border-white',
        'hover:bg-gray-600 transition-colors',
        className
      )}
      {...props}
    />
  );
}
