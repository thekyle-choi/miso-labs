'use client';

import { cn } from '@/lib/utils';
import { panelTypography } from '../tokens/typography';

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  variant?: 'default' | 'highlight';
  mono?: boolean;
  className?: string;
}

/**
 * 키-값 정보 표시 패턴
 * 노드 설정 정보 표시에 사용
 */
export function InfoRow({
  label,
  value,
  variant = 'default',
  mono = false,
  className,
}: InfoRowProps) {
  return (
    <div className={cn('flex items-center justify-between py-1.5', className)}>
      <span className={cn(panelTypography.label, 'lowercase normal-case')}>
        {label}
      </span>
      <span
        className={cn(
          panelTypography.body,
          variant === 'highlight' && 'font-medium text-foreground',
          mono && 'font-mono text-xs'
        )}
      >
        {value}
      </span>
    </div>
  );
}
