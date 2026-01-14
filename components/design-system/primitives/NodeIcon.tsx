'use client';

import { NODE_ICON } from '@/lib/constants';
import type { BlockEnum } from '@/types/workflow';

interface NodeIconProps {
  type: BlockEnum | string;
  size?: number;
  className?: string;
}

/**
 * 노드 타입별 아이콘 렌더러
 * remixicon 클래스 기반
 */
export function NodeIcon({ type, size = 20, className }: NodeIconProps) {
  const icon = NODE_ICON[type];

  if (!icon || !icon.icon) {
    return null;
  }

  return (
    <i
      className={`${icon.icon} ${className || ''}`}
      style={{
        fontSize: size,
        color: icon.color,
        lineHeight: 1,
      }}
    />
  );
}
