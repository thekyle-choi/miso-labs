/**
 * Node Transformer - YAML 노드를 React Flow 포맷으로 변환
 */

import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';
import type { WorkflowYamlDSL, GraphNode, GraphEdge } from '@/types/workflow';
import { BlockEnum } from '@/types/workflow';
import {
  CUSTOM_NODE,
  CUSTOM_EDGE,
  CUSTOM_LOOP_START_NODE,
  CUSTOM_ITERATION_START_NODE,
  ITERATION_NODE_Z_INDEX,
  ITERATION_CHILDREN_Z_INDEX
} from './constants';

export interface TransformResult {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  viewport: { x: number; y: number; zoom: number };
}

/**
 * 워크플로우 데이터를 React Flow 포맷으로 변환
 */
export function transformWorkflowToReactFlow(
  workflow: WorkflowYamlDSL
): TransformResult {
  const { graph } = workflow.workflow;

  const nodes = transformNodes(graph.nodes);
  const edges = transformEdges(graph.edges);
  const viewport = graph.viewport || { x: 0, y: 0, zoom: 1 };

  return { nodes, edges, viewport };
}

/**
 * Iteration/Loop 타입인지 확인 (loop는 iteration의 alias)
 */
function isIterationType(type: string): boolean {
  return type === BlockEnum.Iteration || type === BlockEnum.Loop;
}

/**
 * React Flow 노드 타입 결정
 * YAML의 type 필드를 기반으로 적절한 React Flow 노드 타입 반환
 */
function getReactFlowNodeType(yamlType: string, dataType: string): string {
  // YAML에 custom-loop-start 또는 custom-iteration-start가 지정된 경우 유지
  if (yamlType === CUSTOM_LOOP_START_NODE || yamlType === CUSTOM_ITERATION_START_NODE) {
    return yamlType;
  }
  // 그 외에는 기본 custom 노드 사용
  return CUSTOM_NODE;
}

/**
 * YAML 노드를 React Flow 노드로 변환
 */
function transformNodes(yamlNodes: GraphNode[]): ReactFlowNode[] {
  return yamlNodes.map((node) => {
    const dataType = node.data.type as string;
    const isIteration = isIterationType(dataType);
    const isIterationChild = !!node.parentId;

    // React Flow 노드 타입 결정
    const reactFlowType = getReactFlowNodeType(node.type, dataType);

    // Iteration/Loop 노드 크기 가져오기
    let nodeWidth: number | undefined;
    let nodeHeight: number | undefined;

    if (isIteration) {
      nodeWidth = node.width || node.data.width || 600;
      nodeHeight = node.height || node.data.height || 400;
    }

    return {
      id: node.id,
      type: reactFlowType,
      position: node.position,
      data: {
        ...node.data,
        title: node.data.title || '',
        desc: node.data.desc || '',
      },
      // Iteration 내부 노드 처리
      parentId: node.parentId,
      extent: isIterationChild ? 'parent' as const : undefined,
      // Iteration 노드 크기
      width: nodeWidth,
      height: nodeHeight,
      // z-index
      zIndex: isIterationChild
        ? ITERATION_CHILDREN_Z_INDEX
        : isIteration
        ? ITERATION_NODE_Z_INDEX
        : undefined,
      // 읽기 전용
      draggable: false,
      selectable: true,
      connectable: false,
    };
  });
}

/**
 * YAML 엣지를 React Flow 엣지로 변환
 */
function transformEdges(yamlEdges: GraphEdge[]): ReactFlowEdge[] {
  return yamlEdges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle || 'source',
    targetHandle: edge.targetHandle || 'target',
    type: CUSTOM_EDGE,
    data: {
      sourceType: edge.data?.sourceType,
      targetType: edge.data?.targetType,
    },
    // 읽기 전용
    deletable: false,
    updatable: false,
  }));
}

/**
 * 노드 ID로 노드 찾기
 */
export function findNodeById(
  nodes: GraphNode[],
  nodeId: string
): GraphNode | undefined {
  return nodes.find((node) => node.id === nodeId);
}

/**
 * 연결된 노드 찾기
 */
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

/**
 * Iteration 노드의 자식 노드 찾기
 */
export function findIterationChildren(
  iterationId: string,
  nodes: GraphNode[]
): GraphNode[] {
  return nodes.filter((node) => node.parentId === iterationId);
}
