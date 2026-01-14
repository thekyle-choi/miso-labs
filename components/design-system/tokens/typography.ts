/**
 * Design System - Typography Tokens
 * 타이포그래피 클래스 정의
 */

// 노드 내부 타이포그래피 (miso 스타일 기반)
export const nodeTypography = {
  title: 'text-[14px] font-bold text-gray-900 leading-tight',  // miso: 15px bold
  subtitle: 'text-[12px] font-medium text-gray-600',
  body: 'text-[12px] text-gray-600 leading-relaxed',
  caption: 'text-[11px] text-gray-400 leading-normal',
  code: 'text-[11px] font-mono text-gray-700 bg-gray-50 px-1 rounded',
  badge: 'text-[10px] font-medium',
} as const;

// 패널 타이포그래피
export const panelTypography = {
  heading: 'text-lg font-semibold',
  subheading: 'text-sm font-medium text-muted-foreground',
  body: 'text-sm',
  label: 'text-xs font-medium text-muted-foreground uppercase tracking-wider',
  value: 'text-sm font-medium',
} as const;

// 페이지 타이포그래피
export const pageTypography = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-semibold',
  body: 'text-base',
  small: 'text-sm text-muted-foreground',
} as const;
