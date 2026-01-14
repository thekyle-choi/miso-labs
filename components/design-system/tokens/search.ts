/**
 * Design System - Search Tokens
 * Google 스타일 검색바 디자인 토큰
 */

// 검색바 레이아웃 토큰
export const searchLayout = {
  // 메인 페이지 (중앙, 큰 사이즈)
  main: {
    maxWidth: 584,
    height: 46,
    borderRadius: 24,
    paddingX: 20,
    paddingY: 12,
    iconSize: 20,
    fontSize: 16,
  },
  // 검색 결과 페이지 헤더 (컴팩트)
  compact: {
    maxWidth: 480,
    height: 40,
    borderRadius: 20,
    paddingX: 16,
    paddingY: 10,
    iconSize: 18,
    fontSize: 14,
  },
} as const;

// 검색바 색상 (Tailwind 클래스)
export const searchColors = {
  border: {
    default: 'border-gray-200',
    focus: 'border-transparent',
    dragOver: 'border-primary',
  },
  shadow: {
    default: 'shadow-sm',
    hover: 'shadow-md',
    focus: 'shadow-lg',
  },
  background: {
    default: 'bg-white',
    dragOver: 'bg-primary/5',
  },
  text: {
    input: 'text-foreground',
    placeholder: 'text-muted-foreground',
    icon: 'text-gray-400',
    iconHover: 'text-gray-600',
  },
} as const;

// 검색바 전환 효과
export const searchTransitions = {
  shadow: 'transition-shadow duration-200 ease-in-out',
  all: 'transition-all duration-200 ease-in-out',
} as const;

// 검색 결과 카드 레이아웃
export const resultCardLayout = {
  padding: 16,
  gap: 12,
  iconSize: 40,
  iconRadius: 10,
} as const;
