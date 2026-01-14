/**
 * MISO Workflow YAML Viewer - Node Type Definitions
 *
 * 기존 코드베이스에서 추출한 노드별 타입 정의
 * 원본: web/src/types/node.type.ts
 */

import {
  BlockEnum,
  CommonNodeType,
  Memory,
  ModelConfig,
  ValueSelector,
  Variable,
} from './types-workflow';

// ============================================
// 입력 변수 타입
// ============================================

export enum InputVarType {
  textInput = 'text-input',
  paragraph = 'paragraph',
  select = 'select',
  number = 'number',
  url = 'url',
  files = 'files',
  json = 'json',
  contexts = 'contexts',
  iterator = 'iterator',
  singleFile = 'file',
  multiFiles = 'file-list',
}

export type InputVar = {
  type: InputVarType;
  label: string | {
    nodeType: BlockEnum;
    nodeName: string;
    variable: string;
    isChatVar?: boolean;
  };
  variable: string;
  max_length?: number;
  default?: string;
  required: boolean;
  hint?: string;
  options?: string[];
  value_selector?: ValueSelector;
};

// ============================================
// Start 노드
// ============================================

export type StartNodeType = CommonNodeType & {
  variables: InputVar[];
};

// ============================================
// End 노드
// ============================================

export type EndNodeType = CommonNodeType & {
  outputs: Variable[];
};

// ============================================
// Answer 노드
// ============================================

export type AnswerNodeType = CommonNodeType & {
  variables: Variable[];
  answer: string;
};

// ============================================
// LLM 노드
// ============================================

export type LLMNodeType = CommonNodeType & {
  model: ModelConfig;
  prompt_template: Array<{
    role: 'system' | 'user' | 'assistant';
    text: string;
    edition_type?: 'basic' | 'jinja2';
    jinja2_text?: string;
  }>;
  context?: {
    enabled: boolean;
    variable_selector?: ValueSelector[];
  };
  vision?: {
    enabled: boolean;
    configs?: VisionSetting;
  };
  memory?: Memory;
  variables?: Variable[];
};

export type VisionSetting = {
  variable_selector: ValueSelector;
  detail: 'low' | 'high';
};

// ============================================
// Knowledge Retrieval 노드
// ============================================

export type KnowledgeRetrievalNodeType = CommonNodeType & {
  query_variable_selector: ValueSelector;
  dataset_ids: string[];
  retrieval_mode: 'single' | 'multi_way';
  multiple_retrieval_config?: {
    top_k: number;
    score_threshold: number | null;
    reranking_model?: {
      provider: string;
      model: string;
    };
    reranking_enable?: boolean;
  };
  single_retrieval_config?: {
    model: ModelConfig;
  };
  dataset_retrieval_configs?: Array<{
    dataset_id: string;
    dataset_name: string;
  }>;
  meta_search_filters?: Array<{
    id: string;
    tagName: string;
    relation: string;
    tagValue: string;
  }>;
};

// ============================================
// IF/ELSE 노드
// ============================================

export enum LogicalOperator {
  and = 'and',
  or = 'or',
}

export enum ComparisonOperator {
  contains = 'contains',
  notContains = 'not contains',
  startWith = 'start with',
  endWith = 'end with',
  is = 'is',
  isNot = 'is not',
  empty = 'empty',
  notEmpty = 'not empty',
  equal = '=',
  notEqual = '≠',
  largerThan = '>',
  lessThan = '<',
  largerThanOrEqual = '≥',
  lessThanOrEqual = '≤',
  isNull = 'is null',
  isNotNull = 'is not null',
  in = 'in',
  notIn = 'not in',
  allOf = 'all of',
  exists = 'exists',
  notExists = 'not exists',
}

export type Condition = {
  id: string;
  varType: string;
  variable_selector?: ValueSelector;
  key?: string;
  comparison_operator?: ComparisonOperator;
  value: string | string[];
  sub_variable_condition?: CaseItem;
};

export type CaseItem = {
  case_id: string;
  logical_operator: LogicalOperator;
  conditions: Condition[];
};

export type IfElseNodeType = CommonNodeType & {
  logical_operator?: LogicalOperator;
  conditions?: Condition[];
  cases: CaseItem[];
};

// ============================================
// Code 노드
// ============================================

export enum CodeLanguage {
  python3 = 'python3',
  javascript = 'javascript',
  json = 'json',
  jinja = 'jinja',
}

export type OutputVar = Record<string, {
  type: string;
  children: null;
}>;

export type CodeDependency = {
  name: string;
  version: string;
};

export type CodeNodeType = CommonNodeType & {
  variables: Variable[];
  code_language: CodeLanguage;
  code: string;
  outputs: OutputVar;
  dependencies?: CodeDependency[];
};

// ============================================
// Template Transform 노드
// ============================================

export type TemplateTransformNodeType = CommonNodeType & {
  variables: Variable[];
  template: string;
  template_language: CodeLanguage;
  outputs: OutputVar;
};

// ============================================
// HTTP Request 노드
// ============================================

export enum Method {
  get = 'get',
  post = 'post',
  head = 'head',
  patch = 'patch',
  put = 'put',
  delete = 'delete',
}

export enum BodyType {
  none = 'none',
  formData = 'form-data',
  xWwwFormUrlencoded = 'x-www-form-urlencoded',
  rawText = 'raw-text',
  json = 'json',
}

export enum AuthorizationType {
  none = 'no-auth',
  apiKey = 'api-key',
}

export type HttpNodeType = CommonNodeType & {
  variables: Variable[];
  method: Method;
  url: string;
  headers: string;
  params: string;
  body: {
    type: BodyType;
    data: string;
  } | null;
  authorization: {
    type: AuthorizationType;
    config?: {
      type: 'basic' | 'bearer' | 'custom';
      api_key: string;
      header?: string;
    } | null;
  };
  timeout: {
    connect?: number;
    read?: number;
    write?: number;
  };
};

// ============================================
// Question Classifier 노드
// ============================================

export type Topic = {
  id: string;
  name: string;
};

export type QuestionClassifierNodeType = CommonNodeType & {
  query_variable_selector: ValueSelector;
  model: ModelConfig;
  classes: Topic[];
  instruction?: string;
  memory?: Memory;
  vision?: {
    enabled: boolean;
    configs?: VisionSetting;
  };
};

// ============================================
// Tool 노드
// ============================================

export enum CollectionType {
  all = 'all',
  builtIn = 'builtin',
  custom = 'api',
  model = 'model',
  workflow = 'workflow',
  mcp = 'mcp',
}

export type ToolVarInputs = Record<string, {
  type: 'variable' | 'constant' | 'mixed';
  value?: string | number | ValueSelector | boolean;
}>;

export type ToolNodeType = CommonNodeType & {
  provider_id: string;
  provider_type: CollectionType;
  provider_name: string;
  tool_name: string;
  tool_label: string;
  tool_parameters: ToolVarInputs;
  tool_configurations: Record<string, any>;
};

// ============================================
// Parameter Extractor 노드
// ============================================

export enum ParamType {
  string = 'string',
  number = 'number',
  bool = 'bool',
  select = 'select',
  arrayString = 'array[string]',
  arrayNumber = 'array[number]',
  arrayObject = 'array[object]',
}

export type Param = {
  name: string;
  type: ParamType;
  options?: string[];
  description: string;
  required?: boolean;
};

export enum ReasoningModeType {
  prompt = 'prompt',
  functionCall = 'function_call',
}

export type ParameterExtractorNodeType = CommonNodeType & {
  model: ModelConfig;
  query: ValueSelector;
  reasoning_mode: ReasoningModeType;
  parameters: Param[];
  instruction: string;
  memory?: Memory;
  vision?: {
    enabled: boolean;
    configs?: VisionSetting;
  };
};

// ============================================
// Variable Aggregator 노드
// ============================================

export type VariableAggregatorGroup = {
  output_type: string;
  variables: ValueSelector[];
  group_name: string;
  groupId: string;
};

export type VariableAggregatorNodeType = CommonNodeType & {
  variables: ValueSelector[];
  output_type: string;
  advanced_settings: {
    group_enabled: boolean;
    groups: VariableAggregatorGroup[];
  };
};

// ============================================
// Variable Assigner 노드
// ============================================

export type VariableAssignerItem = {
  variable_selector: ValueSelector;
  input_type: 'variable' | 'constant' | '';
  operation: 'over-write' | 'set' | 'clear' | '';
  value: any;
  write_mode: 'over-write';
};

export type VariableAssignerNodeType = CommonNodeType & {
  version: '1' | '2';
  items: VariableAssignerItem[];
};

// ============================================
// Document Extractor 노드
// ============================================

export type DocExtractorNodeType = CommonNodeType & {
  variable_selector: ValueSelector;
  is_array_file: boolean;
};

// ============================================
// Iteration 노드
// ============================================

export enum ErrorHandleMode {
  Terminated = 'terminated',
  ContinueOnError = 'continue-on-error',
  RemoveAbnormalOutput = 'remove-abnormal-output',
}

export type IterationNodeType = CommonNodeType & {
  start_node_id: string;
  iterator_selector: ValueSelector;
  output_selector: ValueSelector;
  _children: string[];
  _isShowTips: boolean;
  is_parallel: boolean;
  parallel_nums: number;
  error_handle_mode: ErrorHandleMode;
};

// ============================================
// 출력 구조체
// ============================================

export type Var = {
  variable: string;
  type: string;
  children?: Var[];
  isParagraph?: boolean;
  isSelect?: boolean;
  options?: string[];
  required?: boolean;
  des?: string;
};

export type NodeOutPutVar = {
  nodeId: string;
  title: string;
  vars?: Var[];
  isStartNode?: boolean;
};

// ============================================
// 블록 분류
// ============================================

export enum BlockClassificationEnum {
  Default = '-',
  Logic = 'logic',
  Transform = 'transform',
  Utilities = 'utilities',
}

export type Block = {
  classification?: string;
  type: BlockEnum;
  title: string;
  description?: string;
};
