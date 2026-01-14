/**
 * MISO Workflow YAML Viewer - Workflow Type Definitions
 *
 * 기존 코드베이스에서 추출한 워크플로우 관련 타입 정의
 * 원본: web/src/types/workflow.type.ts
 */

// ============================================
// 노드 타입 Enum
// ============================================

export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Answer = 'answer',
  LLM = 'llm',
  KnowledgeRetrieval = 'knowledge-retrieval',
  QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAggregator = 'variable-aggregator',
  Tool = 'tool',
  ParameterExtractor = 'parameter-extractor',
  Iteration = 'iteration',
  IterationStart = 'iteration-start',
  DocExtractor = 'document-extractor',
  VariableAssigner = 'assigner',
}

// ============================================
// 공통 타입
// ============================================

export type ValueSelector = string[]; // [nodeId, key | obj key path]

export type Branch = {
  id: string;
  name: string;
};

export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  None = 'none',
  Exception = 'exception',
}

export enum VarType {
  variable = 'variable',
  constant = 'constant',
  mixed = 'mixed',
}

export enum ChatVarType {
  string = 'string',
  number = 'number',
  secret = 'secret',
  boolean = 'boolean',
  object = 'object',
  file = 'file',
  array = 'array',
  arrayString = 'array[string]',
  arrayNumber = 'array[number]',
  arrayObject = 'array[object]',
  arrayFile = 'array[file]',
  any = 'any',
}

// ============================================
// 노드 공통 타입
// ============================================

export type CommonNodeType<T = object> = {
  // 연결 정보
  _connectedSourceHandleIds?: string[];
  _connectedTargetHandleIds?: string[];
  _targetBranches?: Branch[];

  // 실행 상태 (뷰어에서는 읽기 전용)
  _runningStatus?: NodeRunningStatus;
  _singleRunningStatus?: NodeRunningStatus;
  _isSingleRun?: boolean;
  _runningBranchId?: string;

  // UI 상태
  selected?: boolean;
  _isCandidate?: boolean;
  _isBundled?: boolean;
  _isEntering?: boolean;
  _waitingRun?: boolean;

  // Iteration 관련
  isInIteration?: boolean;
  iteration_id?: string;
  _children?: string[];
  _iterationLength?: number;
  _iterationIndex?: number;
  isIterationStart?: boolean;

  // 기본 정보
  title: string;
  desc: string;
  type: BlockEnum;
  width?: number;
  height?: number;

  // 에러 처리
  error_strategy?: ErrorHandleTypeEnum;
  retry_config?: WorkflowRetryConfig;
  default_value?: DefaultValueForm[];
} & T;

export enum ErrorHandleTypeEnum {
  none = 'none',
  failBranch = 'fail-branch',
  defaultValue = 'default-value',
}

export type WorkflowRetryConfig = {
  retry_enabled: boolean;
  max_retries: number;
  retry_interval: number;
};

export type DefaultValueForm = {
  key: string;
  type: ChatVarType;
  value?: any;
};

// ============================================
// 변수 타입
// ============================================

export type Variable = {
  variable: string;
  label?: string | {
    nodeType: BlockEnum;
    nodeName: string;
    variable: string;
  };
  value_selector: ValueSelector;
  variable_type?: VarType;
  value?: string;
  options?: string[];
  required?: boolean;
  isParagraph?: boolean;
};

// ============================================
// 모델 설정
// ============================================

export type ModelConfig = {
  provider: string;
  name: string;
  mode: string;
  completion_params: Record<string, any>;
  registered_provider_id?: string;
};

export enum PromptRole {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export type PromptItem = {
  id?: string;
  role?: PromptRole;
  text: string;
  edition_type?: 'basic' | 'jinja2';
  jinja2_text?: string;
};

export type Memory = {
  role_prefix?: {
    user: string;
    assistant: string;
  };
  window: {
    enabled: boolean;
    size: number | string | null;
  };
  query_prompt_template: string;
};

// ============================================
// 엣지 타입
// ============================================

export type CommonEdgeType = {
  _hovering?: boolean;
  _connectedNodeIsHovering?: boolean;
  _connectedNodeIsSelected?: boolean;
  _isBundled?: boolean;
  _sourceRunningStatus?: NodeRunningStatus;
  _targetRunningStatus?: NodeRunningStatus;
  _waitingRun?: boolean;
  isInIteration?: boolean;
  iteration_id?: string;
  sourceType: BlockEnum;
  targetType: BlockEnum;
};

// ============================================
// 그래프 타입
// ============================================

export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};

export type GraphNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: CommonNodeType;
  parentId?: string;
  extent?: 'parent';
  width?: number;
  height?: number;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: CommonEdgeType;
};

export type GraphType = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  viewport?: Viewport;
};

// ============================================
// 환경/대화 변수
// ============================================

export type EnvironmentVariable = {
  id: string;
  name: string;
  value: any;
  value_type: 'string' | 'number' | 'secret';
};

export type ConversationVariable = {
  id: string;
  name: string;
  value_type: ChatVarType;
  value: any;
  description: string;
};

// ============================================
// Features 타입
// ============================================

export type FeaturesType = {
  file_upload?: {
    enabled?: boolean;
    allowed_file_types?: string[];
    allowed_file_extensions?: string[];
    allowed_file_upload_methods?: string[];
    number_limits?: number;
  };
  opening_statement?: string;
  suggested_questions?: string[];
  text_to_speech?: {
    enabled?: boolean;
    language?: string;
    voice?: string;
  };
  speech_to_text?: {
    enabled?: boolean;
  };
  retriever_resource?: {
    enabled?: boolean;
  };
  suggested_questions_after_answer?: {
    enabled?: boolean;
  };
  citation?: {
    enabled?: boolean;
  };
};

// ============================================
// YAML DSL 전체 구조
// ============================================

export type WorkflowYamlDSL = {
  version: string;
  kind: 'app';
  app: {
    name: string;
    mode: 'workflow' | 'advanced-chat';
    icon: string;
    icon_background: string;
    description: string;
    use_icon_as_answer_icon?: boolean;
  };
  workflow: {
    graph: GraphType;
    features: FeaturesType;
    environment_variables: EnvironmentVariable[];
    conversation_variables: ConversationVariable[];
  };
};
