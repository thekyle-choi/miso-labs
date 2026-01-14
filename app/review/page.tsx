'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AppHeader } from '@/components/layout';
import { cn } from '@/lib/utils';
import { parseWorkflowFile } from '@/lib/yaml-parser';
import { useViewerStore } from '@/store/viewer-store';
import { sendChatMessage } from '@/lib/miso-api';

import { useSmoothStream } from '@/hooks/use-smooth-stream';

type PageState = 'upload' | 'analyzing' | 'result';

export default function ReviewPage() {
  const router = useRouter();
  const setWorkflowData = useViewerStore((s) => s.setWorkflowData);

  const [pageState, setPageState] = useState<PageState>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [appDescription, setAppDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState('');
  const [conversationId, setConversationId] = useState<string>();
  const [isStreaming, setIsStreaming] = useState(false);

  // 부드러운 스트리밍 효과 적용
  const displayedResult = useSmoothStream(evaluationResult);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
        setUploadedFile(file);
        setError(null);
      } else {
        setError('.yaml 또는 .yml 파일만 가능합니다.');
      }
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setError(null);
    }
  }, []);

  // 파일 업로드 시 자동으로 분석 시작
  useEffect(() => {
    if (uploadedFile && pageState === 'upload') {
      handleAnalyze();
    }
  }, [uploadedFile]);

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setPageState('analyzing');
    setError(null);
    setEvaluationResult('');
    setIsStreaming(true);

    try {
      // 1. YAML 파일 파싱
      const result = await parseWorkflowFile(uploadedFile);

      if (!result.success) {
        setError(result.error || '파일 파싱 실패');
        setPageState('upload');
        return;
      }

      if (!result.data) {
        setError('워크플로우 데이터를 읽을 수 없습니다.');
        setPageState('upload');
        return;
      }

      // 2. Viewer store에 저장 (나중에 뷰어에서 사용)
      setWorkflowData({
        ...result.data,
        metadata: { description: appDescription }
      } as any);

      // 3. YAML을 문자열로 변환
      const yamlContent = await uploadedFile.text();

      // 4. MISO API로 평가 요청
      const evaluationQuery = appDescription
        ? `다음은 "${appDescription}"를 위한 MISO 워크플로우입니다. 이 워크플로우를 전문가의 관점에서 평가해주세요. 구조의 적절성, 노드 구성의 효율성, 개선 가능한 부분 등을 포함해서 자세히 분석해주세요.`
        : `다음은 MISO 워크플로우입니다. 이 워크플로우를 전문가의 관점에서 평가해주세요. 구조의 적절성, 노드 구성의 효율성, 개선 가능한 부분 등을 포함해서 자세히 분석해주세요.`;

      let isFirstChunk = true;

      await sendChatMessage(
        {
          inputs: {
            yaml: yamlContent,
            type: 'review'
          },
          query: evaluationQuery,
          mode: 'streaming',
          conversation_id: '',
          user: 'workflow-reviewer',
        },
        (content) => {
          if (isFirstChunk) {
            setPageState('result');
            isFirstChunk = false;
          }
          setEvaluationResult(content);
        },
        (errorMsg) => {
          setError(errorMsg);
          setPageState('upload');
          setIsStreaming(false);
        },
        (convId) => {
          setConversationId(convId);
          setPageState('result');
          setIsStreaming(false);
        }
      );
    } catch (e: any) {
      setError(`파일 처리 중 오류 발생: ${e.message}`);
      setPageState('upload');
      setIsStreaming(false);
    }
  };

  const handleReset = () => {
    setPageState('upload');
    setUploadedFile(null);
    setAppDescription('');
    setEvaluationResult('');
    setError(null);
    setIsStreaming(false);
  };

  const handleViewWorkflow = () => {
    router.push('/review/viewer');
  };

  // Upload screen
  if (pageState === 'upload') {
    return (
      <div className="h-screen flex flex-col bg-white">
        <AppHeader />

        <div className="flex-1 flex items-center overflow-hidden">
          <div className="w-full max-w-6xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Description */}
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <span className="text-xs font-semibold text-gray-600">STEP 1 (선택사항)</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    이 앱은 무엇을 하나요?
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    앱이 어떤 일을 하는지 간단하게 설명해주시면 더 정확한 분석이 가능해요
                  </p>
                </div>

                <textarea
                  value={appDescription}
                  onChange={(e) => setAppDescription(e.target.value)}
                  placeholder="예시: 고객 문의를 자동으로 분류하고 답변을 생성하는 AI 챗봇이에요."
                  className="w-full h-64 p-5 text-sm rounded-2xl border-2 border-gray-200 focus:border-gray-900 focus:outline-none resize-none transition-all placeholder:text-gray-400"
                  autoFocus
                />
              </div>

              {/* Right: File Upload */}
              <div className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                    <span className="text-xs font-semibold text-gray-600">STEP 2</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    분석할 MISO 앱 파일
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    파일을 선택하면 자동으로 분석이 시작됩니다
                  </p>
                </div>

                <label
                  className={cn(
                    'block w-full h-64 rounded-2xl border-2 transition-all cursor-pointer',
                    'flex flex-col items-center justify-center',
                    isDragOver && 'border-gray-900 bg-gray-50',
                    !isDragOver && 'border-gray-200 hover:border-gray-300'
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <div className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all',
                      isDragOver ? 'bg-gray-900 scale-110' : 'bg-gray-100'
                    )}>
                      <span className={cn(
                        'material-symbols-outlined text-2xl transition-colors',
                        isDragOver ? 'text-white' : 'text-gray-400'
                      )}>
                        upload_file
                      </span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 mb-2">
                      {isDragOver ? '여기에 놓으세요' : '파일을 드래그하거나 클릭하세요'}
                    </p>
                    <p className="text-xs text-gray-400">.yml 또는 .yaml 파일</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".yaml,.yml"
                    onChange={handleFileInput}
                  />
                </label>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 rounded-2xl bg-red-50 border border-red-200 max-w-2xl mx-auto animate-fade-in">
                <p className="text-sm text-red-600 text-center font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Analyzing screen
  if (pageState === 'analyzing') {
    return (
      <div className="h-screen flex flex-col bg-white">
        <AppHeader />

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-gray-900 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-gray-900">restaurant</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">워크플로우 분석 중...</h1>
              <p className="text-gray-500">전문가가 당신의 앱을 평가하고 있습니다</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result screen (흑백요리사 컨셉)
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <AppHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          {/* File Info Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-white">restaurant</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">전문가 평가 결과</h1>
                <p className="text-sm text-gray-500">MISO 워크플로우 분석</p>
              </div>
            </div>

            {uploadedFile && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-600">description</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{uploadedFile.name}</p>
                    {appDescription && (
                      <p className="text-xs text-gray-500 mt-1">{appDescription}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Evaluation Result */}
          <div className="p-6 rounded-2xl bg-white border-2 border-gray-200">
            <div className="prose prose-gray max-w-none">
              {displayedResult ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-gray-900 mt-4 mb-3 first:mt-0" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-gray-900 mt-4 mb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-gray-900 mt-3 mb-2" {...props} />,
                    p: ({ node, ...props }) => <p className="text-sm text-gray-800 leading-relaxed mb-3" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mb-3 text-sm text-gray-800" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-sm text-gray-800" {...props} />,
                    li: ({ node, ...props }) => <li className="text-sm text-gray-800" {...props} />,
                    code: ({ node, inline, ...props }: any) =>
                      inline ? (
                        <code className="inline px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 text-xs font-mono align-baseline" {...props} />
                      ) : (
                        <code className="block w-fit min-w-[24px] p-3 rounded-lg bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto mb-3" {...props} />
                      ),
                    pre: ({ node, ...props }) => <pre className="mb-3" {...props} />,
                    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-700 text-sm mb-3" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    hr: ({ node, ...props }) => <hr className="my-4 border-gray-200" {...props} />,
                    a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-700 underline text-sm" {...props} />,
                    table: ({ node, ...props }) => <table className="min-w-full border border-gray-200 mb-3 text-sm" {...props} />,
                    th: ({ node, ...props }) => <th className="border border-gray-200 px-3 py-2 bg-gray-50 font-semibold text-left text-sm" {...props} />,
                    td: ({ node, ...props }) => <td className="border border-gray-200 px-3 py-2 text-sm" {...props} />,
                  }}
                >
                  {displayedResult + (isStreaming || displayedResult.length < evaluationResult.length ? ' ▍' : '')}
                </ReactMarkdown>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="animate-pulse">분석 내용을 작성중입니다...</span>
                  <span className="w-2 h-4 bg-gray-400 animate-pulse"></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-100 p-6 bg-white">
        <div className="max-w-5xl mx-auto flex gap-4">
          <button
            onClick={handleViewWorkflow}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-all font-semibold shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">account_tree</span>
            워크플로우 보기
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-4 rounded-2xl bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors font-semibold"
          >
            다른 앱 분석
          </button>
        </div>
      </div>
    </div>
  );
}
