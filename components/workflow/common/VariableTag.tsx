'use client';

import { useViewerStore } from '@/store/viewer-store';
import { BlockEnum } from '@/types/workflow';

/**
 * 변수 참조 파싱 및 표시 컴포넌트
 * {{#nodeId.variableName#}} 형식을 파싱하여 태그로 표시
 */

// 시스템 변수 확인
function isSystemVar(value: string[]): boolean {
  return value[0] === 'sys' || value[0] === 'system';
}

// 환경 변수 확인
function isENV(value: string[]): boolean {
  return value[0] === 'env';
}

// 대화 변수 확인
function isConversationVar(value: string[]): boolean {
  return value[0] === 'conversation';
}

interface VariableTagProps {
  value: string;
  className?: string;
}

/**
 * 변수 참조를 파싱하여 태그로 표시 (MISO 스타일)
 */
export function VariableTag({ value, className }: VariableTagProps) {
  const { nodes } = useViewerStore();
  const VAR_PLACEHOLDER = '@#!@#!';

  // 노드 ID로 노드 정보 가져오기
  const getNodeById = (nodeId: string) => {
    return nodes.find((n) => n.id === nodeId);
  };

  // 시작 노드 찾기
  const startNode = nodes.find((n) => n.data?.type === BlockEnum.Start);

  // 변수 파싱
  const vars: string[] = [];
  const strWithVarPlaceholder = value.toString().replaceAll(/{{#([^#]*)#}}/g, (_match, p1) => {
    vars.push(p1);
    return VAR_PLACEHOLDER;
  });

  const parts = strWithVarPlaceholder.split(VAR_PLACEHOLDER);

  const elements = parts.map((str, index) => {
    if (!vars[index]) {
      return str ? <span key={index}>{str}</span> : null;
    }

    const varParts = vars[index].split('.');
    const isSystem = isSystemVar(varParts);
    const isEnv = isENV(varParts);
    const isChatVar = isConversationVar(varParts);

    // 노드 정보 가져오기
    const node = isSystem ? startNode : getNodeById(varParts[0]);
    const nodeData = node?.data as Record<string, any> | undefined;
    const nodeTitle = nodeData?.title || nodeData?.type || varParts[0].slice(0, 8);

    // 변수 이름
    const varName = isSystem
      ? `sys.${varParts[varParts.length - 1]}`
      : isEnv
        ? `env.${varParts[varParts.length - 1]}`
        : isChatVar
          ? `conversation.${varParts[varParts.length - 1]}`
          : varParts[varParts.length - 1];

    return (
      <span key={index}>
        {str && <span>{str}</span>}

        <span className="chip-items">
          {/* 노드 태그 (일반 노드 변수만) */}
          {!isEnv && !isChatVar && !isSystem && nodeTitle && (
            <i className="chip-item chip-n">{nodeTitle}</i>
          )}

          {/* 일반 변수 태그 */}
          {!isEnv && !isChatVar && !isSystem && (
            <i className="chip-item chip-v">{varName}</i>
          )}

          {/* 시스템 변수 태그 */}
          {isSystem && (
            <i className="chip-item chip-s">{varName}</i>
          )}

          {/* 환경 변수 태그 */}
          {isEnv && (
            <i className="chip-item chip-e">{`환경 변수/${varName}`}</i>
          )}

          {/* 대화 변수 태그 */}
          {isChatVar && (
            <i className="chip-item chip-c">{`대화 변수/${varName}`}</i>
          )}
        </span>
      </span>
    );
  });

  return <span className={className}>{elements}</span>;
}

/**
 * 변수 참조가 있는지 확인
 */
export function hasVariableRef(value: string): boolean {
  return /{{#([^#]*)#}}/.test(value);
}
