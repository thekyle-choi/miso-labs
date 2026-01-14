/**
 * Design System - Spacing Tokens
 * 레이아웃 및 간격 관련 상수
 */

// 노드 레이아웃 (miso 스타일 기반)
export const nodeLayout = {
  width: 300,           // miso와 동일
  minHeight: 64,
  padding: 16,          // miso p-4
  paddingX: 16,
  paddingY: 14,
  gap: 8,
  borderRadius: 10,     // miso rounded-lg
  borderWidth: 1,
  iconSize: 20,
  iconRadius: 6,
} as const;

// Iteration 노드 레이아웃
export const iterationLayout = {
  minWidth: 400,
  minHeight: 300,
  padding: {
    top: 85,
    right: 16,
    bottom: 20,
    left: 16,
  },
} as const;

// 패널 레이아웃
export const panelLayout = {
  width: 384,
  padding: 16,
  gap: 16,
} as const;

// 캔버스 레이아웃
export const canvasLayout = {
  gridSize: 20,
  minZoom: 0.1,
  maxZoom: 2,
  fitViewPadding: 0.2,
} as const;

// z-index
export const zIndex = {
  iteration: 1,
  iterationChildren: 1002,
  panel: 100,
  modal: 200,
} as const;
