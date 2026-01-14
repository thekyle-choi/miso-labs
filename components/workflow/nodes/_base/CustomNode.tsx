'use client';

import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { BlockEnum } from '@/types/workflow';
import { BaseNode } from './BaseNode';

// 노드 타입별 컴포넌트 import
import { StartNode } from '../types/StartNode';
import { EndNode } from '../types/EndNode';
import { AnswerNode } from '../types/AnswerNode';
import { LLMNode } from '../types/LLMNode';
import { CodeNode } from '../types/CodeNode';
import { HttpRequestNode } from '../types/HttpRequestNode';
import { IfElseNode } from '../types/IfElseNode';
import { IterationNode } from '../types/IterationNode';
import { KnowledgeRetrievalNode } from '../types/KnowledgeRetrievalNode';
import { QuestionClassifierNode } from '../types/QuestionClassifierNode';
import { ToolNode } from '../types/ToolNode';
import { TemplateTransformNode } from '../types/TemplateTransformNode';
import { VariableAggregatorNode } from '../types/VariableAggregatorNode';
import { ParameterExtractorNode } from '../types/ParameterExtractorNode';
import { DocExtractorNode } from '../types/DocExtractorNode';
import { VariableAssignerNode } from '../types/VariableAssignerNode';

// 노드 타입별 컴포넌트 맵
const NodeComponentMap: Record<string, React.ComponentType<{ data: any }>> = {
  [BlockEnum.Start]: StartNode,
  [BlockEnum.End]: EndNode,
  [BlockEnum.Answer]: AnswerNode,
  [BlockEnum.LLM]: LLMNode,
  [BlockEnum.Code]: CodeNode,
  [BlockEnum.HttpRequest]: HttpRequestNode,
  [BlockEnum.IfElse]: IfElseNode,
  [BlockEnum.Iteration]: IterationNode,
  [BlockEnum.Loop]: IterationNode, // Loop is alias for Iteration
  [BlockEnum.KnowledgeRetrieval]: KnowledgeRetrievalNode,
  [BlockEnum.QuestionClassifier]: QuestionClassifierNode,
  [BlockEnum.Tool]: ToolNode,
  [BlockEnum.TemplateTransform]: TemplateTransformNode,
  [BlockEnum.VariableAggregator]: VariableAggregatorNode,
  [BlockEnum.ParameterExtractor]: ParameterExtractorNode,
  [BlockEnum.DocExtractor]: DocExtractorNode,
  [BlockEnum.VariableAssigner]: VariableAssignerNode,
};

// Iteration/Loop 타입인지 확인
function isIterationType(type: string): boolean {
  return type === BlockEnum.Iteration || type === BlockEnum.Loop;
}

// Iteration/Loop Start 타입인지 확인
function isIterationStartType(type: string): boolean {
  return type === BlockEnum.IterationStart || type === BlockEnum.LoopStart;
}

interface Branch {
  id: string;
  name: string;
}

/**
 * React Flow 커스텀 노드 렌더러
 * 노드 타입에 따라 적절한 컴포넌트 렌더링
 */
function CustomNodeComponent({ id, data, selected }: NodeProps) {
  const nodeType = data.type as string;
  const NodeComponent = NodeComponentMap[nodeType];
  const isIteration = isIterationType(nodeType);
  const isIterationStart = isIterationStartType(nodeType);

  // iteration-start/loop-start는 BaseNode에서 직접 처리
  if (isIterationStart) {
    return (
      <BaseNode
        id={id}
        type={nodeType}
        title=""
        selected={selected}
      />
    );
  }

  // 연결된 출력 핸들 ID 목록 (if-else, question-classifier 등에서 사용)
  const sourceHandleIds = data._connectedSourceHandleIds as string[] | undefined;

  // 분기 정보 (if-else, question-classifier 등)
  const targetBranches = data._targetBranches as Branch[] | undefined;
  const cases = data.cases as Array<{ case_id: string }> | undefined;
  const classes = data.classes as Array<{ id: string; name: string }> | undefined;

  // branches 결정: _targetBranches 또는 cases/classes에서 생성
  let branches: Branch[] | undefined = targetBranches;

  if (!branches) {
    if (nodeType === BlockEnum.IfElse && cases) {
      branches = cases.map((c, idx) => ({
        id: c.case_id,
        name: c.case_id === 'true' ? 'IF' : c.case_id === 'false' ? 'ELSE' : `CASE ${idx + 1}`,
      }));
    } else if (nodeType === BlockEnum.QuestionClassifier && classes) {
      branches = classes.map((c) => ({
        id: c.id,
        name: c.name,
      }));
    }
  }

  return (
    <BaseNode
      id={id}
      type={nodeType}
      title={data.title as string}
      selected={selected}
      isIteration={isIteration}
      width={data.width as number}
      height={data.height as number}
      sourceHandleIds={sourceHandleIds}
      branches={branches}
    >
      {NodeComponent ? (
        <NodeComponent data={data} />
      ) : (
        <div className="text-xs text-muted-foreground">
          알 수 없는 노드 타입: {nodeType}
        </div>
      )}
    </BaseNode>
  );
}

export const CustomNode = memo(CustomNodeComponent);
