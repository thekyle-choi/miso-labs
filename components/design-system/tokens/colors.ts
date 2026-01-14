/**
 * Design System - Color Tokens
 * 노드 타입별 색상 및 시맨틱 색상 정의
 */

import { BlockEnum } from '@/types/workflow';

// 노드 타입별 색상 정의
export const nodeColors = {
  [BlockEnum.Start]: { bg: '#4b4e63', text: '#ffffff', light: '#e8e9ec' },
  [BlockEnum.End]: { bg: '#4b4e63', text: '#ffffff', light: '#e8e9ec' },
  [BlockEnum.LLM]: { bg: '#6366f1', text: '#ffffff', light: '#e0e7ff' },
  [BlockEnum.KnowledgeRetrieval]: { bg: '#f79009', text: '#ffffff', light: '#fef3c7' },
  [BlockEnum.Answer]: { bg: '#31B04D', text: '#ffffff', light: '#dcfce7' },
  [BlockEnum.QuestionClassifier]: { bg: '#31b04d', text: '#ffffff', light: '#dcfce7' },
  [BlockEnum.IfElse]: { bg: '#0ea5e9', text: '#ffffff', light: '#e0f2fe' },
  [BlockEnum.Iteration]: { bg: '#E81995', text: '#ffffff', light: '#fce7f3' },
  [BlockEnum.Loop]: { bg: '#E81995', text: '#ffffff', light: '#fce7f3' }, // Loop alias
  [BlockEnum.Code]: { bg: '#3b82f6', text: '#ffffff', light: '#dbeafe' },
  [BlockEnum.TemplateTransform]: { bg: '#3b82f6', text: '#ffffff', light: '#dbeafe' },
  [BlockEnum.VariableAggregator]: { bg: '#3b82f6', text: '#ffffff', light: '#dbeafe' },
  [BlockEnum.ParameterExtractor]: { bg: '#3b82f6', text: '#ffffff', light: '#dbeafe' },
  [BlockEnum.VariableAssigner]: { bg: '#3b82f6', text: '#ffffff', light: '#dbeafe' },
  [BlockEnum.HttpRequest]: { bg: '#222222', text: '#ffffff', light: '#e5e5e5' },
  [BlockEnum.DocExtractor]: { bg: '#3b82f6', text: '#ffffff', light: '#dbeafe' },
  [BlockEnum.Tool]: { bg: '#4b4e63', text: '#ffffff', light: '#e8e9ec' },
} as const;

// 시맨틱 색상
export const semanticColors = {
  success: { bg: '#31B04D', text: '#ffffff', light: '#dcfce7' },
  warning: { bg: '#f79009', text: '#ffffff', light: '#fef3c7' },
  error: { bg: '#ef4444', text: '#ffffff', light: '#fee2e2' },
  info: { bg: '#0ea5e9', text: '#ffffff', light: '#e0f2fe' },
} as const;

// 기능 뱃지 색상 (Tailwind 클래스)
export const badgeColors = {
  context: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  vision: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  memory: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  parallel: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
  enabled: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  disabled: { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' },
} as const;

// 노드 색상 가져오기 유틸
export function getNodeColor(type: string) {
  return nodeColors[type as keyof typeof nodeColors] || nodeColors[BlockEnum.Start];
}

// 뱃지 색상 타입
export type BadgeVariant = keyof typeof badgeColors;
