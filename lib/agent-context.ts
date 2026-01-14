/**
 * Agent Context Builder - 에이전트 설명용 Context 생성
 */

import type { WorkflowYamlDSL, GraphNode, GraphEdge } from '@/types/workflow';
import { NODE_TITLES } from './constants';

// ============================================
// Context 타입 정의
// ============================================

export interface NodeAgentContext {
  nodeId: string;
  nodeType: string;
  nodeTitle: string;
  nodeDescription: string;
  nodeData: Record<string, any>;
  incomingNodes: Array<{ id: string; title: string; type: string }>;
  outgoingNodes: Array<{ id: string; title: string; type: string }>;
  parentIteration?: { id: string; title: string };
}

export interface WorkflowAgentContext {
  appName: string;
  appMode: 'workflow' | 'advanced-chat';
  appDescription: string;
  totalNodes: number;
  nodeTypeCounts: Record<string, number>;
  entryPoint: { id: string; title: string };
  exitPoints: Array<{ id: string; title: string }>;
  environmentVariables: string[];
  conversationVariables: string[];
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

// ============================================
// Context 빌더 함수
// ============================================

/**
 * 단일 노드 Context 빌드
 */
export function buildNodeAgentContext(
  nodeId: string,
  nodes: GraphNode[],
  edges: GraphEdge[]
): NodeAgentContext {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  // 연결된 노드 찾기
  const incomingEdges = edges.filter((e) => e.target === nodeId);
  const outgoingEdges = edges.filter((e) => e.source === nodeId);

  const incomingNodes = incomingEdges.map((e) => {
    const sourceNode = nodes.find((n) => n.id === e.source);
    return {
      id: e.source,
      title: sourceNode?.data.title || NODE_TITLES[sourceNode?.data.type || ''] || '',
      type: sourceNode?.data.type || '',
    };
  });

  const outgoingNodes = outgoingEdges.map((e) => {
    const targetNode = nodes.find((n) => n.id === e.target);
    return {
      id: e.target,
      title: targetNode?.data.title || NODE_TITLES[targetNode?.data.type || ''] || '',
      type: targetNode?.data.type || '',
    };
  });

  // 부모 Iteration 찾기
  let parentIteration;
  if (node.parentId) {
    const parent = nodes.find((n) => n.id === node.parentId);
    if (parent) {
      parentIteration = {
        id: parent.id,
        title: parent.data.title || NODE_TITLES[parent.data.type] || '',
      };
    }
  }

  return {
    nodeId: node.id,
    nodeType: node.data.type,
    nodeTitle: node.data.title || NODE_TITLES[node.data.type] || '',
    nodeDescription: node.data.desc || '',
    nodeData: extractNodeSpecificData(node.data),
    incomingNodes,
    outgoingNodes,
    parentIteration,
  };
}

/**
 * 전체 워크플로우 Context 빌드
 */
export function buildWorkflowAgentContext(
  yaml: WorkflowYamlDSL
): WorkflowAgentContext {
  const { app, workflow } = yaml;
  const { nodes } = workflow.graph;

  // 노드 타입별 카운트
  const nodeTypeCounts: Record<string, number> = {};
  nodes.forEach((node) => {
    const type = node.data.type;
    nodeTypeCounts[type] = (nodeTypeCounts[type] || 0) + 1;
  });

  // 시작 노드 찾기
  const startNode = nodes.find((n) => n.data.type === 'start');
  const entryPoint = startNode
    ? { id: startNode.id, title: startNode.data.title || '시작' }
    : { id: '', title: '' };

  // 종료 노드 찾기
  const exitNodes = nodes.filter(
    (n) => n.data.type === 'end' || n.data.type === 'answer'
  );
  const exitPoints = exitNodes.map((n) => ({
    id: n.id,
    title: n.data.title || NODE_TITLES[n.data.type] || '',
  }));

  // 그래프 특성 분석
  const graphSummary = {
    hasIteration: nodes.some((n) => n.data.type === 'iteration'),
    hasConditionalBranching: nodes.some((n) => n.data.type === 'if-else'),
    usesKnowledgeRetrieval: nodes.some((n) => n.data.type === 'knowledge-retrieval'),
    usesExternalTools: nodes.some((n) => n.data.type === 'tool'),
    usesHttpRequests: nodes.some((n) => n.data.type === 'http-request'),
    usesCodeExecution: nodes.some((n) => n.data.type === 'code'),
    hasMemory: nodes.some(
      (n) => n.data.type === 'llm' && (n.data as any).memory?.window?.enabled
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
    environmentVariables: workflow.environment_variables.map((v) => v.name),
    conversationVariables: workflow.conversation_variables.map((v) => v.name),
    graphSummary,
  };
}

/**
 * 노드 타입별 데이터 추출
 */
function extractNodeSpecificData(data: any): Record<string, any> {
  const result: Record<string, any> = {};

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
    case 'start':
      result.variables = data.variables;
      break;
    case 'end':
      result.outputs = data.outputs;
      break;
    case 'answer':
      result.answer = data.answer;
      break;
  }

  return result;
}
