/**
 * Mock Data - 프로젝트 목업 데이터
 */

import type { WorkflowYamlDSL, BlockEnum } from '@/types/workflow';

// Mock 프로젝트 인터페이스
export interface MockProject {
  id: string;
  name: string;
  description: string;
  mode: 'workflow' | 'chatflow';
  icon: string;
  iconBackground: string;
  nodeCount: number;
  lastModified: string;
  tags: string[];
}

// 샘플 프로젝트 데이터
export const mockProjects: MockProject[] = [
  {
    id: 'proj-001',
    name: 'Customer Support Bot',
    description: 'AI-powered customer support workflow with intent classification and knowledge retrieval',
    mode: 'chatflow',
    icon: '🤖',
    iconBackground: '#FFEAD5',
    nodeCount: 12,
    lastModified: '2025-01-10T10:30:00Z',
    tags: ['support', 'llm', 'classification'],
  },
  {
    id: 'proj-002',
    name: 'Document Analyzer',
    description: 'Extract and process information from uploaded documents',
    mode: 'workflow',
    icon: '📄',
    iconBackground: '#E0F2FE',
    nodeCount: 8,
    lastModified: '2025-01-09T14:20:00Z',
    tags: ['documents', 'extraction', 'llm'],
  },
  {
    id: 'proj-003',
    name: 'Sales Lead Qualifier',
    description: 'Automated lead scoring and qualification pipeline',
    mode: 'workflow',
    icon: '💼',
    iconBackground: '#DCFCE7',
    nodeCount: 15,
    lastModified: '2025-01-08T09:15:00Z',
    tags: ['sales', 'automation', 'scoring'],
  },
  {
    id: 'proj-004',
    name: 'Content Generator',
    description: 'Multi-step content generation with approval workflow',
    mode: 'workflow',
    icon: '✍️',
    iconBackground: '#FEF3C7',
    nodeCount: 10,
    lastModified: '2025-01-07T16:45:00Z',
    tags: ['content', 'generation', 'approval'],
  },
  {
    id: 'proj-005',
    name: 'FAQ Chatbot',
    description: 'Knowledge-based FAQ assistant with dynamic retrieval',
    mode: 'chatflow',
    icon: '💬',
    iconBackground: '#FCE7F3',
    nodeCount: 6,
    lastModified: '2025-01-06T11:30:00Z',
    tags: ['faq', 'knowledge', 'chat'],
  },
];

// 프로젝트 검색 함수
export function searchProjects(query: string): MockProject[] {
  if (!query.trim()) {
    return mockProjects;
  }

  const lowerQuery = query.toLowerCase();
  return mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery) ||
      project.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

// 뷰어용 Mock WorkflowYamlDSL 생성
export function generateMockWorkflowData(project: MockProject): WorkflowYamlDSL {
  return {
    version: '0.1.0',
    kind: 'app',
    app: {
      name: project.name,
      mode: project.mode === 'chatflow' ? 'advanced-chat' : 'workflow',
      icon: project.icon,
      icon_background: project.iconBackground,
      description: project.description,
      use_icon_as_answer_icon: false,
    },
    workflow: {
      name: project.name,
      description: project.description,
      graph: {
        nodes: [
          {
            id: 'start-node',
            type: 'CUSTOM_NODE',
            position: { x: 100, y: 200 },
            data: {
              type: 'start' as BlockEnum,
              title: '시작',
              desc: 'Workflow entry point',
            },
          },
          {
            id: 'llm-node',
            type: 'CUSTOM_NODE',
            position: { x: 400, y: 200 },
            data: {
              type: 'llm' as BlockEnum,
              title: 'LLM 처리',
              desc: 'AI model processing',
            },
          },
          {
            id: 'end-node',
            type: 'CUSTOM_NODE',
            position: { x: 700, y: 200 },
            data: {
              type: 'end' as BlockEnum,
              title: '종료',
              desc: 'Workflow exit point',
            },
          },
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'start-node',
            target: 'llm-node',
            sourceHandle: 'source',
            targetHandle: 'target',
          },
          {
            id: 'edge-2',
            source: 'llm-node',
            target: 'end-node',
            sourceHandle: 'source',
            targetHandle: 'target',
          },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
      },
      features: {},
      environment_variables: [],
      conversation_variables: [],
    },
  };
}
