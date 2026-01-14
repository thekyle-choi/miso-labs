/**
 * MISO Workflow YAML Viewer - Constants
 */

import { BlockEnum } from '@/types/workflow';

// ============================================
// NODE_ICON - 노드 타입별 아이콘 (miso 원본과 동일)
// remixicon 클래스 기반
// ============================================

export const NODE_ICON: Record<string, { icon: string; color: string }> = {
  [BlockEnum.Start]: { icon: 'ri-flag-fill', color: '#4b4e63' },              // ed3a
  [BlockEnum.End]: { icon: 'ri-stop-circle-fill', color: '#4b4e63' },
  [BlockEnum.LLM]: { icon: 'ri-brain-2-fill', color: '#6366f1' },             // f525
  [BlockEnum.KnowledgeRetrieval]: { icon: 'ri-lightbulb-flash-fill', color: '#f79009' }, // eea7
  [BlockEnum.Answer]: { icon: 'ri-message-3-fill', color: '#31B04D' },        // ef45
  [BlockEnum.QuestionClassifier]: { icon: 'ri-stack-fill', color: '#31b04d' }, // f180
  [BlockEnum.IfElse]: { icon: 'ri-shuffle-line', color: '#0ea5e9' },          // f124
  [BlockEnum.Iteration]: { icon: 'ri-repeat-line', color: '#E81995' },        // f074
  [BlockEnum.Loop]: { icon: 'ri-repeat-line', color: '#E81995' },             // Loop alias
  [BlockEnum.Code]: { icon: 'ri-code-box-fill', color: '#3b82f6' },           // eba6
  [BlockEnum.TemplateTransform]: { icon: 'ri-color-filter-fill', color: '#3b82f6' }, // f42e
  [BlockEnum.VariableAggregator]: { icon: 'ri-git-branch-line', color: '#3b82f6' },  // edbd
  [BlockEnum.ParameterExtractor]: { icon: 'ri-braces-line', color: '#3b82f6' },      // eae9
  [BlockEnum.VariableAssigner]: { icon: 'ri-code-s-slash-line', color: '#3b82f6' },  // ebad
  [BlockEnum.HttpRequest]: { icon: 'ri-global-fill', color: '#222' },         // edce
  [BlockEnum.DocExtractor]: { icon: 'ri-code-s-slash-line', color: '#3b82f6' }, // ebad (miso와 동일)
  [BlockEnum.Tool]: { icon: 'ri-tools-line', color: '#4b4e63' },
};

// ============================================
// 노드 타입별 한글 제목
// ============================================

export const NODE_TITLES: Record<string, string> = {
  [BlockEnum.Start]: '시작',
  [BlockEnum.End]: '종료',
  [BlockEnum.Answer]: '답변',
  [BlockEnum.LLM]: 'LLM',
  [BlockEnum.KnowledgeRetrieval]: '지식',
  [BlockEnum.QuestionClassifier]: '의도 분류',
  [BlockEnum.IfElse]: '조건',
  [BlockEnum.Code]: '코드',
  [BlockEnum.TemplateTransform]: '템플릿',
  [BlockEnum.HttpRequest]: 'API 요청',
  [BlockEnum.Tool]: '도구',
  [BlockEnum.Iteration]: '반복',
  [BlockEnum.IterationStart]: '반복 시작',
  [BlockEnum.Loop]: '루프',
  [BlockEnum.LoopStart]: '루프 시작',
  [BlockEnum.VariableAggregator]: '변수 집계기',
  [BlockEnum.ParameterExtractor]: '변수 추출',
  [BlockEnum.DocExtractor]: '문서 추출기',
  [BlockEnum.VariableAssigner]: '변수 할당',
};

// ============================================
// 조건 연산자 한글 매핑
// ============================================

export const COMPARISON_OPERATOR_KR: Record<string, string> = {
  contains: '포함',
  'not contains': '포함하지 않음',
  'start with': '시작',
  'end with': '끝',
  is: '이다',
  'is not': '아니다',
  empty: '비어 있음',
  'not empty': '비어 있지 않음',
  '=': '같음',
  '≠': '같지 않음',
  '>': '보다 큼',
  '<': '보다 작음',
  '≥': '이상',
  '≤': '이하',
  'is null': 'null임',
  'is not null': 'null이 아님',
  in: '포함됨',
  'not in': '포함되지 않음',
  'all of': '모두의',
  exists: '존재',
  'not exists': '존재하지 않음',
};

export const LOGICAL_OPERATOR_KR: Record<string, string> = {
  and: '그리고',
  or: '또는',
};

// ============================================
// 노드 크기/레이아웃 상수
// ============================================

export const NODE_WIDTH = 300;
export const NODE_HEIGHT = 100;
export const X_OFFSET = 150;
export const Y_OFFSET = 39;

export const ITERATION_NODE_Z_INDEX = 1;
export const ITERATION_CHILDREN_Z_INDEX = 1002;
export const ITERATION_PADDING = {
  top: 85,
  right: 16,
  bottom: 20,
  left: 16,
};

// ============================================
// 커스텀 노드 타입 문자열
// ============================================

export const CUSTOM_NODE = 'custom';
export const CUSTOM_LOOP_START_NODE = 'custom-loop-start';
export const CUSTOM_ITERATION_START_NODE = 'custom-iteration-start';
export const CUSTOM_EDGE = 'custom';
