'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type OnSelectionChangeParams,
  type NodeTypes,
  type EdgeTypes,
  ConnectionLineType,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useViewerStore } from '@/store/viewer-store';
import { CustomNode } from '@/components/workflow/nodes/_base/CustomNode';
import { CustomEdge } from '@/components/workflow/nodes/_base/CustomEdge';
import { CUSTOM_NODE, CUSTOM_EDGE, CUSTOM_LOOP_START_NODE, CUSTOM_ITERATION_START_NODE } from '@/lib/constants';
import { nodeColors } from '@/components/design-system/tokens/colors';
import { BlockEnum } from '@/types/workflow';

// 노드 타입 등록
const nodeTypes: NodeTypes = {
  [CUSTOM_NODE]: CustomNode,
  [CUSTOM_LOOP_START_NODE]: CustomNode,
  [CUSTOM_ITERATION_START_NODE]: CustomNode,
};

// 엣지 타입 등록
const edgeTypes: EdgeTypes = {
  [CUSTOM_EDGE]: CustomEdge,
};

// 미니맵 노드 색상
function getMiniMapNodeColor(node: { data?: { type?: string } }): string {
  const nodeType = node.data?.type as keyof typeof nodeColors | undefined;
  if (nodeType && nodeColors[nodeType]) {
    return nodeColors[nodeType].bg;
  }
  return '#e5e5e5';
}

interface WorkflowViewerProps {
  className?: string;
}

export function WorkflowViewer({ className }: WorkflowViewerProps) {
  const {
    nodes: initialNodes,
    edges: initialEdges,
    viewport,
    workflowData,
    selectNode,
    selectedNodeId,
  } = useViewerStore();

  // React Flow 상태
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 워크플로우 정보
  const workflowInfo = useMemo(() => {
    if (!workflowData) return null;
    return {
      name: workflowData.workflow.name || '이름 없음',
      description: workflowData.workflow.description || '',
      mode: workflowData.app?.mode || 'workflow',
    };
  }, [workflowData]);

  // 노드 선택 핸들러
  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      if (selectedNodes.length === 1) {
        selectNode(selectedNodes[0].id);
      } else if (selectedNodes.length === 0) {
        selectNode(null);
      }
    },
    [selectNode]
  );

  // 노드 클릭 핸들러
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  // 배경 클릭 (노드 선택 해제)
  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  // 워크플로우 데이터 변경 시 노드/엣지 업데이트
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (!workflowData) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-muted-foreground">
          워크플로우를 불러와주세요
        </p>
      </div>
    );
  }

  return (
    <div className={`h-full ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={handleSelectionChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultViewport={viewport}
        connectionLineType={ConnectionLineType.Bezier}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1.5,
        }}
        minZoom={0.1}
        maxZoom={2}
        // 읽기 전용 설정
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        // 스타일
        className="bg-gray-100"
      >
        {/* 배경 점 패턴 */}
        <Background
          variant={BackgroundVariant.Dots}
          color="#d4d4d4"
          gap={12}
          size={1}
        />

        {/* 줌/팬 컨트롤 */}
        <Controls
          showInteractive={false}
          position="bottom-left"
        />

        {/* 미니맵 */}
        <MiniMap
          nodeColor={getMiniMapNodeColor}
          maskColor="rgba(0, 0, 0, 0.1)"
          position="bottom-right"
          pannable
          zoomable
        />

        {/* 선택된 노드 표시 */}
        {selectedNodeId && (
          <Panel position="top-right" className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border px-3 py-2 m-2">
            <p className="text-xs text-muted-foreground">
              선택됨: <span className="font-mono">{selectedNodeId.slice(0, 8)}...</span>
            </p>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
