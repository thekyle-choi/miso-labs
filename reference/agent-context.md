# MISO Workflow Node Agent Context Guide

노드 설명 에이전트에 제공할 Context 구조 및 프롬프트 가이드

---

## 1. Context 구조

### 1.1 NodeAgentContext (단일 노드)

```typescript
interface NodeAgentContext {
  // 기본 정보
  nodeId: string;                    // 노드 고유 ID
  nodeType: string;                  // 'llm', 'code', 'if-else' 등
  nodeTitle: string;                 // 사용자 지정 제목
  nodeDescription: string;           // 노드 설명

  // 노드별 상세 데이터
  nodeData: NodeSpecificData;

  // 그래프 컨텍스트
  incomingNodes: Array<{             // 이 노드로 들어오는 노드들
    id: string;
    title: string;
    type: string;
  }>;
  outgoingNodes: Array<{             // 이 노드에서 나가는 노드들
    id: string;
    title: string;
    type: string;
  }>;

  // 반복 컨텍스트 (Iteration 내부 노드인 경우)
  parentIteration?: {
    id: string;
    title: string;
  };
}
```

### 1.2 NodeSpecificData (노드 타입별)

```typescript
interface NodeSpecificData {
  // LLM 노드
  model?: {
    provider: string;
    name: string;
    mode: string;
  };
  prompt_template?: Array<{
    role: string;
    text: string;
  }>;
  memory?: {
    window: { enabled: boolean; size: number };
  };
  context?: { enabled: boolean };
  vision?: { enabled: boolean };

  // Code 노드
  code_language?: 'python3' | 'javascript';
  code?: string;
  outputs?: Record<string, { type: string }>;
  dependencies?: Array<{ name: string; version: string }>;

  // HTTP 노드
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  url?: string;
  headers?: string;
  body?: { type: string; data: string };
  authorization?: { type: string };

  // IF/ELSE 노드
  cases?: Array<{
    case_id: string;
    logical_operator: 'and' | 'or';
    conditions: Array<{
      variable_selector: string[];
      comparison_operator: string;
      value: string;
    }>;
  }>;

  // Knowledge Retrieval 노드
  dataset_ids?: string[];
  retrieval_mode?: 'single' | 'multi_way';
  top_k?: number;
  score_threshold?: number;

  // Iteration 노드
  iterator_selector?: string[];
  output_selector?: string[];
  is_parallel?: boolean;
  parallel_nums?: number;
  error_handle_mode?: string;

  // Tool 노드
  provider_id?: string;
  provider_type?: string;
  tool_name?: string;
  tool_label?: string;
  tool_parameters?: Record<string, any>;

  // Question Classifier 노드
  classes?: Array<{ id: string; name: string }>;
  instruction?: string;

  // Parameter Extractor 노드
  parameters?: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
  }>;
  reasoning_mode?: string;

  // Variable Assigner 노드
  items?: Array<{
    variable_selector: string[];
    operation: string;
    value: any;
  }>;

  // 공통
  variables?: Array<{
    variable: string;
    value_selector: string[];
  }>;
}
```

### 1.3 WorkflowAgentContext (전체 워크플로우)

```typescript
interface WorkflowAgentContext {
  // 앱 정보
  appName: string;
  appMode: 'workflow' | 'advanced-chat';
  appDescription: string;

  // 통계
  totalNodes: number;
  nodeTypeCounts: Record<string, number>;

  // 시작/종료 지점
  entryPoint: { id: string; title: string };
  exitPoints: Array<{ id: string; title: string }>;

  // 변수
  environmentVariables: string[];
  conversationVariables: string[];

  // 그래프 특성 요약
  graphSummary: {
    hasIteration: boolean;
    hasConditionalBranching: boolean;
    usesKnowledgeRetrieval: boolean;
    usesExternalTools: boolean;
    usesHttpRequests: boolean;
    usesCodeExecution: boolean;
    hasMemory: boolean;
  };
}
```

---

## 2. Context 빌드 함수

### 2.1 단일 노드 Context 빌드

```typescript
function buildNodeAgentContext(
  nodeId: string,
  nodes: GraphNode[],
  edges: GraphEdge[]
): NodeAgentContext {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) throw new Error(`Node not found: ${nodeId}`);

  // 연결된 노드 찾기
  const incomingEdges = edges.filter(e => e.target === nodeId);
  const outgoingEdges = edges.filter(e => e.source === nodeId);

  const incomingNodes = incomingEdges.map(e => {
    const sourceNode = nodes.find(n => n.id === e.source);
    return {
      id: e.source,
      title: sourceNode?.data.title || '',
      type: sourceNode?.data.type || '',
    };
  });

  const outgoingNodes = outgoingEdges.map(e => {
    const targetNode = nodes.find(n => n.id === e.target);
    return {
      id: e.target,
      title: targetNode?.data.title || '',
      type: targetNode?.data.type || '',
    };
  });

  // 부모 Iteration 찾기
  let parentIteration;
  if (node.parentId) {
    const parent = nodes.find(n => n.id === node.parentId);
    if (parent) {
      parentIteration = {
        id: parent.id,
        title: parent.data.title,
      };
    }
  }

  return {
    nodeId: node.id,
    nodeType: node.data.type,
    nodeTitle: node.data.title,
    nodeDescription: node.data.desc || '',
    nodeData: extractNodeSpecificData(node.data),
    incomingNodes,
    outgoingNodes,
    parentIteration,
  };
}

function extractNodeSpecificData(data: any): NodeSpecificData {
  const result: NodeSpecificData = {};

  // 공통 변수
  if (data.variables) {
    result.variables = data.variables;
  }

  // 노드 타입별 데이터 추출
  switch (data.type) {
    case 'llm':
      result.model = data.model;
      result.prompt_template = data.prompt_template;
      result.memory = data.memory;
      result.context = data.context;
      result.vision = data.vision;
      break;
    case 'code':
      result.code_language = data.code_language;
      result.code = data.code;
      result.outputs = data.outputs;
      result.dependencies = data.dependencies;
      break;
    case 'http-request':
      result.method = data.method;
      result.url = data.url;
      result.headers = data.headers;
      result.body = data.body;
      result.authorization = data.authorization;
      break;
    case 'if-else':
      result.cases = data.cases;
      break;
    case 'knowledge-retrieval':
      result.dataset_ids = data.dataset_ids;
      result.retrieval_mode = data.retrieval_mode;
      if (data.multiple_retrieval_config) {
        result.top_k = data.multiple_retrieval_config.top_k;
        result.score_threshold = data.multiple_retrieval_config.score_threshold;
      }
      break;
    case 'iteration':
      result.iterator_selector = data.iterator_selector;
      result.output_selector = data.output_selector;
      result.is_parallel = data.is_parallel;
      result.parallel_nums = data.parallel_nums;
      result.error_handle_mode = data.error_handle_mode;
      break;
    case 'tool':
      result.provider_id = data.provider_id;
      result.provider_type = data.provider_type;
      result.tool_name = data.tool_name;
      result.tool_label = data.tool_label;
      result.tool_parameters = data.tool_parameters;
      break;
    case 'question-classifier':
      result.classes = data.classes;
      result.instruction = data.instruction;
      break;
    case 'parameter-extractor':
      result.parameters = data.parameters;
      result.reasoning_mode = data.reasoning_mode;
      break;
    case 'assigner':
      result.items = data.items;
      break;
  }

  return result;
}
```

### 2.2 전체 워크플로우 Context 빌드

```typescript
function buildWorkflowAgentContext(
  yaml: WorkflowYamlDSL
): WorkflowAgentContext {
  const { app, workflow } = yaml;
  const { nodes, edges } = workflow.graph;

  // 노드 타입별 카운트
  const nodeTypeCounts: Record<string, number> = {};
  nodes.forEach(node => {
    const type = node.data.type;
    nodeTypeCounts[type] = (nodeTypeCounts[type] || 0) + 1;
  });

  // 시작 노드 찾기
  const startNode = nodes.find(n => n.data.type === 'start');
  const entryPoint = startNode
    ? { id: startNode.id, title: startNode.data.title }
    : { id: '', title: '' };

  // 종료 노드 찾기
  const exitNodes = nodes.filter(n =>
    n.data.type === 'end' || n.data.type === 'answer'
  );
  const exitPoints = exitNodes.map(n => ({
    id: n.id,
    title: n.data.title,
  }));

  // 그래프 특성 분석
  const graphSummary = {
    hasIteration: nodes.some(n => n.data.type === 'iteration'),
    hasConditionalBranching: nodes.some(n => n.data.type === 'if-else'),
    usesKnowledgeRetrieval: nodes.some(n => n.data.type === 'knowledge-retrieval'),
    usesExternalTools: nodes.some(n => n.data.type === 'tool'),
    usesHttpRequests: nodes.some(n => n.data.type === 'http-request'),
    usesCodeExecution: nodes.some(n => n.data.type === 'code'),
    hasMemory: nodes.some(n =>
      n.data.type === 'llm' && n.data.memory?.window?.enabled
    ),
  };

  return {
    appName: app.name,
    appMode: app.mode,
    appDescription: app.description,
    totalNodes: nodes.length,
    nodeTypeCounts,
    entryPoint,
    exitPoints,
    environmentVariables: workflow.environment_variables.map(v => v.name),
    conversationVariables: workflow.conversation_variables.map(v => v.name),
    graphSummary,
  };
}
```

---

## 3. 에이전트 프롬프트 예시

### 3.1 노드 설명 프롬프트

```markdown
# System Prompt

당신은 MISO 워크플로우/챗플로우의 노드를 분석하고 설명하는 AI 어시스턴트입니다.

## 역할
- 사용자가 선택한 노드의 기능과 설정을 쉽게 이해할 수 있도록 설명합니다.
- 노드가 워크플로우 전체에서 어떤 역할을 하는지 컨텍스트를 제공합니다.
- 설정의 의미와 영향을 명확하게 설명합니다.

## 노드 타입별 설명 포인트

### LLM 노드
- 사용 중인 모델 (provider/name)
- 프롬프트 템플릿 구조
- Context/Memory 설정 여부
- Vision 기능 활성화 여부

### Code 노드
- 프로그래밍 언어
- 코드의 목적과 로직
- 입/출력 변수

### IF/ELSE 노드
- 조건 로직 설명
- 각 분기의 의미

### Knowledge Retrieval 노드
- 검색 모드 (단일/다중)
- 연결된 데이터셋
- Reranking 설정

### HTTP Request 노드
- API 엔드포인트
- 요청 메서드
- 인증 방식

### Tool 노드
- 도구 제공자
- 도구 기능
- 파라미터 설정

### Iteration 노드
- 반복 대상 데이터
- 병렬 실행 여부
- 에러 처리 방식

## 응답 형식
1. **노드 요약**: 한 문장으로 노드의 역할 설명
2. **상세 설정**: 주요 설정값 설명
3. **데이터 흐름**: 입력/출력 데이터 흐름 설명
4. **연결 컨텍스트**: 이전/다음 노드와의 관계
```

### 3.2 User Message 템플릿

```markdown
# 선택된 노드 정보

## 기본 정보
- **노드 ID**: {{nodeId}}
- **노드 타입**: {{nodeType}}
- **제목**: {{nodeTitle}}
- **설명**: {{nodeDescription}}

## 노드 설정
{{#each nodeData}}
- **{{@key}}**: {{this}}
{{/each}}

## 연결된 노드
### 이전 노드 (입력)
{{#each incomingNodes}}
- {{title}} ({{type}})
{{/each}}

### 다음 노드 (출력)
{{#each outgoingNodes}}
- {{title}} ({{type}})
{{/each}}

{{#if parentIteration}}
## 반복 컨텍스트
이 노드는 "{{parentIteration.title}}" 반복 노드 내부에 있습니다.
{{/if}}

---

이 노드에 대해 설명해주세요.
```

---

## 4. 활용 예시

### 4.1 노드 선택 시 Context 생성

```typescript
function onNodeSelect(nodeId: string, workflow: WorkflowYamlDSL) {
  const context = buildNodeAgentContext(
    nodeId,
    workflow.workflow.graph.nodes,
    workflow.workflow.graph.edges
  );

  // 에이전트에 전달
  sendToAgent({
    type: 'node_explanation',
    context,
  });
}
```

### 4.2 전체 워크플로우 분석 요청

```typescript
function onAnalyzeWorkflow(workflow: WorkflowYamlDSL) {
  const context = buildWorkflowAgentContext(workflow);

  // 에이전트에 전달
  sendToAgent({
    type: 'workflow_analysis',
    context,
  });
}
```

---

## 5. 참고 사항

### 노드 타입 한글명 매핑
```typescript
const NODE_TYPE_NAMES_KR: Record<string, string> = {
  'start': '시작',
  'end': '종료',
  'answer': '답변',
  'llm': 'LLM',
  'knowledge-retrieval': '지식 검색',
  'question-classifier': '의도 분류',
  'if-else': '조건 분기',
  'code': '코드 실행',
  'template-transform': '템플릿 변환',
  'http-request': 'HTTP 요청',
  'tool': '외부 도구',
  'iteration': '반복',
  'variable-aggregator': '변수 집계',
  'parameter-extractor': '파라미터 추출',
  'document-extractor': '문서 추출',
  'assigner': '변수 할당',
};
```

### 비교 연산자 한글명
```typescript
const COMPARISON_OPS_KR: Record<string, string> = {
  'contains': '포함',
  'not contains': '포함하지 않음',
  'start with': '~로 시작',
  'end with': '~로 끝남',
  'is': '같음',
  'is not': '같지 않음',
  'empty': '비어있음',
  'not empty': '비어있지 않음',
  '=': '같음',
  '>': '초과',
  '<': '미만',
  '>=': '이상',
  '<=': '이하',
};
```
