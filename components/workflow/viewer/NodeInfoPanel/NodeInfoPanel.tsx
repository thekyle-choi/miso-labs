'use client';

import { useMemo, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useViewerStore } from '@/store/viewer-store';
import { NODE_TITLES, COMPARISON_OPERATOR_KR, LOGICAL_OPERATOR_KR } from '@/lib/constants';
import { NodeIcon } from '@/components/design-system/primitives/NodeIcon';
import { CodePreview } from '@/components/design-system/patterns/CodePreview';
import { BlockEnum } from '@/types/workflow';
import { nodeColors } from '@/components/design-system/tokens/colors';
import { VariableTag, hasVariableRef } from '@/components/workflow/common/VariableTag';
import { cn } from '@/lib/utils';

interface NodeInfoPanelProps {
  className?: string;
}

export function NodeInfoPanel({ className }: NodeInfoPanelProps) {
  const { selectedNode, isPanelOpen, closePanel } = useViewerStore();

  const nodeType = selectedNode?.data.type || '';
  const colorConfig = nodeColors[nodeType as keyof typeof nodeColors];
  const nodeColor = colorConfig ? colorConfig.bg : '#666';

  const nodeTitle = useMemo(() => {
    if (!selectedNode) return '';
    return selectedNode.data.title || NODE_TITLES[selectedNode.data.type] || '알 수 없음';
  }, [selectedNode]);

  if (!isPanelOpen || !selectedNode) {
    return null;
  }

  const { data } = selectedNode;

  return (
    <section className={`w-[360px] bg-white border-l shadow-lg flex flex-col overflow-hidden ${className}`}>
      {/* 헤더 - miso 스타일 */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <NodeIcon type={nodeType} size={20} />
          <h3 className="text-[15px] font-bold text-gray-900">{nodeTitle}</h3>
        </div>
        <button
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
          onClick={closePanel}
        >
          <i className="ri-close-line text-lg" />
        </button>
      </div>

      {/* 내용 */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="p-4 space-y-4 overflow-hidden">
          {/* 설명 */}
          {data.desc && (
            <div className="text-[13px] text-gray-600 p-3 bg-gray-50 rounded-lg">
              {data.desc}
            </div>
          )}

          {/* 노드 타입별 상세 내용 */}
          <NodeDetailContent type={data.type} data={data} />
        </div>
      </ScrollArea>
    </section>
  );
}

// ================================
// 공통 컴포넌트
// ================================

// 섹션 제목 컴포넌트
function SectionTitle({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
        {children}
      </h4>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  );
}

// 정보 행 컴포넌트 (miso 스타일)
function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0">
      <span className="text-[12px] text-gray-500 min-w-[80px] flex-shrink-0">{label}</span>
      <div className="text-[13px] text-gray-800 flex-1 break-all">{children}</div>
    </div>
  );
}

// 변수 박스 컴포넌트 (miso 스타일)
function VarBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-h-[33px] p-2 border border-gray-200 rounded-md bg-white overflow-hidden ${className || ''}`}>
      {children}
    </div>
  );
}

// 복사 버튼 컴포넌트
function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors',
        className
      )}
      title="복사"
    >
      <i className={copied ? 'ri-check-line text-green-500' : 'ri-file-copy-line'} />
    </button>
  );
}

// 접기/펼치기 가능한 텍스트 박스
function ExpandableTextBox({
  text,
  maxLines = 5,
  showCopy = true,
}: {
  text: string;
  maxLines?: number;
  showCopy?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasVariable = hasVariableRef(text);
  const isLong = text.split('\n').length > maxLines || text.length > 300;

  return (
    <div className="relative">
      {/* 복사/펼치기 버튼 */}
      <div className="absolute top-1 right-1 flex items-center gap-0.5 z-10">
        {showCopy && <CopyButton text={text} />}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            title={expanded ? '접기' : '펼치기'}
          >
            <i className={expanded ? 'ri-contract-up-down-line' : 'ri-expand-up-down-line'} />
          </button>
        )}
      </div>

      {/* 텍스트 내용 */}
      <VarBox className={cn('min-h-[40px] pr-16', expanded ? '' : 'max-h-[200px] overflow-y-auto')}>
        {hasVariable ? (
          <VariableTag value={text} className="text-[12px] text-gray-700 break-all" />
        ) : (
          <span
            className={cn(
              'text-[12px] text-gray-700 whitespace-pre-wrap break-all',
              !expanded && isLong && 'line-clamp-[8]'
            )}
          >
            {text}
          </span>
        )}
      </VarBox>
    </div>
  );
}

// 노드 타입별 상세 내용 컴포넌트
function NodeDetailContent({ type, data }: { type: string; data: any }) {
  switch (type) {
    case BlockEnum.Start:
      return <StartNodeDetail data={data} />;
    case BlockEnum.End:
      return <EndNodeDetail data={data} />;
    case BlockEnum.Answer:
      return <AnswerNodeDetail data={data} />;
    case BlockEnum.LLM:
      return <LLMNodeDetail data={data} />;
    case BlockEnum.Code:
      return <CodeNodeDetail data={data} />;
    case BlockEnum.HttpRequest:
      return <HttpRequestNodeDetail data={data} />;
    case BlockEnum.IfElse:
      return <IfElseNodeDetail data={data} />;
    case BlockEnum.Iteration:
      return <IterationNodeDetail data={data} />;
    case BlockEnum.KnowledgeRetrieval:
      return <KnowledgeRetrievalNodeDetail data={data} />;
    case BlockEnum.QuestionClassifier:
      return <QuestionClassifierNodeDetail data={data} />;
    case BlockEnum.Tool:
      return <ToolNodeDetail data={data} />;
    case BlockEnum.TemplateTransform:
      return <TemplateTransformNodeDetail data={data} />;
    case BlockEnum.VariableAggregator:
      return <VariableAggregatorNodeDetail data={data} />;
    case BlockEnum.ParameterExtractor:
      return <ParameterExtractorNodeDetail data={data} />;
    case BlockEnum.DocExtractor:
      return <DocExtractorNodeDetail data={data} />;
    case BlockEnum.VariableAssigner:
      return <VariableAssignerNodeDetail data={data} />;
    default:
      return (
        <p className="text-[13px] text-gray-500">
          이 노드 타입에 대한 상세 정보가 없습니다.
        </p>
      );
  }
}

// ================================
// 노드 타입별 상세 컴포넌트
// ================================

function StartNodeDetail({ data }: { data: any }) {
  const variables = data.variables || [];
  return (
    <div className="space-y-3">
      <SectionTitle>입력 변수</SectionTitle>
      {variables.length > 0 ? (
        <div className="space-y-2">
          {variables.map((v: any, idx: number) => (
            <VarBox key={idx}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="min-w-[14px] h-[14px] text-[10px] font-medium rounded flex items-center justify-center bg-blue-500 text-white">
                    v
                  </span>
                  <span className="text-[12px] font-semibold text-gray-800">{v.variable}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  {v.required && <span className="italic">필수</span>}
                  <span className="italic">{v.type}</span>
                </div>
              </div>
            </VarBox>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-gray-500">입력 변수 없음</p>
      )}
    </div>
  );
}

function EndNodeDetail({ data }: { data: any }) {
  const outputs = data.outputs || [];
  return (
    <div className="space-y-3">
      <SectionTitle>출력 변수</SectionTitle>
      {outputs.length > 0 ? (
        <div className="space-y-2">
          {outputs.map((o: any, idx: number) => (
            <VarBox key={idx}>
              <div className="flex items-center gap-1.5">
                <span className="min-w-[14px] h-[14px] text-[10px] font-medium rounded flex items-center justify-center bg-blue-500 text-white">
                  v
                </span>
                <span className="text-[12px] font-semibold text-gray-800">{o.variable}</span>
                {o.value_selector && (
                  <span className="text-[11px] text-gray-500 ml-2">
                    ← {o.value_selector.join('.')}
                  </span>
                )}
              </div>
            </VarBox>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-gray-500">출력 변수 없음</p>
      )}
    </div>
  );
}

function AnswerNodeDetail({ data }: { data: any }) {
  return (
    <div className="space-y-3">
      <SectionTitle>답변 템플릿</SectionTitle>
      {data.answer ? (
        <ExpandableTextBox text={data.answer} />
      ) : (
        <p className="text-[13px] text-gray-500">답변 템플릿 없음</p>
      )}
    </div>
  );
}

function LLMNodeDetail({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {/* 모델 정보 */}
      {data.model && (
        <div className="space-y-3">
          <SectionTitle>모델</SectionTitle>
          <VarBox>
            <div className="flex items-center gap-2">
              <i className="ri-brain-2-fill text-indigo-500" />
              <span className="text-[13px] font-semibold text-gray-800">{data.model.name}</span>
              <span className="text-[11px] text-gray-500">({data.model.provider})</span>
            </div>
          </VarBox>
        </div>
      )}

      {/* 기능 배지 */}
      {(data.memory?.window?.enabled || data.context?.enabled || data.vision?.enabled) && (
        <div className="flex flex-wrap gap-2">
          {data.memory?.window?.enabled && (
            <span className="px-2 py-1 text-[11px] bg-blue-50 text-blue-600 rounded">메모리</span>
          )}
          {data.context?.enabled && (
            <span className="px-2 py-1 text-[11px] bg-orange-50 text-orange-600 rounded">Context</span>
          )}
          {data.vision?.enabled && (
            <span className="px-2 py-1 text-[11px] bg-purple-50 text-purple-600 rounded">Vision</span>
          )}
        </div>
      )}

      {/* 프롬프트 - 전체 보기 및 복사 가능 */}
      {data.prompt_template && data.prompt_template.length > 0 && (
        <div className="space-y-3">
          <SectionTitle>프롬프트</SectionTitle>
          {data.prompt_template.map((p: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-gray-500 uppercase">{p.role}</span>
              </div>
              {p.text ? (
                <ExpandableTextBox text={p.text} maxLines={8} />
              ) : (
                <VarBox className="min-h-[40px]">
                  <span className="text-[12px] text-gray-400 italic">내용 없음</span>
                </VarBox>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CodeNodeDetail({ data }: { data: any }) {
  const [expanded, setExpanded] = useState(false);
  const code = data.code || '';
  const isLong = code.split('\n').length > 10 || code.length > 500;

  return (
    <div className="space-y-4">
      <InfoItem label="언어">{data.code_language || 'python3'}</InfoItem>

      {code && (
        <div className="space-y-2">
          <SectionTitle
            actions={
              <div className="flex items-center gap-0.5">
                <CopyButton text={code} />
                {isLong && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    title={expanded ? '접기' : '펼치기'}
                  >
                    <i className={expanded ? 'ri-contract-up-down-line' : 'ri-expand-up-down-line'} />
                  </button>
                )}
              </div>
            }
          >
            코드
          </SectionTitle>
          <CodePreview
            code={code}
            language={data.code_language || 'python'}
            maxHeight={expanded ? 600 : 150}
          />
        </div>
      )}

      {data.outputs && Object.keys(data.outputs).length > 0 && (
        <div className="space-y-2">
          <SectionTitle>출력</SectionTitle>
          <div className="space-y-1">
            {Object.entries(data.outputs).map(([key, val]: [string, any]) => (
              <VarBox key={key}>
                <div className="flex items-center gap-2">
                  <span className="min-w-[14px] h-[14px] text-[10px] font-medium rounded flex items-center justify-center bg-blue-500 text-white">
                    v
                  </span>
                  <span className="text-[12px] font-semibold text-gray-800">{key}</span>
                  <span className="text-[11px] text-gray-500">{val.type}</span>
                </div>
              </VarBox>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HttpRequestNodeDetail({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <VarBox>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[13px]">{data.method || 'GET'}</span>
          {data.url && (
            hasVariableRef(data.url) ? (
              <VariableTag value={data.url} className="text-[12px] text-gray-600" />
            ) : (
              <span className="text-[12px] text-gray-600 break-all">{data.url}</span>
            )
          )}
        </div>
      </VarBox>

      {data.headers && data.headers.length > 0 && (
        <div className="space-y-2">
          <SectionTitle>헤더</SectionTitle>
          <div className="space-y-1">
            {data.headers.map((h: any, idx: number) => (
              <VarBox key={idx}>
                <span className="text-[12px]">
                  <span className="font-semibold">{h.key}</span>: {h.value}
                </span>
              </VarBox>
            ))}
          </div>
        </div>
      )}

      {data.body?.data && (
        <div className="space-y-2">
          <SectionTitle
            actions={<CopyButton text={JSON.stringify(data.body.data, null, 2)} />}
          >
            바디
          </SectionTitle>
          <CodePreview code={JSON.stringify(data.body.data, null, 2)} language="json" maxHeight={200} />
        </div>
      )}
    </div>
  );
}

// IfElse 상세 - 전체 조건 표시
function IfElseNodeDetail({ data }: { data: any }) {
  const { nodes } = useViewerStore();
  const cases = data.cases || [];

  const getNodeTitle = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node?.data?.title || nodeId.slice(0, 8);
  };

  return (
    <div className="space-y-4">
      <SectionTitle>조건 분기</SectionTitle>
      {cases.length > 0 ? (
        <div className="space-y-3">
          {cases.map((caseItem: any, caseIdx: number) => {
            const isElse = caseItem.case_id === 'false';
            const isIf = caseItem.case_id === 'true' || caseIdx === 0;
            const label = isIf && !isElse ? 'IF' : isElse ? 'ELSE' : 'ELIF';

            return (
              <div
                key={caseItem.case_id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Case 헤더 */}
                <div className="flex items-center gap-2 p-2 bg-gray-50 border-b border-gray-200">
                  <span
                    className={cn(
                      'text-[11px] font-bold px-2 py-0.5 rounded',
                      isElse && 'bg-gray-200 text-gray-600',
                      isIf && !isElse && 'bg-sky-100 text-sky-600',
                      !isIf && !isElse && 'bg-sky-50 text-sky-500',
                    )}
                  >
                    {label}
                  </span>
                  {!isElse && caseItem.conditions?.length > 1 && (
                    <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded bg-white border">
                      {LOGICAL_OPERATOR_KR[caseItem.logical_operator] || caseItem.logical_operator}
                    </span>
                  )}
                </div>

                {/* 조건들 */}
                {!isElse && caseItem.conditions && caseItem.conditions.length > 0 && (
                  <div className="p-2 space-y-2">
                    {caseItem.conditions.map((condition: any, condIdx: number) => {
                      const varSelector = condition.variable_selector || [];
                      const isEnv = varSelector[0] === 'env';
                      const isSys = varSelector[0] === 'sys';
                      const nodeId = varSelector[0];
                      const varName = varSelector[varSelector.length - 1];
                      const nodeTitle = isEnv ? 'env' : isSys ? 'sys' : getNodeTitle(nodeId);

                      const operator = COMPARISON_OPERATOR_KR[condition.comparison_operator || ''] || condition.comparison_operator || '';
                      const value = Array.isArray(condition.value)
                        ? condition.value.join(', ')
                        : String(condition.value || '');

                      return (
                        <div
                          key={condIdx}
                          className="flex items-center gap-1.5 flex-wrap text-[11px] p-2 bg-white border border-gray-100 rounded overflow-hidden"
                        >
                          {/* 논리 연산자 (2번째 조건부터) */}
                          {condIdx > 0 && (
                            <span className="text-gray-400 text-[10px] font-medium flex-shrink-0">
                              {LOGICAL_OPERATOR_KR[caseItem.logical_operator] || caseItem.logical_operator}
                            </span>
                          )}

                          {/* 변수 */}
                          <span className="inline-flex items-center gap-0.5 min-w-0">
                            <span
                              className={cn(
                                'min-w-[14px] h-[14px] text-[9px] font-medium rounded flex items-center justify-center text-white flex-shrink-0',
                                isEnv ? 'bg-orange-500' : isSys ? 'bg-gray-500' : 'bg-blue-500',
                              )}
                            >
                              {isEnv ? 'e' : isSys ? 's' : 'v'}
                            </span>
                            <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                              {nodeTitle}/{varName}
                            </span>
                          </span>

                          {/* 연산자 */}
                          <span className="text-sky-600 font-medium flex-shrink-0">{operator}</span>

                          {/* 값 */}
                          {value && (
                            <span className="text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                              {value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ELSE는 조건 없음 표시 */}
                {isElse && (
                  <div className="p-2 text-[11px] text-gray-400 italic">
                    기타 모든 경우
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[13px] text-gray-500">조건 없음</p>
      )}
    </div>
  );
}

function IterationNodeDetail({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.iterator_selector && (
        <InfoItem label="반복 대상">
          <code className="text-[12px] bg-gray-100 px-1 rounded">{data.iterator_selector.join('.')}</code>
        </InfoItem>
      )}
      {data.is_parallel && (
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-[11px] bg-pink-50 text-pink-600 rounded">병렬 실행</span>
          {data.parallel_nums && (
            <span className="text-[12px] text-gray-500">최대 {data.parallel_nums}개</span>
          )}
        </div>
      )}
      {data.error_handle_mode && (
        <InfoItem label="오류 처리">{data.error_handle_mode}</InfoItem>
      )}
    </div>
  );
}

function KnowledgeRetrievalNodeDetail({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.retrieval_mode && <InfoItem label="검색 모드">{data.retrieval_mode}</InfoItem>}
      {data.multiple_retrieval_config && (
        <>
          <InfoItem label="Top K">{data.multiple_retrieval_config.top_k || '-'}</InfoItem>
          {data.multiple_retrieval_config.score_threshold_enabled && (
            <InfoItem label="점수 임계값">{data.multiple_retrieval_config.score_threshold || '-'}</InfoItem>
          )}
        </>
      )}

      {data.dataset_ids && data.dataset_ids.length > 0 && (
        <div className="space-y-2">
          <SectionTitle>데이터셋</SectionTitle>
          <div className="space-y-1">
            {data.dataset_ids.map((id: string, idx: number) => (
              <VarBox key={idx}>
                <div className="flex items-center gap-1.5">
                  <i className="ri-link-m text-gray-500" />
                  <span className="text-[12px] text-gray-700 truncate">{id}</span>
                </div>
              </VarBox>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionClassifierNodeDetail({ data }: { data: any }) {
  const classes = data.classes || [];
  return (
    <div className="space-y-4">
      {data.model && (
        <div className="space-y-3">
          <SectionTitle>모델</SectionTitle>
          <VarBox>
            <div className="flex items-center gap-2">
              <i className="ri-stack-fill text-green-500" />
              <span className="text-[13px] font-semibold text-gray-800">{data.model.name}</span>
            </div>
          </VarBox>
        </div>
      )}

      {data.instruction && (
        <div className="space-y-2">
          <SectionTitle>지시문</SectionTitle>
          <ExpandableTextBox text={data.instruction} />
        </div>
      )}

      {classes.length > 0 && (
        <div className="space-y-2">
          <SectionTitle>분류 클래스</SectionTitle>
          <div className="space-y-1">
            {classes.map((c: any, idx: number) => (
              <VarBox key={idx}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">{`의도${idx + 1}`}</span>
                  <span className="text-[12px] font-semibold text-gray-800">{c.name}</span>
                </div>
              </VarBox>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToolNodeDetail({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <InfoItem label="도구 이름">{data.tool_label || data.tool_name || '-'}</InfoItem>
      <InfoItem label="제공자">{data.provider_id || '-'}</InfoItem>
      <InfoItem label="타입">{data.provider_type || '-'}</InfoItem>

      {data.tool_parameters && Object.keys(data.tool_parameters).length > 0 && (
        <div className="space-y-2">
          <SectionTitle>파라미터</SectionTitle>
          <div className="space-y-1">
            {Object.entries(data.tool_parameters).map(([key, val]: [string, any]) => (
              <VarBox key={key}>
                <div className="text-[12px]">
                  <span className="font-semibold">{key}</span>
                  {val.value && (
                    <span className="text-gray-500 ml-2">
                      = {typeof val.value === 'string'
                        ? (hasVariableRef(val.value) ? <VariableTag value={val.value} /> : val.value.slice(0, 50))
                        : JSON.stringify(val.value).slice(0, 50)}
                    </span>
                  )}
                </div>
              </VarBox>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateTransformNodeDetail({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      {data.template && (
        <div className="space-y-2">
          <SectionTitle
            actions={<CopyButton text={data.template} />}
          >
            템플릿
          </SectionTitle>
          <CodePreview code={data.template} language="jinja2" maxHeight={200} />
        </div>
      )}
    </div>
  );
}

function VariableAggregatorNodeDetail({ data }: { data: any }) {
  const variables = data.variables || [];
  return (
    <div className="space-y-4">
      <InfoItem label="변수 수">{variables.length}개</InfoItem>
      {data.output_type && <InfoItem label="출력 타입">{data.output_type}</InfoItem>}

      {data.advanced_settings?.group_enabled && data.advanced_settings.groups && (
        <div className="space-y-2">
          <SectionTitle>그룹</SectionTitle>
          <div className="flex flex-wrap gap-1">
            {data.advanced_settings.groups.map((g: any, idx: number) => (
              <span key={idx} className="px-2 py-1 text-[11px] bg-blue-50 text-blue-600 rounded">
                {g.group_name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ParameterExtractorNodeDetail({ data }: { data: any }) {
  const parameters = data.parameters || [];
  return (
    <div className="space-y-4">
      {data.model && (
        <div className="space-y-3">
          <SectionTitle>모델</SectionTitle>
          <VarBox>
            <div className="flex items-center gap-2">
              <i className="ri-braces-line text-blue-500" />
              <span className="text-[13px] font-semibold text-gray-800">{data.model.name}</span>
            </div>
          </VarBox>
        </div>
      )}

      {data.reasoning_mode && <InfoItem label="추론 모드">{data.reasoning_mode}</InfoItem>}

      {data.instruction && (
        <div className="space-y-2">
          <SectionTitle>지시문</SectionTitle>
          <ExpandableTextBox text={data.instruction} />
        </div>
      )}

      {parameters.length > 0 && (
        <div className="space-y-2">
          <SectionTitle>파라미터</SectionTitle>
          <div className="space-y-2">
            {parameters.map((p: any, idx: number) => (
              <VarBox key={idx}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[12px] font-semibold text-gray-800">{p.name}</span>
                  <span className="text-[11px] text-gray-500">{p.type}</span>
                  {p.required && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-red-50 text-red-600 rounded">필수</span>
                  )}
                </div>
                {p.description && (
                  <p className="text-[11px] text-gray-500 mt-1">{p.description}</p>
                )}
              </VarBox>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DocExtractorNodeDetail({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <InfoItem label="파일 타입">{data.is_array_file ? '다중 파일' : '단일 파일'}</InfoItem>
      {data.variable_selector && (
        <InfoItem label="변수 선택자">
          <code className="text-[12px] bg-gray-100 px-1 rounded">{data.variable_selector.join('.')}</code>
        </InfoItem>
      )}
    </div>
  );
}

function VariableAssignerNodeDetail({ data }: { data: any }) {
  const items = data.items || [];
  const operationLabels: Record<string, string> = {
    'over-write': '덮어쓰기',
    'set': '설정',
    'clear': '초기화',
  };

  return (
    <div className="space-y-4">
      <InfoItem label="할당 항목">{items.length}개</InfoItem>

      {items.length > 0 && (
        <div className="space-y-2">
          <SectionTitle>항목 목록</SectionTitle>
          <div className="space-y-2">
            {items.map((item: any, idx: number) => (
              <VarBox key={idx}>
                <div className="space-y-1">
                  <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">
                    {operationLabels[item.operation] || item.operation}
                  </span>
                  {item.variable_selector && (
                    <div className="text-[12px] text-gray-600">
                      <code>{item.variable_selector.join('.')}</code>
                    </div>
                  )}
                </div>
              </VarBox>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
