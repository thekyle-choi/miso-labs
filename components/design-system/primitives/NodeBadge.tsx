'use client';

import { cn } from '@/lib/utils';
import { badgeColors, type BadgeVariant } from '../tokens/colors';

interface NodeBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

/**
 * 노드 기능 뱃지 - 토스 스타일
 * 미니멀하고 깔끔한 디자인
 */
export function NodeBadge({ variant, children, className }: NodeBadgeProps) {
  const colors = badgeColors[variant];

  return (
    <span
      className={cn(
        // 기본 스타일
        'inline-flex items-center justify-center',
        'px-2 py-0.5 rounded-md',
        'text-[10px] font-medium leading-none',
        // 색상
        colors.bg,
        colors.text,
        // 트랜지션
        'transition-colors duration-150',
        className
      )}
    >
      {children}
    </span>
  );
}
