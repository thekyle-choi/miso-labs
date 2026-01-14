# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MISO Workflow YAML Viewer - a Next.js application for visualizing MISO workflow/chatflow YAML files. This is a **read-only viewer** (no editing capabilities), designed for internal tools/demos.

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
npm run type-check   # TypeScript type checking (tsc --noEmit)
```

## Architecture

**Data flow**: `YAML Upload → js-yaml Parser → React Flow Transform → Zustand Store → Canvas + Detail Panel`

### Key Files

| File | Purpose |
|------|---------|
| `lib/yaml-parser.ts` | YAML parsing with DSL version validation (0.1.x only) |
| `lib/node-transformer.ts` | Converts YAML nodes/edges to React Flow format |
| `store/viewer-store.ts` | Zustand store with Immer middleware |
| `components/workflow/nodes/_base/CustomNode.tsx` | Routes to 16 node-type components via `NodeComponentMap` |
| `components/workflow/nodes/_base/BaseNode.tsx` | Shared node wrapper (icon, title, handles) |

### Component Hierarchy

```
app/viewer/page.tsx
└── WorkflowViewer.tsx (React Flow canvas)
    ├── CustomNode → BaseNode → [StartNode|LLMNode|IfElseNode|...]
    ├── CustomEdge
    └── NodeInfoPanel/ (right-side detail panel)
```

### State Management (Zustand)

```typescript
// store/viewer-store.ts exports:
useViewerStore()      // Main store hook
useWorkflowData()     // WorkflowYamlDSL | null
useNodes()            // ReactFlowNode[]
useSelectedNode()     // GraphNode | null
useIsPanelOpen()      // boolean
```

### Iteration Node Handling

- Child nodes have `parentId` pointing to iteration node
- Transform sets `extent: "parent"` to contain children within iteration bounds
- z-index layering: iteration=1, children=1002

## 16 Node Types

All defined in `types/workflow.ts` as `BlockEnum`:
- `start`, `end`, `answer`, `llm`, `knowledge-retrieval`, `question-classifier`
- `if-else`, `code`, `template-transform`, `http-request`, `tool`, `iteration`
- `variable-aggregator`, `parameter-extractor`, `document-extractor`, `assigner`

Each node type has a corresponding component in `components/workflow/nodes/types/`.

## Variable Reference Syntax

In YAML DSL, variables use double curly braces:
- System: `{{#sys.query#}}`, `{{#sys.conversation#}}`
- Node outputs: `{{#nodeId.variableName#}}`

## Reference Materials

- `reference/types-workflow.ts` - Core type definitions (source of truth)
- `reference/yaml-structure.md` - YAML DSL v0.1.x specification
- `reference/agent-context.md` - AI agent context building patterns
- `IMPLEMENTATION_GUIDE.md` - Detailed implementation guide (Korean)
