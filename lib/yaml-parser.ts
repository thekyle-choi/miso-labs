/**
 * YAML Parser - YAML 파일 파싱 및 검증
 */

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

/**
 * YAML 문자열을 파싱하고 검증
 */
export function parseWorkflowYaml(content: string): ParseResult {
  const warnings: string[] = [];

  try {
    // 1. YAML 파싱
    const data = yaml.load(content) as any;

    if (!data || typeof data !== 'object') {
      return { success: false, error: '유효하지 않은 YAML 형식입니다.' };
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
      return { success: false, error: 'kind 필드가 "app"이어야 합니다.' };
    }

    if (!data.app || !data.app.name || !data.app.mode) {
      return { success: false, error: 'app 정보가 누락되었습니다.' };
    }

    if (!data.workflow || !data.workflow.graph) {
      return { success: false, error: 'workflow graph가 누락되었습니다.' };
    }

    // 4. 그래프 정제 (null 노드 제거 + 중복 노드 제거)
    if (data.workflow.graph.nodes) {
      // null 노드 제거
      let nodes = data.workflow.graph.nodes.filter(
        (node: any) => node !== null
      );

      // 중복 ID를 가진 노드 제거 (첫 번째 노드만 유지)
      const seenIds = new Set<string>();
      nodes = nodes.filter((node: any) => {
        if (!node.id) return false;
        if (seenIds.has(node.id)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Duplicate node ID found and removed: ${node.id}`);
          }
          return false;
        }
        seenIds.add(node.id);
        return true;
      });

      data.workflow.graph.nodes = nodes;
    }

    // 5. 엣지 정제 (중복 엣지 제거)
    if (data.workflow.graph.edges) {
      const seenEdgeIds = new Set<string>();
      data.workflow.graph.edges = data.workflow.graph.edges.filter((edge: any) => {
        if (!edge.id) return true; // ID 없으면 유지
        if (seenEdgeIds.has(edge.id)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Duplicate edge ID found and removed: ${edge.id}`);
          }
          return false;
        }
        seenEdgeIds.add(edge.id);
        return true;
      });
    }

    // 6. 기본값 설정
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
        name: data.app.name, // workflow.name도 설정
        description: data.app.description || '',
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
      error: `YAML 파싱 오류: ${e instanceof Error ? e.message : '알 수 없는 오류'}`,
    };
  }
}

/**
 * DSL 버전 검증
 */
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
      error: `지원하지 않는 메이저 버전입니다: ${major}. ${SUPPORTED_VERSION_MAJOR}.x.x 버전만 지원합니다.`,
    };
  }

  if (minor !== SUPPORTED_VERSION_MINOR) {
    return {
      valid: false,
      error: `지원하지 않는 마이너 버전입니다: ${minor}. 0.${SUPPORTED_VERSION_MINOR}.x 버전만 지원합니다.`,
    };
  }

  if (patch !== undefined && patch > 5) {
    return {
      valid: true,
      warning: `DSL 버전 ${version}은 일부 기능이 지원되지 않을 수 있습니다.`,
    };
  }

  return { valid: true };
}

/**
 * 파일에서 YAML 파싱
 */
export async function parseWorkflowFile(file: File): Promise<ParseResult> {
  try {
    const content = await file.text();
    return parseWorkflowYaml(content);
  } catch (e) {
    return {
      success: false,
      error: '파일을 읽을 수 없습니다.',
    };
  }
}
