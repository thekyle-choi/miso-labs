# MISO Workflow YAML DSL Structure Guide

MISO 워크플로우/챗플로우 앱의 YAML 파일 구조에 대한 상세 가이드

## DSL 버전
- **현재 버전**: `0.1.5`
- **호환 버전**: `0.1.x`

## 전체 구조

```yaml
version: "0.1.5"           # DSL 버전
kind: "app"                # 고정값
app:                       # 앱 메타데이터
  name: "앱 이름"
  mode: "workflow"         # "workflow" | "advanced-chat"
  icon: "🤖"               # 이모지 또는 이미지 URL
  icon_background: "#FFEAD5"
  description: "앱 설명"
  use_icon_as_answer_icon: false
workflow:                  # 워크플로우 데이터
  graph:                   # 노드/엣지 그래프
    nodes: [...]
    edges: [...]
    viewport: { x, y, zoom }
  features: {...}          # UI 기능 설정
  environment_variables: [...] # 환경 변수
  conversation_variables: [...] # 대화 변수
```

---

## App 섹션

```yaml
app:
  name: string             # 앱 이름 (필수)
  mode: string             # "workflow" | "advanced-chat" (필수)
  icon: string             # 이모지 또는 이미지 URL
  icon_background: string  # HEX 색상 (예: "#FFEAD5")
  description: string      # 앱 설명
  use_icon_as_answer_icon: boolean
```

### App Mode
- `workflow`: 워크플로우 모드 - End 노드로 결과 반환
- `advanced-chat`: 챗플로우 모드 - Answer 노드로 스트리밍 응답

---

## Graph 섹션

### Nodes

```yaml
graph:
  nodes:
    - id: "node-abc123"          # 노드 고유 ID (필수)
      type: "custom"             # React Flow 노드 타입 (항상 "custom")
      position:                  # 캔버스 위치 (필수)
        x: 100
        y: 200
      data:                      # 노드 데이터 (필수)
        type: "llm"              # 노드 타입 (BlockEnum)
        title: "LLM 노드"        # 표시 제목
        desc: "설명"             # 설명
        # ... 노드 타입별 추가 필드
      parentId: "iteration-xyz"  # 부모 노드 ID (Iteration 내부인 경우)
      extent: "parent"           # parentId가 있을 때 "parent"
      width: 300                 # 노드 너비 (Iteration 노드용)
      height: 200                # 노드 높이 (Iteration 노드용)
```

### Edges

```yaml
graph:
  edges:
    - id: "edge-abc123"          # 엣지 고유 ID
      source: "node-start"       # 출발 노드 ID
      target: "node-llm"         # 도착 노드 ID
      sourceHandle: "source"     # 출발 핸들 (기본값: "source")
      targetHandle: "target"     # 도착 핸들 (기본값: "target")
      type: "custom"             # 엣지 타입
      data:
        sourceType: "start"      # 출발 노드 타입
        targetType: "llm"        # 도착 노드 타입
```

### Viewport (선택)

```yaml
graph:
  viewport:
    x: 0
    y: 0
    zoom: 1
```

---

## 노드 타입별 Data 구조

### 1. Start (시작)

```yaml
data:
  type: "start"
  title: "시작"
  desc: ""
  variables:                     # 입력 변수 정의
    - type: "text-input"         # InputVarType
      variable: "query"          # 변수명
      label: "질문"              # 표시 라벨
      required: true
      max_length: 1000
      default: ""
      hint: "질문을 입력하세요"
```

**InputVarType 종류:**
- `text-input`: 단일 행 텍스트
- `paragraph`: 여러 행 텍스트
- `select`: 선택 옵션
- `number`: 숫자
- `url`: URL
- `files`: 파일 업로드
- `json`: JSON 객체
- `file`: 단일 파일
- `file-list`: 여러 파일

---

### 2. End (종료)

```yaml
data:
  type: "end"
  title: "종료"
  desc: ""
  outputs:                       # 출력 변수
    - variable: "result"
      value_selector: ["node-llm", "text"]
```

---

### 3. Answer (답변)

```yaml
data:
  type: "answer"
  title: "답변"
  desc: ""
  answer: "{{#node-llm.text#}}"  # 템플릿 문자열
  variables:                      # 참조 변수
    - variable: "text"
      value_selector: ["node-llm", "text"]
```

---

### 4. LLM

```yaml
data:
  type: "llm"
  title: "LLM"
  desc: ""
  model:
    provider: "openai"
    name: "gpt-4"
    mode: "chat"
    registered_provider_id: "uuid-..."
    completion_params:
      temperature: 0.7
      max_tokens: 2000
  prompt_template:
    - role: "system"
      text: "당신은 도움이 되는 AI입니다."
      edition_type: "basic"
    - role: "user"
      text: "{{#sys.query#}}"
  context:
    enabled: true
    variable_selector: [["node-kr", "result"]]
  vision:
    enabled: false
    configs:
      variable_selector: []
      detail: "low"
  memory:
    role_prefix:
      user: "Human"
      assistant: "AI"
    window:
      enabled: true
      size: 10
    query_prompt_template: ""
  variables: []
```

---

### 5. Knowledge Retrieval (지식)

```yaml
data:
  type: "knowledge-retrieval"
  title: "지식"
  desc: ""
  query_variable_selector: ["start", "query"]
  dataset_ids:
    - "dataset-uuid-1"
    - "dataset-uuid-2"
  retrieval_mode: "multi_way"    # "single" | "multi_way"
  multiple_retrieval_config:
    top_k: 4
    score_threshold: 0.5
    reranking_enable: true
    reranking_model:
      provider: "cohere"
      model: "rerank-english-v2.0"
  dataset_retrieval_configs:
    - dataset_id: "dataset-uuid-1"
      dataset_name: "FAQ 문서"
  meta_search_filters: []
```

---

### 6. IF/ELSE (조건)

```yaml
data:
  type: "if-else"
  title: "조건"
  desc: ""
  cases:
    - case_id: "true"
      logical_operator: "and"
      conditions:
        - id: "cond-1"
          varType: "string"
          variable_selector: ["node-llm", "text"]
          comparison_operator: "contains"
          value: "긍정"
    - case_id: "case-2"
      logical_operator: "or"
      conditions:
        - id: "cond-2"
          varType: "number"
          variable_selector: ["start", "score"]
          comparison_operator: ">"
          value: "50"
```

**Comparison Operators:**
- 문자열: `contains`, `not contains`, `start with`, `end with`, `is`, `is not`, `empty`, `not empty`
- 숫자: `=`, `≠`, `>`, `<`, `≥`, `≤`, `empty`, `not empty`
- 배열: `contains`, `not contains`, `empty`, `not empty`, `all of`
- 파일: `exists`, `not exists`

**sourceHandle 값:** `true`, `false`, 또는 `case_id`

---

### 7. Code (코드)

```yaml
data:
  type: "code"
  title: "코드"
  desc: ""
  code_language: "python3"       # "python3" | "javascript"
  code: |
    def main(input_text: str) -> dict:
        result = input_text.upper()
        return {"output": result}
  variables:
    - variable: "input_text"
      value_selector: ["start", "query"]
  outputs:
    output:
      type: "string"
      children: null
  dependencies:
    - name: "requests"
      version: "2.28.0"
```

---

### 8. HTTP Request (API 요청)

```yaml
data:
  type: "http-request"
  title: "API 요청"
  desc: ""
  method: "post"                 # "get" | "post" | "put" | "patch" | "delete"
  url: "https://api.example.com/v1/data"
  headers: |
    Content-Type: application/json
    Authorization: Bearer {{#env.API_KEY#}}
  params: ""
  body:
    type: "json"                 # "none" | "form-data" | "json" | "raw-text"
    data: |
      {
        "query": "{{#start.query#}}"
      }
  authorization:
    type: "api-key"              # "no-auth" | "api-key"
    config:
      type: "bearer"
      api_key: "{{#env.API_KEY#}}"
  timeout:
    connect: 10000
    read: 60000
    write: 60000
```

---

### 9. Tool (도구)

```yaml
data:
  type: "tool"
  title: "웹 검색"
  desc: ""
  provider_id: "google"
  provider_type: "builtin"       # "builtin" | "api" | "workflow" | "mcp"
  provider_name: "google"
  tool_name: "google_search"
  tool_label: "Google 검색"
  tool_parameters:
    query:
      type: "variable"
      value: ["start", "query"]
    num_results:
      type: "constant"
      value: 5
  tool_configurations: {}
```

---

### 10. Iteration (반복)

```yaml
data:
  type: "iteration"
  title: "반복"
  desc: ""
  iterator_selector: ["node-list", "items"]
  output_selector: ["iteration-start", "item"]
  is_parallel: false
  parallel_nums: 10
  error_handle_mode: "terminated"  # "terminated" | "continue-on-error" | "remove-abnormal-output"
  _children: ["iteration-start-xyz", "node-llm-in-iter"]
  width: 600
  height: 400
  start_node_id: "iteration-start-xyz"
```

---

### 11. Question Classifier (의도 분류)

```yaml
data:
  type: "question-classifier"
  title: "의도 분류"
  desc: ""
  query_variable_selector: ["start", "query"]
  model:
    provider: "openai"
    name: "gpt-4"
    mode: "chat"
  classes:
    - id: "class-1"
      name: "제품 문의"
    - id: "class-2"
      name: "기술 지원"
    - id: "class-3"
      name: "기타"
  instruction: "사용자의 질문을 분류해주세요."
```

---

### 12. Template Transform (템플릿)

```yaml
data:
  type: "template-transform"
  title: "템플릿"
  desc: ""
  template: |
    결과: {{ result }}
    점수: {{ score }}
  template_language: "jinja"
  variables:
    - variable: "result"
      value_selector: ["node-llm", "text"]
    - variable: "score"
      value_selector: ["node-code", "score"]
  outputs:
    output:
      type: "string"
      children: null
```

---

### 13. Variable Aggregator (변수 집계기)

```yaml
data:
  type: "variable-aggregator"
  title: "변수 집계기"
  desc: ""
  variables:
    - ["node-1", "text"]
    - ["node-2", "text"]
  output_type: "array[string]"
  advanced_settings:
    group_enabled: false
    groups: []
```

---

### 14. Parameter Extractor (변수 추출)

```yaml
data:
  type: "parameter-extractor"
  title: "변수 추출"
  desc: ""
  model:
    provider: "openai"
    name: "gpt-4"
  query: ["start", "query"]
  reasoning_mode: "function_call"  # "prompt" | "function_call"
  parameters:
    - name: "name"
      type: "string"
      description: "사용자 이름"
      required: true
    - name: "age"
      type: "number"
      description: "나이"
      required: false
  instruction: "텍스트에서 사용자 정보를 추출하세요."
```

---

### 15. Document Extractor (문서 추출기)

```yaml
data:
  type: "document-extractor"
  title: "문서 추출기"
  desc: ""
  variable_selector: ["start", "files"]
  is_array_file: true
```

---

### 16. Variable Assigner (변수 할당)

```yaml
data:
  type: "assigner"
  title: "변수 할당"
  desc: ""
  version: "2"
  items:
    - variable_selector: ["conv", "history"]
      input_type: "variable"
      operation: "over-write"
      value: ["node-llm", "text"]
      write_mode: "over-write"
```

---

## Features 섹션

```yaml
features:
  file_upload:
    enabled: true
    allowed_file_types:
      - "image"
      - "document"
    allowed_file_extensions:
      - ".pdf"
      - ".docx"
    allowed_file_upload_methods:
      - "local_file"
      - "remote_url"
    number_limits: 5
  opening_statement: "안녕하세요! 무엇을 도와드릴까요?"
  suggested_questions:
    - "제품 가격이 궁금해요"
    - "배송은 얼마나 걸리나요?"
  text_to_speech:
    enabled: false
    language: "ko"
    voice: ""
  speech_to_text:
    enabled: false
  retriever_resource:
    enabled: true
  suggested_questions_after_answer:
    enabled: true
  citation:
    enabled: true
```

---

## Variables 섹션

### Environment Variables (환경 변수)

```yaml
environment_variables:
  - id: "env-uuid-1"
    name: "API_KEY"
    value: "sk-..."              # Secret 타입은 암호화됨
    value_type: "secret"         # "string" | "number" | "secret"
```

### Conversation Variables (대화 변수)

```yaml
conversation_variables:
  - id: "conv-uuid-1"
    name: "history"
    value_type: "array[object]"
    value: []
    description: "대화 기록"
```

---

## 변수 참조 방식

### Value Selector
```yaml
# [노드ID, 변수명 또는 경로]
value_selector: ["start", "query"]           # start 노드의 query
value_selector: ["node-llm", "text"]         # LLM 노드의 text 출력
value_selector: ["env", "API_KEY"]           # 환경 변수
value_selector: ["conv", "history"]          # 대화 변수
value_selector: ["sys", "query"]             # 시스템 변수 (사용자 입력)
```

### 템플릿 문자열 내 참조
```yaml
# {{#노드ID.변수명#}} 형식
answer: "결과: {{#node-llm.text#}}"
template: "이름: {{#start.name#}}, 나이: {{#start.age#}}"
```

---

## 원본 파일 참조

- **백엔드 DSL 서비스**: `api/services/app_dsl_service.py`
- **Workflow 모델**: `api/models/workflow.py`
- **노드 타입 정의**: `api/core/workflow/nodes/enums.py`
- **프론트엔드 타입**: `web/src/types/workflow.type.ts`, `web/src/types/node.type.ts`
