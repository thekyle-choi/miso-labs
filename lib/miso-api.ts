/**
 * MISO Chat API 클라이언트
 */

export interface MisoChatRequest {
  inputs: {
    yaml: string;
    type?: string;
    [key: string]: any;
  };
  query: string;
  mode: 'streaming' | 'blocking';
  conversation_id: string;
  user: string;
  response_mode?: 'streaming' | 'blocking';
}

export interface MisoChatResponse {
  id: string;
  conversation_id: string;
  answer: string;
  agent_thoughts?: any[];
  created_at: string;
}

export interface StreamEvent {
  event: string;
  data: any;
}

/**
 * MISO Chat API 스트리밍 호출 (Next.js API 라우트를 통해)
 */
export async function sendChatMessage(
  request: MisoChatRequest,
  onChunk: (content: string) => void,
  onError: (error: string) => void,
  onComplete: (conversationId?: string) => void
): Promise<void> {
  try {
    // Next.js API 라우트로 요청
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      onError(errorData.error || `요청 실패 (${response.status})`);
      return;
    }

    // SSE 스트리밍 처리
    await processStreamingResponse(response, onChunk, onError, onComplete);
  } catch (error: any) {
    onError(`네트워크 오류가 발생했습니다: ${error.message}`);
  }
}

/**
 * 스트리밍 응답 처리
 */
async function processStreamingResponse(
  response: Response,
  onChunk: (content: string) => void,
  onError: (error: string) => void,
  onComplete: (conversationId?: string) => void
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) {
    onError('응답 스트림을 읽을 수 없습니다.');
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let conversationId: string | undefined;
  let currentAnswer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      // 마지막 불완전한 줄은 버퍼에 보관
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        if (line.startsWith('data:')) {
          try {
            const jsonStr = line.slice(5).trim();
            if (jsonStr === '[DONE]') {
              onComplete(conversationId);
              return;
            }

            const data = JSON.parse(jsonStr);

            // 디버깅용 로그
            console.log('[SSE Event]', data.event, data);

            // conversation_id 저장
            if (data.conversation_id) {
              conversationId = data.conversation_id;
            }

            // 이벤트 타입에 따른 처리
            if (data.event === 'agent_message' || data.event === 'message') {
              // answer 필드가 있으면 누적 업데이트
              if (data.answer !== undefined) {
                currentAnswer += data.answer;
                onChunk(currentAnswer);
              }
            } else if (data.event === 'message_replace') {
              // 전체 메시지 대체
              if (data.answer !== undefined) {
                currentAnswer = data.answer;
                onChunk(currentAnswer);
              }
            } else if (data.event === 'message_end') {
              // 메시지 종료 이벤트
              if (data.conversation_id) {
                conversationId = data.conversation_id;
              }
            } else if (data.event === 'error') {
              onError(data.message || '알 수 없는 오류가 발생했습니다.');
              return;
            }
          } catch (e) {
            console.error('JSON 파싱 오류:', line, e);
          }
        }
      }
    }

    onComplete(conversationId);
  } catch (error: any) {
    onError(`스트리밍 처리 중 오류가 발생했습니다: ${error.message}`);
  } finally {
    reader.releaseLock();
  }
}

/**
 * API 에러 처리
 */
function handleApiError(
  status: number,
  errorData: any,
  onError: (error: string) => void
): void {
  const errorCode = errorData.code || '';
  const errorMessage = errorData.message || errorData.detail || '';

  let userMessage = '';

  switch (status) {
    case 404:
      userMessage = '대화를 찾을 수 없습니다. 새로운 대화를 시작해주세요.';
      break;
    case 400:
      if (errorCode.includes('invalid_param')) {
        if (errorMessage.includes('Workflow not published')) {
          userMessage = '워크플로우가 발행되지 않았습니다. MISO 앱 편집화면에서 저장 버튼을 눌러주세요.';
        } else {
          userMessage = `잘못된 요청입니다: ${errorMessage}`;
        }
      } else if (errorCode.includes('app_unavailable')) {
        userMessage = '앱 설정 정보를 사용할 수 없습니다. 관리자에게 문의하세요.';
      } else if (errorCode.includes('provider_not_initialize')) {
        userMessage = '모델 인증 정보가 설정되어 있지 않습니다. 관리자에게 문의하세요.';
      } else if (errorCode.includes('provider_quota_exceeded')) {
        userMessage = '모델 호출 가능 쿼터가 부족합니다. 나중에 다시 시도해주세요.';
      } else if (errorCode.includes('model_currently_not_support')) {
        userMessage = '현재 모델을 사용할 수 없습니다. 다른 모델을 선택해주세요.';
      } else if (errorCode.includes('completion_request_error')) {
        userMessage = '텍스트 생성 요청에 실패했습니다. 다시 시도해주세요.';
      } else {
        userMessage = `요청 오류: ${errorMessage}`;
      }
      break;
    case 500:
      userMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      break;
    default:
      userMessage = `오류가 발생했습니다 (${status}): ${errorMessage}`;
  }

  onError(userMessage);
}
