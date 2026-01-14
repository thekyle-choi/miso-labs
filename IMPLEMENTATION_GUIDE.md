# MISO Workflow YAML Viewer - 상세 구현 설계서

MISO 워크플로우/챗플로우 YAML 파일을 업로드하면 노드를 시각화하고, 각 노드에 대해 에이전트가 설명할 수 있는 웹 애플리케이션 구현 가이드

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [아키텍처 설계](#3-아키텍처-설계)
4. [디렉토리 구조](#4-디렉토리-구조)
5. [단계별 구현 가이드](#5-단계별-구현-가이드)
6. [핵심 모듈 상세 설계](#6-핵심-모듈-상세-설계)
7. [컴포넌트 상세 설계](#7-컴포넌트-상세-설계)
8. [스타일링 가이드](#8-스타일링-가이드)
9. [에이전트 연동 가이드](#9-에이전트-연동-가이드)
10. [참조 파일 활용 방법](#10-참조-파일-활용-방법)

---

## 1. 프로젝트 개요

### 1.1 목표
- MISO에서 export한 YAML 파일을 업로드하면 워크플로우/챗플로우를 시각화
- 기존 MISO 워크플로우 UI와 유사한 노드 렌더링
- 노드 클릭 시 상세 정보 표시
- 에이전트가 노드를 설명할 수 있도록 Context 제공

### 1.2 주요 기능
1. **YAML 업로드**: 드래그&드롭 또는 파일 선택
2. **워크플로우 시각화**: React Flow 기반 노드/엣지 렌더링
3. **노드 상세 패널**: 선택한 노드의 설정 정보 표시
4. **에이전트 Context**: 노드 설명을 위한 구조화된 데이터 제공

### 1.3 제약 사항
- 읽기 전용 뷰어 (편집 기능 없음)
- 내부 도구/데모용 (인증 불필요)
- DSL 버전 0.1.x 호환

---

## 2. 기술 스택

### 2.1 Core
| 기술 | 버전 | 용도 |
|-----|------|------|
| Next.js | 14.2+ | React 프레임워크 |
| React | 18.3+ | UI 라이브러리 |
| TypeScript | 5.0+ | 타입 안전성 |

### 2.2 UI/스타일링
| 기술 | 버전 | 용도 |
|-----|------|------|
| @xyflow/react | 12.0+ | 노드 그래프 시각화 |
| Tailwind CSS | 3.4+ | 스타일링 |
| Radix UI | 1.1+ | 헤드리스 UI 컴포넌트 |
| Lucide React | 0.400+ | 아이콘 |
| remixicon | 4.2+ | 노드 아이콘 (CDN) |

### 2.3 상태 관리/유틸
| 기술 | 버전 | 용도 |
|-----|------|------|
| Zustand | 4.4+ | 전역 상태 관리 |
| js-yaml | 4.1+ | YAML 파싱 |
| tailwind-merge | 2.4+ | 클래스 병합 |
| clsx | 2.1+ | 조건부 클래스 |

---

## 3. 아키텍처 설계

### 3.1 데이터 흐름

```
┌─────────────────┐
│  YAML 파일 업로드  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   YAML 파싱      │  ← js-yaml
│  (yaml-parser)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Flow 변환  │  ← node-transformer
│ (nodes, edges)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Zustand Store  │  ← viewer-store
│  (전역 상태 저장)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌─────────┐
│Viewer │ │InfoPanel│
│(캔버스)│ │(상세패널)│
└───────┘ └─────────┘
```

### 3.2 컴포넌트 계층

```
App (layout.tsx)
├── HomePage (page.tsx)
│   └── YamlUploader
│       └── DropZone
│
└── ViewerPage (viewer/page.tsx)
    ├── WorkflowViewer
    │   ├── ReactFlow
    │   │   ├── CustomNode
    │   │   │   └── BaseNode
    │   │   │       └── [NodeType]Node (16종)
    │   │   └── CustomEdge
    │   ├── MiniMap
    │   └── Controls
    │
    └── NodeInfoPanel
        ├── NodeHeader
        ├── NodeConfig
        └── NodeConnections
```

### 3.3 상태 관리 구조

```typescript
// Zustand Store 구조
interface ViewerStore {
  // 워크플로우 데이터
  workflowData: WorkflowYamlDSL | null;
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];

  // UI 상태
  selectedNodeId: string | null;
  selectedNode: GraphNode | null;
  isPanelOpen: boolean;

  // 액션
  setWorkflowData: (data: WorkflowYamlDSL) => void;
  selectNode: (nodeId: string | null) => void;
  clearWorkflow: () => void;
}
```

---

## 4. 디렉토리 구조

```
miso-workflow-viewer/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── page.tsx                   # 홈페이지 (업로드)
│   ├── globals.css                # 전역 스타일
│   └── viewer/
│       └── page.tsx               # 뷰어 페이지
│
├── components/
│   ├── ui/                        # 기본 UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── scroll-area.tsx
│   │   ├── tabs.tsx
│   │   └── tooltip.tsx
│   │
│   ├── upload/                    # 업로드 관련
│   │   ├── YamlUploader.tsx       # 메인 업로더
│   │   └── DropZone.tsx           # 드래그&드롭 영역
│   │
│   ├── viewer/                    # 뷰어 관련
│   │   ├── WorkflowViewer.tsx     # 메인 React Flow 캔버스
│   │   ├── ViewerControls.tsx     # 줌/팬 컨트롤
│   │   ├── ViewerMiniMap.tsx      # 미니맵
│   │   └── NodeInfoPanel.tsx      # 노드 상세 패널
│   │
│   └── nodes/                     # 노드 컴포넌트
│       ├── _base/
│       │   ├── BaseNode.tsx       # 기본 노드 래퍼
│       │   ├── CustomNode.tsx     # React Flow 노드 렌더러
│       │   ├── CustomEdge.tsx     # 엣지 렌더러
│       │   └── NodeIcon.tsx       # 노드 아이콘
│       │
│       └── types/                 # 노드 타입별 컴포넌트 (16개)
│           ├── StartNode.tsx
│           ├── EndNode.tsx
│           ├── AnswerNode.tsx
│           ├── LLMNode.tsx
│           ├── KnowledgeRetrievalNode.tsx
│           ├── QuestionClassifierNode.tsx
│           ├── IfElseNode.tsx
│           ├── CodeNode.tsx
│           ├── TemplateTransformNode.tsx
│           ├── HttpRequestNode.tsx
│           ├── ToolNode.tsx
│           ├── IterationNode.tsx
│           ├── VariableAggregatorNode.tsx
│           ├── ParameterExtractorNode.tsx
│           ├── DocExtractorNode.tsx
│           └── VariableAssignerNode.tsx
│
├── lib/                           # 유틸리티/로직
│   ├── yaml-parser.ts             # YAML 파싱
│   ├── node-transformer.ts        # React Flow 변환
│   ├── agent-context.ts           # 에이전트 Context 빌더
│   ├── constants.ts               # 상수 (NODE_ICON 등)
│   └── utils.ts                   # cn() 등 유틸
│
├── types/                         # 타입 정의
│   ├── workflow.ts                # 워크플로우 타입
│   └── node.ts                    # 노드 타입
│
├── store/                         # 상태 관리
│   └── viewer-store.ts            # Zustand 스토어
│
├── hooks/                         # 커스텀 훅
│   ├── useWorkflowViewer.ts       # 뷰어 상태 훅
│   └── useNodeSelection.ts        # 노드 선택 훅
│
└── public/
    └── sample/                    # 샘플 YAML 파일
        └── sample-workflow.yaml
```

---

## 5. 단계별 구현 가이드

### Phase 1: 프로젝트 초기화 (Day 1)

#### Step 1.1: Next.js 프로젝트 생성

```bash
# 프로젝트 생성
npx create-next-app@latest miso-workflow-viewer \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd miso-workflow-viewer
```

#### Step 1.2: 의존성 설치

```bash
# 핵심 의존성
npm install @xyflow/react zustand js-yaml immer

# UI 컴포넌트
npm install @radix-ui/react-dialog @radix-ui/react-scroll-area \
  @radix-ui/react-tabs @radix-ui/react-tooltip lucide-react

# 유틸리티
npm install tailwind-merge clsx class-variance-authority

# 타입
npm install -D @types/js-yaml
```

#### Step 1.3: 타입 파일 복사

```bash
# reference 폴더에서 복사
mkdir -p types lib

# types-workflow.ts → types/workflow.ts
# types-node.ts → types/node.ts
# constants.ts → lib/constants.ts
```

#### Step 1.4: 전역 스타일 설정

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* remixicon 폰트 */
@import url('https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css');

/* React Flow 스타일 */
@import '@xyflow/react/dist/style.css';

/* CSS 변수 */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}

/* 노드 기본 스타일 */
.react-flow__node {
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: none;
}
```

---

### Phase 2: 핵심 모듈 구현 (Day 2)

#### Step 2.1: YAML 파서 구현

**파일**: `lib/yaml-parser.ts`

```typescript
import yaml from 'js-yaml';
import type { WorkflowYamlDSL } from '@/types/workflow';

const SUPPORTED_VERSION_MAJOR = 0;
const SUPPORTED_VERSION_MINOR = 1;

export interface ParseResult {
  success: boolean;
  data?: WorkflowYamlDSL;
  error?: string;
  warnings?: string[];
}

export function parseWorkflowYaml(content: string): ParseResult {
  const warnings: string[] = [];

  try {
    // 1. YAML 파싱
    const data = yaml.load(content) as any;

    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Invalid YAML format' };
    }

    // 2. 버전 검증
    const version = data.version || '0.1.0';
    const versionCheck = validateVersion(version);
    if (!versionCheck.valid) {
      return { success: false, error: versionCheck.error };
    }
    if (versionCheck.warning) {
      warnings.push(versionCheck.warning);
    }

    // 3. 필수 필드 검증
    if (data.kind !== 'app') {
      return { success: false, error: 'Invalid kind: expected "app"' };
    }

    if (!data.app || !data.app.name || !data.app.mode) {
      return { success: false, error: 'Missing required app fields' };
    }

    if (!data.workflow || !data.workflow.graph) {
      return { success: false, error: 'Missing workflow graph' };
    }

    // 4. 그래프 정제 (null 노드 제거)
    if (data.workflow.graph.nodes) {
      data.workflow.graph.nodes = data.workflow.graph.nodes.filter(
        (node: any) => node !== null
      );
    }

    // 5. 기본값 설정
    const normalizedData: WorkflowYamlDSL = {
      version: data.version || '0.1.0',
      kind: 'app',
      app: {
        name: data.app.name,
        mode: data.app.mode,
        icon: data.app.icon || '🤖',
        icon_background: data.app.icon_background || '#FFEAD5',
        description: data.app.description || '',
        use_icon_as_answer_icon: data.app.use_icon_as_answer_icon || false,
      },
      workflow: {
        graph: {
          nodes: data.workflow.graph.nodes || [],
          edges: data.workflow.graph.edges || [],
          viewport: data.workflow.graph.viewport || { x: 0, y: 0, zoom: 1 },
        },
        features: data.workflow.features || {},
        environment_variables: data.workflow.environment_variables || [],
        conversation_variables: data.workflow.conversation_variables || [],
      },
    };

    return {
      success: true,
      data: normalizedData,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (e) {
    return {
      success: false,
      error: `YAML parsing error: ${e instanceof Error ? e.message : 'Unknown error'}`,
    };
  }
}

function validateVersion(version: string): {
  valid: boolean;
  error?: string;
  warning?: string;
} {
  const parts = version.split('.').map(Number);
  const [major, minor, patch] = parts;

  if (major !== SUPPORTED_VERSION_MAJOR) {
    return {
      valid: false,
      error: `Unsupported major version: ${major}. Expected ${SUPPORTED_VERSION_MAJOR}`,
    };
  }

  if (minor !== SUPPORTED_VERSION_MINOR) {
    return {
      valid: false,
      error: `Unsupported minor version: ${minor}. Expected ${SUPPORTED_VERSION_MINOR}`,
    };
  }

  // patch 버전은 경고만
  if (patch !== undefined && patch > 5) {
    return {
      valid: true,
      warning: `DSL version ${version} may have unsupported features`,
    };
  }

  return { valid: true };
}
```

#### Step 2.2: 노드 변환기 구현

**파일**: `lib/node-transformer.ts`

```typescript
import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';
import type { WorkflowYamlDSL, GraphNode, GraphEdge } from '@/types/workflow';

export interface TransformResult {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  viewport: { x: number; y: number; zoom: number };
}

export function transformWorkflowToReactFlow(
  workflow: WorkflowYamlDSL
): TransformResult {
  const { graph } = workflow.workflow;

  const nodes = transformNodes(graph.nodes);
  const edges = transformEdges(graph.edges);
  const viewport = graph.viewport || { x: 0, y: 0, zoom: 1 };

  return { nodes, edges, viewport };
}

function transformNodes(yamlNodes: GraphNode[]): ReactFlowNode[] {
  return yamlNodes.map((node) => {
    const isIteration = node.data.type === 'iteration';
    const isIterationChild = !!node.parentId;

    return {
      id: node.id,
      type: 'custom', // 모든 노드는 CustomNode로 렌더링
      position: node.position,
      data: {
        ...node.data,
        // 기본값 보장
        title: node.data.title || '',
        desc: node.data.desc || '',
      },
      // Iteration 내부 노드 처리
      parentId: node.parentId,
      extent: isIterationChild ? 'parent' : undefined,
      // Iteration 노드 크기
      width: isIteration ? node.width || node.data.width || 600 : undefined,
      height: isIteration ? node.height || node.data.height || 400 : undefined,
      // z-index (Iteration 자식은 위에)
      zIndex: isIterationChild ? 1002 : isIteration ? 1 : undefined,
      // 드래그/선택 비활성화 (읽기 전용)
      draggable: false,
      selectable: true,
      connectable: false,
    };
  });
}

function transformEdges(yamlEdges: GraphEdge[]): ReactFlowEdge[] {
  return yamlEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle || 'source',
    targetHandle: edge.targetHandle || 'target',
    type: 'custom', // CustomEdge로 렌더링
    data: {
      sourceType: edge.data?.sourceType,
      targetType: edge.data?.targetType,
    },
    // 읽기 전용
    deletable: false,
    updatable: false,
  }));
}

// 노드 ID로 노드 찾기
export function findNodeById(
  nodes: GraphNode[],
  nodeId: string
): GraphNode | undefined {
  return nodes.find((node) => node.id === nodeId);
}

// 연결된 노드 찾기
export function findConnectedNodes(
  nodeId: string,
  nodes: GraphNode[],
  edges: GraphEdge[]
): {
  incoming: GraphNode[];
  outgoing: GraphNode[];
} {
  const incomingEdges = edges.filter((e) => e.target === nodeId);
  const outgoingEdges = edges.filter((e) => e.source === nodeId);

  const incoming = incomingEdges
    .map((e) => findNodeById(nodes, e.source))
    .filter((n): n is GraphNode => n !== undefined);

  const outgoing = outgoingEdges
    .map((e) => findNodeById(nodes, e.target))
    .filter((n): n is GraphNode => n !== undefined);

  return { incoming, outgoing };
}
```

#### Step 2.3: Zustand 스토어 구현

**파일**: `store/viewer-store.ts`

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';
import type { WorkflowYamlDSL, GraphNode } from '@/types/workflow';
import { transformWorkflowToReactFlow, findNodeById } from '@/lib/node-transformer';

interface ViewerState {
  // 워크플로우 데이터
  workflowData: WorkflowYamlDSL | null;
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  viewport: { x: number; y: number; zoom: number };

  // UI 상태
  selectedNodeId: string | null;
  selectedNode: GraphNode | null;
  isPanelOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

interface ViewerActions {
  // 워크플로우 액션
  setWorkflowData: (data: WorkflowYamlDSL) => void;
  clearWorkflow: () => void;

  // 노드 선택 액션
  selectNode: (nodeId: string | null) => void;

  // UI 액션
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  togglePanel: () => void;
}

type ViewerStore = ViewerState & ViewerActions;

const initialState: ViewerState = {
  workflowData: null,
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  selectedNodeId: null,
  selectedNode: null,
  isPanelOpen: false,
  isLoading: false,
  error: null,
};

export const useViewerStore = create<ViewerStore>()(
  immer((set, get) => ({
    ...initialState,

    setWorkflowData: (data) => {
      const { nodes, edges, viewport } = transformWorkflowToReactFlow(data);
      set((state) => {
        state.workflowData = data;
        state.nodes = nodes;
        state.edges = edges;
        state.viewport = viewport;
        state.error = null;
      });
    },

    clearWorkflow: () => {
      set((state) => {
        state.workflowData = null;
        state.nodes = [];
        state.edges = [];
        state.viewport = { x: 0, y: 0, zoom: 1 };
        state.selectedNodeId = null;
        state.selectedNode = null;
        state.isPanelOpen = false;
      });
    },

    selectNode: (nodeId) => {
      set((state) => {
        state.selectedNodeId = nodeId;
        if (nodeId && state.workflowData) {
          const node = findNodeById(
            state.workflowData.workflow.graph.nodes,
            nodeId
          );
          state.selectedNode = node || null;
          state.isPanelOpen = !!node;
        } else {
          state.selectedNode = null;
          state.isPanelOpen = false;
        }
      });
    },

    setLoading: (loading) => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setError: (error) => {
      set((state) => {
        state.error = error;
      });
    },

    togglePanel: () => {
      set((state) => {
        state.isPanelOpen = !state.isPanelOpen;
      });
    },
  }))
);

// 셀렉터
export const useWorkflowData = () => useViewerStore((s) => s.workflowData);
export const useNodes = () => useViewerStore((s) => s.nodes);
export const useEdges = () => useViewerStore((s) => s.edges);
export const useSelectedNode = () => useViewerStore((s) => s.selectedNode);
export const useIsPanelOpen = () => useViewerStore((s) => s.isPanelOpen);
```

---

### Phase 3: UI 컴포넌트 구현 (Day 3-4)

#### Step 3.1: 유틸리티 함수

**파일**: `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### Step 3.2: YAML 업로더 컴포넌트

**파일**: `components/upload/YamlUploader.tsx`

```typescript
'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { parseWorkflowYaml } from '@/lib/yaml-parser';
import { useViewerStore } from '@/store/viewer-store';
import { cn } from '@/lib/utils';

export default function YamlUploader() {
  const router = useRouter();
  const setWorkflowData = useViewerStore((s) => s.setWorkflowData);
  const setError = useViewerStore((s) => s.setError);

  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setParseError(null);

      try {
        const content = await file.text();
        const result = parseWorkflowYaml(content);

        if (!result.success) {
          setParseError(result.error || 'Unknown error');
          return;
        }

        if (result.data) {
          setWorkflowData(result.data);
          router.push('/viewer');
        }
      } catch (e) {
        setParseError('Failed to read file');
      }
    },
    [setWorkflowData, router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.yml'))) {
        handleFile(file);
      } else {
        setParseError('Please upload a .yaml or .yml file');
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-12',
          'transition-colors duration-200',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          parseError && 'border-red-300 bg-red-50'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".yaml,.yml"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-4 text-center">
          {parseError ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-500" />
              <div>
                <p className="text-lg font-medium text-red-700">Error</p>
                <p className="text-sm text-red-600">{parseError}</p>
              </div>
            </>
          ) : fileName ? (
            <>
              <FileText className="w-12 h-12 text-blue-500" />
              <div>
                <p className="text-lg font-medium">{fileName}</p>
                <p className="text-sm text-gray-500">Processing...</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium">
                  Drop your YAML file here
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 파일 형식 안내 */}
      <p className="mt-4 text-sm text-center text-gray-500">
        MISO에서 export한 워크플로우/챗플로우 YAML 파일 (DSL v0.1.x)
      </p>
    </div>
  );
}
```

#### Step 3.3: 워크플로우 뷰어 컴포넌트

**파일**: `components/viewer/WorkflowViewer.tsx`

```typescript
'use client';

import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  type NodeMouseHandler,
} from '@xyflow/react';
import { useViewerStore } from '@/store/viewer-store';
import CustomNode from '@/components/nodes/_base/CustomNode';
import CustomEdge from '@/components/nodes/_base/CustomEdge';
import NodeInfoPanel from './NodeInfoPanel';

// 노드/엣지 타입 등록
const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

function WorkflowViewerInner() {
  const { fitView } = useReactFlow();

  const nodes = useViewerStore((s) => s.nodes);
  const edges = useViewerStore((s) => s.edges);
  const viewport = useViewerStore((s) => s.viewport);
  const selectedNodeId = useViewerStore((s) => s.selectedNodeId);
  const selectNode = useViewerStore((s) => s.selectNode);
  const isPanelOpen = useViewerStore((s) => s.isPanelOpen);

  // 초기 뷰포트 설정
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.2 });
      }, 100);
    }
  }, [nodes, fitView]);

  // 노드 클릭 핸들러
  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  // 캔버스 클릭 (노드 선택 해제)
  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="w-full h-full flex">
      {/* 메인 캔버스 */}
      <div className={`flex-1 h-full ${isPanelOpen ? 'pr-96' : ''}`}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            selected: node.id === selectedNodeId,
          }))}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          defaultViewport={viewport}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          // 읽기 전용 설정
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={true}
          zoomOnScroll={true}
          // 스타일
          className="bg-gray-50"
        >
          <Background color="#e5e7eb" gap={20} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(node) => {
              const type = node.data?.type;
              return getNodeColor(type);
            }}
            maskColor="rgba(255, 255, 255, 0.8)"
          />
        </ReactFlow>
      </div>

      {/* 상세 패널 */}
      {isPanelOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-white border-l shadow-lg overflow-hidden">
          <NodeInfoPanel />
        </div>
      )}
    </div>
  );
}

// 노드 타입별 색상
function getNodeColor(type?: string): string {
  const colors: Record<string, string> = {
    start: '#4b4e63',
    llm: '#6366f1',
    'knowledge-retrieval': '#f79009',
    answer: '#31B04D',
    'question-classifier': '#31b04d',
    'if-else': '#0ea5e9',
    iteration: '#E81995',
    code: '#3b82f6',
    'template-transform': '#3b82f6',
    'variable-aggregator': '#3b82f6',
    'parameter-extractor': '#3b82f6',
    assigner: '#3b82f6',
    'http-request': '#222',
    'document-extractor': '#3b82f6',
    tool: '#4b4e63',
    end: '#4b4e63',
  };
  return colors[type || ''] || '#4b4e63';
}

export default function WorkflowViewer() {
  return (
    <ReactFlowProvider>
      <WorkflowViewerInner />
    </ReactFlowProvider>
  );
}
```

---

### Phase 4: 노드 컴포넌트 구현 (Day 4-5)

#### Step 4.1: 노드 아이콘 컴포넌트

**파일**: `components/nodes/_base/NodeIcon.tsx`

```typescript
import { NODE_ICON } from '@/lib/constants';
import type { BlockEnum } from '@/types/workflow';

interface NodeIconProps {
  type: BlockEnum | string;
  size?: number;
  className?: string;
}

export default function NodeIcon({ type, size = 20, className }: NodeIconProps) {
  const icon = NODE_ICON[type];

  if (!icon || !icon.code) {
    return null;
  }

  return (
    <span
      className={className}
      style={{
        fontFamily: 'remixicon',
        fontSize: size,
        color: icon.color,
        fontWeight: 'normal',
        verticalAlign: 'middle',
        lineHeight: 1,
        display: 'inline-block',
      }}
      dangerouslySetInnerHTML={{ __html: `&#x${icon.code};` }}
    />
  );
}
```

#### Step 4.2: BaseNode 컴포넌트

**파일**: `components/nodes/_base/BaseNode.tsx`

```typescript
import { ReactNode } from 'react';
import { NODE_ICON, NODE_TITLES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import NodeIcon from './NodeIcon';
import type { BlockEnum } from '@/types/workflow';

interface BaseNodeProps {
  id: string;
  type: BlockEnum | string;
  title?: string;
  selected?: boolean;
  isIteration?: boolean;
  width?: number;
  height?: number;
  children?: ReactNode;
}

export default function BaseNode({
  id,
  type,
  title,
  selected,
  isIteration,
  width,
  height,
  children,
}: BaseNodeProps) {
  const icon = NODE_ICON[type];
  const defaultTitle = NODE_TITLES[type] || type;
  const borderColor = icon?.color || '#4b4e63';

  return (
    <div
      className={cn(
        'flex flex-col gap-1 p-4 rounded-lg bg-white',
        'hover:shadow-lg transition-shadow',
        // 왼쪽 색상 바
        'relative before:absolute before:top-0 before:bottom-0 before:left-0',
        'before:w-1 before:h-full before:rounded-l-lg',
        // 선택 상태
        selected ? 'ring-2 ring-black' : 'ring-1 ring-gray-200'
      )}
      style={{
        width: isIteration ? width : 300,
        height: isIteration ? height : 'auto',
        // 동적 왼쪽 바 색상
        ['--node-border-color' as any]: borderColor,
      }}
    >
      {/* 왼쪽 색상 바 (CSS로 처리하기 어려워 인라인) */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1 rounded-l-lg"
        style={{ backgroundColor: borderColor }}
      />

      {/* 헤더 */}
      <div className="flex items-center gap-2 text-[15px] font-bold text-black z-10">
        <NodeIcon type={type} />
        <span>{title || defaultTitle}</span>
      </div>

      {/* 내용 */}
      {children && (
        <div className="flex flex-col gap-1 text-[13px] text-gray-700 z-10">
          {children}
        </div>
      )}
    </div>
  );
}
```

#### Step 4.3: CustomNode 컴포넌트

**파일**: `components/nodes/_base/CustomNode.tsx`

```typescript
import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { BlockEnum } from '@/types/workflow';
import BaseNode from './BaseNode';

// 노드 타입별 컴포넌트 import
import StartNode from '../types/StartNode';
import EndNode from '../types/EndNode';
import AnswerNode from '../types/AnswerNode';
import LLMNode from '../types/LLMNode';
import KnowledgeRetrievalNode from '../types/KnowledgeRetrievalNode';
import QuestionClassifierNode from '../types/QuestionClassifierNode';
import IfElseNode from '../types/IfElseNode';
import CodeNode from '../types/CodeNode';
import TemplateTransformNode from '../types/TemplateTransformNode';
import HttpRequestNode from '../types/HttpRequestNode';
import ToolNode from '../types/ToolNode';
import IterationNode from '../types/IterationNode';
import VariableAggregatorNode from '../types/VariableAggregatorNode';
import ParameterExtractorNode from '../types/ParameterExtractorNode';
import DocExtractorNode from '../types/DocExtractorNode';
import VariableAssignerNode from '../types/VariableAssignerNode';

// 노드 타입별 컴포넌트 맵
const NodeComponentMap: Record<string, React.ComponentType<any>> = {
  [BlockEnum.Start]: StartNode,
  [BlockEnum.End]: EndNode,
  [BlockEnum.Answer]: AnswerNode,
  [BlockEnum.LLM]: LLMNode,
  [BlockEnum.KnowledgeRetrieval]: KnowledgeRetrievalNode,
  [BlockEnum.QuestionClassifier]: QuestionClassifierNode,
  [BlockEnum.IfElse]: IfElseNode,
  [BlockEnum.Code]: CodeNode,
  [BlockEnum.TemplateTransform]: TemplateTransformNode,
  [BlockEnum.HttpRequest]: HttpRequestNode,
  [BlockEnum.Tool]: ToolNode,
  [BlockEnum.Iteration]: IterationNode,
  [BlockEnum.VariableAggregator]: VariableAggregatorNode,
  [BlockEnum.ParameterExtractor]: ParameterExtractorNode,
  [BlockEnum.DocExtractor]: DocExtractorNode,
  [BlockEnum.VariableAssigner]: VariableAssignerNode,
};

function CustomNode({ id, data, selected }: NodeProps) {
  const nodeType = data.type as string;
  const NodeComponent = NodeComponentMap[nodeType];

  const isIteration = nodeType === BlockEnum.Iteration;

  return (
    <BaseNode
      id={id}
      type={nodeType}
      title={data.title as string}
      selected={selected}
      isIteration={isIteration}
      width={data.width as number}
      height={data.height as number}
    >
      {NodeComponent ? (
        <NodeComponent data={data} />
      ) : (
        <div className="text-gray-500 text-xs">
          Unknown node type: {nodeType}
        </div>
      )}
    </BaseNode>
  );
}

export default memo(CustomNode);
```

#### Step 4.4: 노드 타입별 컴포넌트 예시

**파일**: `components/nodes/types/LLMNode.tsx`

```typescript
interface LLMNodeProps {
  data: {
    model?: {
      provider: string;
      name: string;
    };
    prompt_template?: Array<{
      role: string;
      text: string;
    }>;
    context?: { enabled: boolean };
    vision?: { enabled: boolean };
    memory?: { window?: { enabled: boolean } };
  };
}

export default function LLMNode({ data }: LLMNodeProps) {
  const { model, prompt_template, context, vision, memory } = data;

  return (
    <div className="space-y-1">
      {/* 모델 정보 */}
      {model && (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-500">모델:</span>
          <span className="font-medium">
            {model.provider}/{model.name}
          </span>
        </div>
      )}

      {/* 프롬프트 개수 */}
      {prompt_template && prompt_template.length > 0 && (
        <div className="text-xs text-gray-500">
          프롬프트: {prompt_template.length}개 메시지
        </div>
      )}

      {/* 기능 뱃지 */}
      <div className="flex gap-1 flex-wrap">
        {context?.enabled && (
          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] rounded">
            Context
          </span>
        )}
        {vision?.enabled && (
          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded">
            Vision
          </span>
        )}
        {memory?.window?.enabled && (
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded">
            Memory
          </span>
        )}
      </div>
    </div>
  );
}
```

**파일**: `components/nodes/types/IfElseNode.tsx`

```typescript
import { COMPARISON_OPERATOR_KR, LOGICAL_OPERATOR_KR } from '@/lib/constants';

interface IfElseNodeProps {
  data: {
    cases?: Array<{
      case_id: string;
      logical_operator: string;
      conditions: Array<{
        variable_selector?: string[];
        comparison_operator?: string;
        value: string | string[];
      }>;
    }>;
  };
}

export default function IfElseNode({ data }: IfElseNodeProps) {
  const { cases } = data;

  if (!cases || cases.length === 0) {
    return <div className="text-gray-400 text-xs">조건 없음</div>;
  }

  return (
    <div className="space-y-2 border-t pt-2">
      {cases.slice(0, 3).map((caseItem, index) => (
        <div
          key={caseItem.case_id}
          className="flex items-center gap-2 text-xs"
        >
          <span className="font-medium text-blue-600">
            {index === 0 ? 'IF' : 'ELIF'}
          </span>
          <span className="text-gray-500">
            {caseItem.conditions.length}개 조건
            ({LOGICAL_OPERATOR_KR[caseItem.logical_operator] || caseItem.logical_operator})
          </span>
        </div>
      ))}
      {cases.length > 3 && (
        <div className="text-xs text-gray-400">
          +{cases.length - 3}개 더...
        </div>
      )}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-medium text-gray-600">ELSE</span>
      </div>
    </div>
  );
}
```

**파일**: `components/nodes/types/CodeNode.tsx`

```typescript
interface CodeNodeProps {
  data: {
    code_language?: string;
    code?: string;
    outputs?: Record<string, { type: string }>;
  };
}

export default function CodeNode({ data }: CodeNodeProps) {
  const { code_language, code, outputs } = data;

  const outputCount = outputs ? Object.keys(outputs).length : 0;
  const codePreview = code ? code.substring(0, 50) : '';

  return (
    <div className="space-y-1">
      {/* 언어 */}
      <div className="flex items-center gap-1 text-xs">
        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded font-mono">
          {code_language || 'python3'}
        </span>
      </div>

      {/* 코드 미리보기 */}
      {codePreview && (
        <div className="text-[10px] text-gray-500 font-mono truncate">
          {codePreview}...
        </div>
      )}

      {/* 출력 개수 */}
      {outputCount > 0 && (
        <div className="text-xs text-gray-500">
          출력: {outputCount}개 변수
        </div>
      )}
    </div>
  );
}
```

---

### Phase 5: 상세 패널 구현 (Day 5-6)

#### Step 5.1: NodeInfoPanel 컴포넌트

**파일**: `components/viewer/NodeInfoPanel.tsx`

```typescript
'use client';

import { X } from 'lucide-react';
import { useViewerStore } from '@/store/viewer-store';
import { NODE_TITLES } from '@/lib/constants';
import NodeIcon from '@/components/nodes/_base/NodeIcon';
import { buildNodeAgentContext } from '@/lib/agent-context';

export default function NodeInfoPanel() {
  const selectedNode = useViewerStore((s) => s.selectedNode);
  const workflowData = useViewerStore((s) => s.workflowData);
  const selectNode = useViewerStore((s) => s.selectNode);

  if (!selectedNode || !workflowData) {
    return null;
  }

  const { data } = selectedNode;
  const nodeType = data.type;
  const nodeTitle = data.title || NODE_TITLES[nodeType] || nodeType;

  // 에이전트 Context 빌드
  const agentContext = buildNodeAgentContext(
    selectedNode.id,
    workflowData.workflow.graph.nodes,
    workflowData.workflow.graph.edges
  );

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <NodeIcon type={nodeType} size={24} />
          <div>
            <h2 className="font-bold">{nodeTitle}</h2>
            <p className="text-xs text-gray-500">{nodeType}</p>
          </div>
        </div>
        <button
          onClick={() => selectNode(null)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 내용 */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* 설명 */}
        {data.desc && (
          <section>
            <h3 className="text-sm font-medium text-gray-700 mb-1">설명</h3>
            <p className="text-sm text-gray-600">{data.desc}</p>
          </section>
        )}

        {/* 노드 설정 */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 mb-2">설정</h3>
          <NodeConfigDisplay type={nodeType} data={data} />
        </section>

        {/* 연결 정보 */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 mb-2">연결</h3>
          <div className="space-y-2">
            {agentContext.incomingNodes.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">이전 노드</p>
                <div className="flex flex-wrap gap-1">
                  {agentContext.incomingNodes.map((node) => (
                    <span
                      key={node.id}
                      className="px-2 py-0.5 bg-gray-100 text-xs rounded"
                    >
                      {node.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {agentContext.outgoingNodes.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">다음 노드</p>
                <div className="flex flex-wrap gap-1">
                  {agentContext.outgoingNodes.map((node) => (
                    <span
                      key={node.id}
                      className="px-2 py-0.5 bg-gray-100 text-xs rounded"
                    >
                      {node.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 에이전트 Context (개발용) */}
        <section>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Agent Context
          </h3>
          <pre className="text-[10px] bg-gray-50 p-2 rounded overflow-auto max-h-64">
            {JSON.stringify(agentContext, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
}

// 노드 타입별 설정 표시
function NodeConfigDisplay({ type, data }: { type: string; data: any }) {
  switch (type) {
    case 'llm':
      return <LLMConfig data={data} />;
    case 'code':
      return <CodeConfig data={data} />;
    case 'http-request':
      return <HttpConfig data={data} />;
    case 'if-else':
      return <IfElseConfig data={data} />;
    case 'knowledge-retrieval':
      return <KnowledgeConfig data={data} />;
    case 'tool':
      return <ToolConfig data={data} />;
    case 'iteration':
      return <IterationConfig data={data} />;
    default:
      return <GenericConfig data={data} />;
  }
}

// 설정 표시 컴포넌트들
function LLMConfig({ data }: { data: any }) {
  return (
    <div className="space-y-2 text-sm">
      {data.model && (
        <ConfigRow label="모델" value={`${data.model.provider}/${data.model.name}`} />
      )}
      {data.prompt_template && (
        <ConfigRow label="프롬프트" value={`${data.prompt_template.length}개 메시지`} />
      )}
      <ConfigRow label="Context" value={data.context?.enabled ? '활성화' : '비활성화'} />
      <ConfigRow label="Vision" value={data.vision?.enabled ? '활성화' : '비활성화'} />
      <ConfigRow label="Memory" value={data.memory?.window?.enabled ? '활성화' : '비활성화'} />
    </div>
  );
}

function CodeConfig({ data }: { data: any }) {
  return (
    <div className="space-y-2 text-sm">
      <ConfigRow label="언어" value={data.code_language || 'python3'} />
      {data.code && (
        <div>
          <p className="text-xs text-gray-500 mb-1">코드</p>
          <pre className="text-[10px] bg-gray-50 p-2 rounded overflow-auto max-h-32 font-mono">
            {data.code}
          </pre>
        </div>
      )}
    </div>
  );
}

function HttpConfig({ data }: { data: any }) {
  return (
    <div className="space-y-2 text-sm">
      <ConfigRow label="메서드" value={data.method?.toUpperCase() || 'GET'} />
      <ConfigRow label="URL" value={data.url || '-'} />
      <ConfigRow label="인증" value={data.authorization?.type || 'no-auth'} />
    </div>
  );
}

function IfElseConfig({ data }: { data: any }) {
  return (
    <div className="space-y-2 text-sm">
      <ConfigRow label="케이스 수" value={`${data.cases?.length || 0}개`} />
    </div>
  );
}

function KnowledgeConfig({ data }: { data: any }) {
  return (
    <div className="space-y-2 text-sm">
      <ConfigRow label="검색 모드" value={data.retrieval_mode || 'single'} />
      <ConfigRow label="데이터셋" value={`${data.dataset_ids?.length || 0}개`} />
    </div>
  );
}

function ToolConfig({ data }: { data: any }) {
  return (
    <div className="space-y-2 text-sm">
      <ConfigRow label="도구" value={data.tool_label || data.tool_name || '-'} />
      <ConfigRow label="제공자" value={data.provider_name || '-'} />
      <ConfigRow label="유형" value={data.provider_type || '-'} />
    </div>
  );
}

function IterationConfig({ data }: { data: any }) {
  return (
    <div className="space-y-2 text-sm">
      <ConfigRow label="병렬 실행" value={data.is_parallel ? '활성화' : '비활성화'} />
      {data.is_parallel && (
        <ConfigRow label="병렬 수" value={String(data.parallel_nums || 10)} />
      )}
      <ConfigRow label="에러 처리" value={data.error_handle_mode || 'terminated'} />
    </div>
  );
}

function GenericConfig({ data }: { data: any }) {
  // 주요 필드만 표시
  const displayFields = ['variables', 'outputs', 'template'];
  return (
    <div className="space-y-2 text-sm">
      {displayFields.map((field) => {
        if (data[field]) {
          const value = Array.isArray(data[field])
            ? `${data[field].length}개`
            : typeof data[field] === 'object'
            ? `${Object.keys(data[field]).length}개`
            : String(data[field]);
          return <ConfigRow key={field} label={field} value={value} />;
        }
        return null;
      })}
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
```

---

### Phase 6: 페이지 조립 (Day 6)

#### Step 6.1: 홈페이지

**파일**: `app/page.tsx`

```typescript
import YamlUploader from '@/components/upload/YamlUploader';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          MISO Workflow Viewer
        </h1>
        <p className="text-gray-600">
          워크플로우/챗플로우 YAML 파일을 업로드하여 시각화하세요
        </p>
      </div>

      <YamlUploader />
    </main>
  );
}
```

#### Step 6.2: 뷰어 페이지

**파일**: `app/viewer/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useViewerStore } from '@/store/viewer-store';
import WorkflowViewer from '@/components/viewer/WorkflowViewer';

export default function ViewerPage() {
  const router = useRouter();
  const workflowData = useViewerStore((s) => s.workflowData);
  const clearWorkflow = useViewerStore((s) => s.clearWorkflow);

  // 데이터 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!workflowData) {
      router.push('/');
    }
  }, [workflowData, router]);

  if (!workflowData) {
    return null;
  }

  const handleBack = () => {
    clearWorkflow();
    router.push('/');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <header className="flex items-center gap-4 px-4 py-2 border-b bg-white">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold">{workflowData.app.name}</h1>
          <p className="text-xs text-gray-500">
            {workflowData.app.mode === 'workflow' ? '워크플로우' : '챗플로우'}
            {' · '}
            {workflowData.workflow.graph.nodes.length}개 노드
          </p>
        </div>
      </header>

      {/* 뷰어 */}
      <main className="flex-1 relative">
        <WorkflowViewer />
      </main>
    </div>
  );
}
```

#### Step 6.3: 루트 레이아웃

**파일**: `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MISO Workflow Viewer',
  description: 'MISO 워크플로우/챗플로우 YAML 파일 뷰어',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* remixicon 폰트 */}
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

## 6. 핵심 모듈 상세 설계

### 6.1 YAML 파서 (`lib/yaml-parser.ts`)

**역할**: YAML 문자열을 파싱하고 검증

**주요 기능**:
1. js-yaml로 YAML 파싱
2. DSL 버전 검증 (0.1.x 호환)
3. 필수 필드 검증
4. null 노드 제거
5. 기본값 설정

**참조 파일**: `reference/yaml-structure.md`

### 6.2 노드 변환기 (`lib/node-transformer.ts`)

**역할**: YAML 노드/엣지를 React Flow 포맷으로 변환

**주요 기능**:
1. 노드 위치/크기 변환
2. Iteration 자식 노드 처리 (parentId, extent)
3. z-index 설정
4. 읽기 전용 속성 설정

**참조 파일**: `reference/types-workflow.ts`

### 6.3 에이전트 Context 빌더 (`lib/agent-context.ts`)

**역할**: 에이전트에 제공할 구조화된 Context 생성

**주요 기능**:
1. 노드별 Context 빌드
2. 연결된 노드 정보 추출
3. 노드 타입별 데이터 추출

**참조 파일**: `reference/agent-context.md`

---

## 7. 컴포넌트 상세 설계

### 7.1 노드 컴포넌트 (16종)

각 노드 컴포넌트는 해당 노드 타입의 핵심 정보를 간결하게 표시합니다.

| 노드 | 표시 정보 |
|-----|----------|
| StartNode | 입력 변수 목록 |
| EndNode | 출력 변수 목록 |
| AnswerNode | 답변 템플릿 미리보기 |
| LLMNode | 모델명, 기능 뱃지 (Context/Vision/Memory) |
| KnowledgeRetrievalNode | 검색 모드, 데이터셋 수 |
| QuestionClassifierNode | 분류 클래스 목록 |
| IfElseNode | 케이스 목록 |
| CodeNode | 언어, 코드 미리보기 |
| TemplateTransformNode | 템플릿 언어 |
| HttpRequestNode | 메서드, URL |
| ToolNode | 도구명, 제공자 |
| IterationNode | 병렬 여부, 에러 처리 |
| VariableAggregatorNode | 변수 수 |
| ParameterExtractorNode | 파라미터 목록 |
| DocExtractorNode | 파일 타입 |
| VariableAssignerNode | 할당 항목 수 |

**참조 파일**: `reference/types-node.ts`, `reference/constants.ts`

---

## 8. 스타일링 가이드

### 8.1 노드 색상

```typescript
// lib/constants.ts의 NODE_ICON 참조
const nodeColors = {
  start: '#4b4e63',
  llm: '#6366f1',
  'knowledge-retrieval': '#f79009',
  answer: '#31B04D',
  'question-classifier': '#31b04d',
  'if-else': '#0ea5e9',
  iteration: '#E81995',
  code: '#3b82f6',
  // ...
};
```

### 8.2 노드 크기

- 기본 노드: `width: 300px`
- Iteration 노드: 동적 크기 (`width`, `height` 속성 사용)

### 8.3 아이콘

remixicon 폰트 사용:
```html
<span style="font-family: remixicon">&#x{코드};</span>
```

**참조 파일**: `reference/constants.ts`의 `NODE_ICON`

---

## 9. 에이전트 연동 가이드

### 9.1 Context 구조

**단일 노드 설명용**:
```typescript
interface NodeAgentContext {
  nodeId: string;
  nodeType: string;
  nodeTitle: string;
  nodeDescription: string;
  nodeData: NodeSpecificData;
  incomingNodes: Array<{ id, title, type }>;
  outgoingNodes: Array<{ id, title, type }>;
  parentIteration?: { id, title };
}
```

### 9.2 Context 사용 예시

```typescript
import { buildNodeAgentContext } from '@/lib/agent-context';

// 노드 선택 시
const context = buildNodeAgentContext(
  selectedNodeId,
  workflowData.workflow.graph.nodes,
  workflowData.workflow.graph.edges
);

// 에이전트에 전달
await sendToAgent({
  type: 'explain_node',
  context,
});
```

### 9.3 시스템 프롬프트 예시

**참조 파일**: `reference/agent-context.md`의 "에이전트 프롬프트 예시" 섹션

---

## 10. 참조 파일 활용 방법

### 10.1 타입 정의

| 참조 파일 | 사용처 | 방법 |
|----------|-------|------|
| `reference/types-workflow.ts` | `types/workflow.ts` | 복사 후 import 경로 수정 |
| `reference/types-node.ts` | `types/node.ts` | 복사 후 import 경로 수정 |

### 10.2 상수

| 참조 파일 | 사용처 | 방법 |
|----------|-------|------|
| `reference/constants.ts` | `lib/constants.ts` | 복사 후 import 경로 수정 |

### 10.3 문서

| 참조 파일 | 용도 |
|----------|------|
| `reference/yaml-structure.md` | YAML 파서 구현 시 참고 |
| `reference/agent-context.md` | 에이전트 연동 구현 시 참고 |

### 10.4 프로젝트 설정

| 참조 파일 | 사용처 |
|----------|-------|
| `project-setup/package.json` | 의존성 참고 |
| `project-setup/tailwind.config.ts` | Tailwind 설정 참고 |
| `project-setup/tsconfig.json` | TypeScript 설정 참고 |

---

## 체크리스트

### Phase 1: 프로젝트 초기화
- [ ] Next.js 프로젝트 생성
- [ ] 의존성 설치
- [ ] 타입 파일 복사
- [ ] 전역 스타일 설정

### Phase 2: 핵심 모듈
- [ ] YAML 파서 구현
- [ ] 노드 변환기 구현
- [ ] Zustand 스토어 구현

### Phase 3: UI 컴포넌트
- [ ] YamlUploader 구현
- [ ] WorkflowViewer 구현

### Phase 4: 노드 컴포넌트
- [ ] BaseNode 구현
- [ ] CustomNode 구현
- [ ] 16개 노드 타입 컴포넌트 구현

### Phase 5: 상세 패널
- [ ] NodeInfoPanel 구현
- [ ] 노드 타입별 설정 표시

### Phase 6: 페이지 조립
- [ ] 홈페이지 구현
- [ ] 뷰어 페이지 구현

### Phase 7: 마무리
- [ ] 에이전트 Context 빌더 구현
- [ ] 테스트 및 디버깅
- [ ] 샘플 YAML 파일 추가

---

## 다음 단계

이 설계서를 바탕으로:

1. **프로젝트 생성**: `npx create-next-app@latest` 실행
2. **참조 파일 복사**: `new/reference/` 파일들을 적절한 위치에 복사
3. **단계별 구현**: Phase 1부터 순차적으로 진행
4. **테스트**: 샘플 YAML 파일로 동작 확인
5. **에이전트 연동**: Context 구조를 활용하여 에이전트 연결

질문이나 구현 중 이슈가 있으면 언제든 문의하세요!
