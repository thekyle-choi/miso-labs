/**
 * MISO Workflow YAML Viewer - Constants
 *
 * 노드 아이콘, 색상, 메타데이터 상수
 * 원본: web/src/constants/workflow.constants.ts
 */

import { BlockEnum } from './types-workflow';

// ============================================
// NODE_ICON - 노드 타입별 아이콘 코드와 색상
// remixicon 폰트 사용
// ============================================

export const NODE_ICON: Record<string, { code: string; color: string }> = {
  [BlockEnum.Start]: { code: 'ed3a', color: '#4b4e63' },
  [BlockEnum.LLM]: { code: 'f525', color: '#6366f1' },
  [BlockEnum.KnowledgeRetrieval]: { code: 'eea7', color: '#f79009' },
  [BlockEnum.Answer]: { code: 'ef45', color: '#31B04D' },
  [BlockEnum.QuestionClassifier]: { code: 'f180', color: '#31b04d' },
  [BlockEnum.IfElse]: { code: 'f124', color: '#0ea5e9' },
  [BlockEnum.Iteration]: { code: 'f074', color: '#E81995' },
  [BlockEnum.Code]: { code: 'eba6', color: '#3b82f6' },
  [BlockEnum.TemplateTransform]: { code: 'f42e', color: '#3b82f6' },
  [BlockEnum.VariableAggregator]: { code: 'edbd', color: '#3b82f6' },
  [BlockEnum.ParameterExtractor]: { code: 'eae9', color: '#3b82f6' },
  [BlockEnum.VariableAssigner]: { code: 'ebad', color: '#3b82f6' },
  [BlockEnum.HttpRequest]: { code: 'edce', color: '#222' },
  [BlockEnum.DocExtractor]: { code: 'ebad', color: '#3b82f6' },
  [BlockEnum.Tool]: { code: '', color: '#4b4e63' },
  [BlockEnum.End]: { code: '', color: '#4b4e63' },
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
  [BlockEnum.VariableAggregator]: '변수 집계기',
  [BlockEnum.ParameterExtractor]: '변수 추출',
  [BlockEnum.DocExtractor]: '문서 추출기',
  [BlockEnum.VariableAssigner]: '변수 할당',
};

// ============================================
// 노드 기본값
// ============================================

export const NODES_INITIAL_DATA: Record<string, any> = {
  [BlockEnum.Start]: {
    type: BlockEnum.Start,
    title: '시작',
    desc: '',
    variables: [],
  },
  [BlockEnum.End]: {
    type: BlockEnum.End,
    title: '종료',
    desc: '',
    outputs: [],
  },
  [BlockEnum.Answer]: {
    type: BlockEnum.Answer,
    title: '답변',
    desc: '',
    answer: '',
    variables: [],
  },
  [BlockEnum.LLM]: {
    type: BlockEnum.LLM,
    title: 'LLM',
    desc: '',
    model: {
      provider: '',
      name: '',
      mode: 'chat',
      completion_params: {},
    },
    prompt_template: [],
    memory: null,
    context: { enabled: false },
    vision: { enabled: false },
    variables: [],
  },
  [BlockEnum.KnowledgeRetrieval]: {
    type: BlockEnum.KnowledgeRetrieval,
    title: '지식',
    desc: '',
    query_variable_selector: [],
    dataset_ids: [],
    retrieval_mode: 'single',
  },
  [BlockEnum.IfElse]: {
    type: BlockEnum.IfElse,
    title: '조건',
    desc: '',
    cases: [],
    logical_operator: 'and',
  },
  [BlockEnum.Code]: {
    type: BlockEnum.Code,
    title: '코드',
    desc: '',
    code_language: 'python3',
    code: '',
    variables: [],
    outputs: {},
  },
  [BlockEnum.TemplateTransform]: {
    type: BlockEnum.TemplateTransform,
    title: '템플릿',
    desc: '',
    template: '',
    template_language: 'jinja',
    variables: [],
    outputs: {},
  },
  [BlockEnum.QuestionClassifier]: {
    type: BlockEnum.QuestionClassifier,
    title: '의도 분류',
    desc: '',
    query_variable_selector: [],
    model: null,
    classes: [],
    instruction: '',
  },
  [BlockEnum.HttpRequest]: {
    type: BlockEnum.HttpRequest,
    title: 'API 요청',
    desc: '',
    method: 'get',
    url: '',
    headers: '',
    params: '',
    body: null,
    authorization: { type: 'no-auth' },
    timeout: {},
    variables: [],
  },
  [BlockEnum.Tool]: {
    type: BlockEnum.Tool,
    title: '도구',
    desc: '',
    provider_id: '',
    provider_type: 'builtin',
    provider_name: '',
    tool_name: '',
    tool_label: '',
    tool_parameters: {},
    tool_configurations: {},
  },
  [BlockEnum.Iteration]: {
    type: BlockEnum.Iteration,
    title: '반복',
    desc: '',
    iterator_selector: [],
    output_selector: [],
    is_parallel: false,
    parallel_nums: 10,
    error_handle_mode: 'terminated',
    _children: [],
  },
  [BlockEnum.VariableAggregator]: {
    type: BlockEnum.VariableAggregator,
    title: '변수 집계기',
    desc: '',
    variables: [],
    output_type: 'string',
    advanced_settings: {
      group_enabled: false,
      groups: [],
    },
  },
  [BlockEnum.ParameterExtractor]: {
    type: BlockEnum.ParameterExtractor,
    title: '변수 추출',
    desc: '',
    model: null,
    query: [],
    reasoning_mode: 'function_call',
    parameters: [],
    instruction: '',
  },
  [BlockEnum.DocExtractor]: {
    type: BlockEnum.DocExtractor,
    title: '문서 추출기',
    desc: '',
    variable_selector: [],
    is_array_file: false,
  },
  [BlockEnum.VariableAssigner]: {
    type: BlockEnum.VariableAssigner,
    title: '변수 할당',
    desc: '',
    version: '2',
    items: [],
  },
};

// ============================================
// 출력 변수 구조체
// ============================================

export const LLM_OUTPUT_STRUCT = [
  { variable: 'text', type: 'string' },
];

export const KNOWLEDGE_RETRIEVAL_OUTPUT_STRUCT = [
  { variable: 'result', type: 'array[object]' },
];

export const TEMPLATE_TRANSFORM_OUTPUT_STRUCT = [
  { variable: 'output', type: 'string' },
];

export const QUESTION_CLASSIFIER_OUTPUT_STRUCT = [
  { variable: 'class_name', type: 'string' },
];

export const HTTP_REQUEST_OUTPUT_STRUCT = [
  { variable: 'body', type: 'string' },
  { variable: 'status_code', type: 'number' },
  { variable: 'headers', type: 'string' },
  { variable: 'files', type: 'array[file]' },
];

export const TOOL_OUTPUT_STRUCT = [
  { variable: 'text', type: 'string' },
  { variable: 'files', type: 'array[file]' },
  { variable: 'json', type: 'array[object]' },
];

export const PARAMETER_EXTRACTOR_COMMON_STRUCT = [
  { variable: '__is_success', type: 'number' },
  { variable: '__reason', type: 'string' },
];

// ============================================
// 블록 분류
// ============================================

export const BLOCK_CLASSIFICATIONS = [
  { id: '-', name: '기본' },
  { id: 'logic', name: '논리' },
  { id: 'transform', name: '변환' },
  { id: 'utilities', name: '유틸' },
];

export const BLOCKS = [
  { classification: '-', type: BlockEnum.Start, title: '시작' },
  { classification: '-', type: BlockEnum.LLM, title: 'LLM' },
  { classification: '-', type: BlockEnum.KnowledgeRetrieval, title: '지식' },
  { classification: '-', type: BlockEnum.End, title: '종료' },
  { classification: '-', type: BlockEnum.Answer, title: '답변' },
  { classification: '-', type: BlockEnum.QuestionClassifier, title: '의도 분류' },
  { classification: 'logic', type: BlockEnum.IfElse, title: '조건' },
  { classification: 'logic', type: BlockEnum.Iteration, title: '반복' },
  { classification: 'transform', type: BlockEnum.Code, title: '코드' },
  { classification: 'transform', type: BlockEnum.VariableAggregator, title: '변수 집계기' },
  { classification: 'transform', type: BlockEnum.DocExtractor, title: '문서 추출기' },
  { classification: 'transform', type: BlockEnum.TemplateTransform, title: '템플릿' },
  { classification: 'transform', type: BlockEnum.VariableAssigner, title: '변수 할당' },
  { classification: 'transform', type: BlockEnum.ParameterExtractor, title: '변수 추출' },
  { classification: 'utilities', type: BlockEnum.HttpRequest, title: 'API 요청' },
  { classification: 'utilities', type: BlockEnum.Tool, title: '도구' },
];

// ============================================
// 조건 연산자 한글 매핑
// ============================================

export const COMPARISON_OPERATOR_KR: Record<string, string> = {
  'contains': '포함',
  'not contains': '포함하지 않음',
  'start with': '시작',
  'end with': '끝',
  'is': '이다',
  'is not': '아니다',
  'empty': '비어 있음',
  'not empty': '비어 있지 않음',
  '=': '같음',
  '≠': '같지 않음',
  '>': '보다 큼',
  '<': '보다 작음',
  '≥': '이상',
  '≤': '이하',
  'is null': 'null임',
  'is not null': 'null이 아님',
  'in': '포함됨',
  'not in': '포함되지 않음',
  'all of': '모두의',
  'exists': '존재',
  'not exists': '존재하지 않음',
};

export const LOGICAL_OPERATOR_KR: Record<string, string> = {
  'and': '그리고',
  'or': '또는',
};

// ============================================
// 노드 크기/레이아웃 상수
// ============================================

export const NODE_WIDTH = 300;
export const NODE_HEIGHT = 100;
export const X_OFFSET = 150;
export const Y_OFFSET = 39;
export const MAX_TREE_DEPTH = 50;

export const START_INITIAL_POSITION = { x: 80, y: 282 };

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

export const CUSTOM_NOTE_NODE = 'custom-note';
export const CUSTOM_NODE = 'custom';
export const CUSTOM_EDGE = 'custom';
export const CUSTOM_ITERATION_START_NODE = 'custom-iteration-start';
