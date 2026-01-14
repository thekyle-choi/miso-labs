# MISO Workflow YAML Viewer - 프로젝트 참고 자료

MISO 워크플로우/챗플로우 YAML 파일을 시각화하는 새 Next.js 프로젝트를 위한 참고 자료 모음

## 폴더 구조

```
new/
├── README.md                      # 이 파일
├── reference/                     # 참조 자료
│   ├── types-workflow.ts          # 워크플로우 타입 정의
│   ├── types-node.ts              # 노드별 타입 정의
│   ├── constants.ts               # NODE_ICON, 노드 메타데이터
│   ├── yaml-structure.md          # YAML DSL 구조 문서
│   └── agent-context.md           # 에이전트 Context 가이드
└── project-setup/                 # 프로젝트 설정 템플릿
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    └── next.config.mjs
```

---

## 참조 자료 설명

### reference/types-workflow.ts
기존 MISO 코드베이스에서 추출한 워크플로우 관련 타입 정의
- `BlockEnum`: 16개 노드 타입 enum
- `CommonNodeType`: 모든 노드의 공통 속성
- `GraphType`: 노드/엣지 그래프 구조
- `WorkflowYamlDSL`: YAML 전체 구조 타입

### reference/types-node.ts
노드별 상세 타입 정의
- `StartNodeType`, `EndNodeType`, `AnswerNodeType`
- `LLMNodeType`, `CodeNodeType`, `HttpNodeType`
- `IfElseNodeType`, `IterationNodeType`
- 기타 모든 노드 타입 정의

### reference/constants.ts
노드 관련 상수
- `NODE_ICON`: 노드 타입별 remixicon 코드 및 색상
- `NODE_TITLES`: 노드 타입별 한글 제목
- `NODES_INITIAL_DATA`: 노드 기본값
- 출력 변수 구조체, 레이아웃 상수 등

### reference/yaml-structure.md
YAML DSL 구조에 대한 상세 가이드
- DSL 버전 정보 (현재 0.1.5)
- 전체 구조 설명
- 16개 노드 타입별 data 구조 예시
- Features, Variables 섹션 설명
- 변수 참조 방식 가이드

### reference/agent-context.md
노드 설명 에이전트를 위한 Context 구조
- `NodeAgentContext`: 단일 노드 Context 타입
- `WorkflowAgentContext`: 전체 워크플로우 Context 타입
- Context 빌드 함수 예시
- 에이전트 시스템 프롬프트 예시

---

## 새 프로젝트 생성 방법

### 1. 프로젝트 초기화

```bash
# 새 프로젝트 생성
npx create-next-app@latest miso-workflow-viewer --typescript --tailwind --eslint --app

# 디렉토리 이동
cd miso-workflow-viewer

# package.json 내용 복사 후 의존성 설치
npm install
```

### 2. shadcn/ui 설정 (선택)

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog tabs scroll-area tooltip
```

### 3. remixicon 폰트 추가

```html
<!-- app/layout.tsx의 head에 추가 -->
<link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />
```

### 4. 타입 및 상수 복사

```bash
# reference/ 폴더의 파일들을 적절히 복사
cp reference/types-workflow.ts types/workflow.ts
cp reference/types-node.ts types/node.ts
cp reference/constants.ts lib/constants.ts
```

---

## 핵심 구현 포인트

### YAML 파싱
- `js-yaml` 라이브러리로 클라이언트 사이드 파싱
- DSL 버전 검증 (0.1.x 호환)
- 노드/엣지 데이터를 React Flow 포맷으로 변환

### 노드 렌더링
- React Flow (`@xyflow/react`) 사용
- CustomNode 컴포넌트로 모든 노드 타입 렌더링
- NODE_ICON으로 타입별 아이콘/색상 적용
- BaseNode로 공통 레이아웃 처리

### Iteration 노드 처리
- `parentId`로 자식 노드 식별
- Iteration 노드는 동적 크기 (width, height)
- `extent: "parent"`로 자식 노드 이동 제한

### 상태 관리
- Zustand로 선택된 노드, 워크플로우 데이터 관리
- 노드 선택 시 상세 패널 표시

---

## 원본 코드베이스 참조 파일

| 파일 | 경로 |
|------|------|
| 타입 정의 | `web/src/types/workflow.type.ts` |
| 노드 타입 | `web/src/types/node.type.ts` |
| 상수 | `web/src/constants/workflow.constants.ts` |
| BaseNode | `web/src/app/(menu)/app-config/advanced-chat/(components)/nodes/_base/BaseNode.tsx` |
| 노드 렌더러 | `web/src/app/(menu)/app-config/advanced-chat/(components)/nodeTypes/*.tsx` |
| React Flow 플러그인 | `web/public/plugins/gsneotek-flow-react/` |
| DSL 서비스 | `api/services/app_dsl_service.py` |
| Workflow 모델 | `api/models/workflow.py` |
| 노드 매핑 | `api/core/workflow/nodes/node_mapping.py` |

---

## 노드 타입 요약 (16종)

| 타입 | 값 | 한글명 | 색상 |
|-----|-----|-------|------|
| Start | `start` | 시작 | #4b4e63 |
| End | `end` | 종료 | #4b4e63 |
| Answer | `answer` | 답변 | #31B04D |
| LLM | `llm` | LLM | #6366f1 |
| KnowledgeRetrieval | `knowledge-retrieval` | 지식 | #f79009 |
| QuestionClassifier | `question-classifier` | 의도 분류 | #31b04d |
| IfElse | `if-else` | 조건 | #0ea5e9 |
| Code | `code` | 코드 | #3b82f6 |
| TemplateTransform | `template-transform` | 템플릿 | #3b82f6 |
| HttpRequest | `http-request` | API 요청 | #222 |
| Tool | `tool` | 도구 | #4b4e63 |
| Iteration | `iteration` | 반복 | #E81995 |
| VariableAggregator | `variable-aggregator` | 변수 집계기 | #3b82f6 |
| ParameterExtractor | `parameter-extractor` | 변수 추출 | #3b82f6 |
| DocExtractor | `document-extractor` | 문서 추출기 | #3b82f6 |
| VariableAssigner | `assigner` | 변수 할당 | #3b82f6 |

---

## 다음 단계

1. 새 프로젝트 디렉토리 생성 및 설정
2. YAML 파서 및 변환기 구현
3. React Flow 기반 뷰어 구현
4. 16개 노드 타입별 컴포넌트 구현
5. 노드 상세 패널 구현
6. 에이전트 연동 준비
