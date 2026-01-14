/**
 * 샘플 워크플로우 데이터
 * MISO 실제 활용 사례 기반 워크플로우 메타데이터
 */

import type { WorkflowYamlDSL } from '@/types/workflow';
import { parseWorkflowYaml } from '@/lib/yaml-parser';

export interface WorkflowMetadata {
  id: string;
  name: string;
  description: string;
  filename: string;
  mode: 'workflow' | 'advanced-chat';
  category?: string;
}

/**
 * MISO 활용 사례 워크플로우 목록
 */
export const sampleWorkflows: Record<string, WorkflowMetadata> = {
  'trade-credit-bot': {
    id: 'trade-credit-bot',
    name: '무역신용장봇',
    description: '국제무역에서 사용되는 신용장(Letter of Credit)과 관련된 문의에 대해서 UCP600과 ISBP745에 기반하여 답변하는 워크플로우',
    filename: '[REF]무역신용장봇.yml',
    mode: 'advanced-chat',
    category: '금융/무역',
  },
  'pdf-analysis': {
    id: 'pdf-analysis',
    name: 'PDF 요약·분석',
    description: '사용자가 업로드한 PDF에 대해 항상 일정한 양식으로 분석 결과를 제공하는 워크플로우',
    filename: '[REF]PDF 요약·분석.yml',
    mode: 'workflow',
    category: '문서 처리',
  },
  'meal-nutrition': {
    id: 'meal-nutrition',
    name: '식단 영양소 분석',
    description: '식단 이미지와 메뉴명을 입력하면 식품의약품안전처 DB를 기반으로 영양소 정보를 분석하여 제공하는 워크플로우',
    filename: '[REF]식단 영양소 분석.yml',
    mode: 'workflow',
    category: '헬스케어',
  },
  'freshness-checker': {
    id: 'freshness-checker',
    name: '신선도 클레임 대응 AI',
    description: '상품 사진을 AI로 분석하여 신선도를 자동 판정하고 조치사항(폐기/할인/정상)을 제안하는 워크플로우',
    filename: '[REF]신선도 클레임 대응 AI.yml',
    mode: 'workflow',
    category: '리테일/유통',
  },
  'news-monitor': {
    id: 'news-monitor',
    name: '뉴스 모니터링 봇',
    description: '지정한 키워드의 뉴스를 수집해 요약하고 주간 리포트로 메일 발송. 코드 노드를 활용해 기간 필터링 한 버전',
    filename: '[REF]뉴스 모니터링 봇.yml',
    mode: 'workflow',
    category: '마케팅/PR',
  },
  'contract-compare': {
    id: 'contract-compare',
    name: '백투백 계약서 비교',
    description: '구매 계약서와 판매 계약서를 비교 분석하여 마진, 리스크, 조건 불일치 등을 자동으로 검증하는 워크플로우',
    filename: '[REF]백투백 계약서 비교.yml',
    mode: 'workflow',
    category: '법무/계약',
  },
  'toolbox-meeting': {
    id: 'toolbox-meeting',
    name: '툴박스 미팅 자료 생성',
    description: '산업안전보건법, 산업재해사례를 기반으로 한 Tool Box Meeting 자료 생성 워크플로우',
    filename: '[REF]툴박스 미팅 자료 생성.yml',
    mode: 'workflow',
    category: '안전/보건',
  },
  'customer-interview': {
    id: 'customer-interview',
    name: '고객 인터뷰 분석 워크플로우',
    description: '인터뷰 파일(문서/오디오)을 업로드하면 내용을 추출하고 UX 리서처 관점에서 페르소나, 핵심 인사이트, 페인포인트 등을 포함한 Actionable Insight Report를 생성',
    filename: '[REF]고객 인터뷰 분석 워크플로우.yml',
    mode: 'workflow',
    category: '마케팅/PR',
  },
  'deep-research-chatbot': {
    id: 'deep-research-chatbot',
    name: '심층 리서치 챗봇',
    description: '복잡한 리서치 질문에 대해 심층적으로 분석하고 답변하는 고급 챗봇 워크플로우',
    filename: '[REF]심층 리서치 챗봇.yml',
    mode: 'advanced-chat',
    category: '마케팅/PR',
  },
  'ev-charging-voc': {
    id: 'ev-charging-voc',
    name: '전기차 충전 VOC 데이터 정제 및 자동 분석 시스템',
    description: 'CSV 형식의 전기차 충전 관련 문의 데이터를 업로드하면 주요 키워드 추출, 유관 부서 지정, 긴급도 태깅을 자동으로 수행하여 정형화된 CSV로 출력',
    filename: '[REF]전기차 충전 VOC 데이터 정제 및 자동 분석 시스템.yml',
    mode: 'workflow',
    category: '기타',
  },
};

/**
 * ID로 워크플로우 메타데이터 조회
 */
export function getSampleWorkflow(id: string): WorkflowMetadata | null {
  return sampleWorkflows[id] || null;
}

/**
 * 모든 워크플로우 메타데이터 배열로 반환
 */
export function getAllSampleWorkflows(): WorkflowMetadata[] {
  return Object.values(sampleWorkflows);
}

/**
 * 카테고리별로 워크플로우 그룹화
 */
export function getWorkflowsByCategory(): Record<string, WorkflowMetadata[]> {
  const grouped: Record<string, WorkflowMetadata[]> = {};

  Object.values(sampleWorkflows).forEach((workflow) => {
    const category = workflow.category || '기타';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(workflow);
  });

  return grouped;
}

/**
 * YAML 파일을 로드하고 파싱하여 워크플로우 데이터 반환
 */
export async function loadSampleWorkflowData(id: string): Promise<WorkflowYamlDSL | null> {
  const metadata = getSampleWorkflow(id);
  if (!metadata) {
    return null;
  }

  try {
    const response = await fetch(`/samples/${metadata.filename}`);
    if (!response.ok) {
      console.error(`Failed to load workflow: ${metadata.filename}`);
      return null;
    }

    const yamlContent = await response.text();
    const parseResult = parseWorkflowYaml(yamlContent);

    if (!parseResult.success || !parseResult.data) {
      console.error(`Failed to parse workflow: ${parseResult.error}`);
      return null;
    }

    return parseResult.data;
  } catch (error) {
    console.error(`Error loading workflow ${id}:`, error);
    return null;
  }
}
