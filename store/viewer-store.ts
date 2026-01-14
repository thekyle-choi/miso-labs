/**
 * Viewer Store - Zustand 전역 상태 관리
 */

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
  closePanel: () => void;
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
        state.error = null;
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

    closePanel: () => {
      set((state) => {
        state.isPanelOpen = false;
        state.selectedNodeId = null;
        state.selectedNode = null;
      });
    },
  }))
);

// 셀렉터 훅
export const useWorkflowData = () => useViewerStore((s) => s.workflowData);
export const useNodes = () => useViewerStore((s) => s.nodes);
export const useEdges = () => useViewerStore((s) => s.edges);
export const useViewport = () => useViewerStore((s) => s.viewport);
export const useSelectedNode = () => useViewerStore((s) => s.selectedNode);
export const useSelectedNodeId = () => useViewerStore((s) => s.selectedNodeId);
export const useIsPanelOpen = () => useViewerStore((s) => s.isPanelOpen);
export const useIsLoading = () => useViewerStore((s) => s.isLoading);
export const useError = () => useViewerStore((s) => s.error);
