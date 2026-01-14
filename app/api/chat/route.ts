import { NextRequest } from 'next/server';

export const runtime = 'edge'; // Vercel Edge Runtime 사용

export async function POST(request: NextRequest) {
  const apiKey = process.env.MISO_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'MISO API Key가 설정되지 않았습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const { inputs, query, mode, conversation_id, user, response_mode } = body;

    // MISO API 호출
    const response = await fetch('https://api.holdings.miso.gs/ext/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs,
        query,
        mode: mode || 'streaming',
        conversation_id: conversation_id || '',
        user: user || 'web-viewer-user',
        response_mode: response_mode || 'streaming',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({
          error: errorData.message || '요청 실패',
          status: response.status
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 스트리밍 응답을 그대로 전달
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || '서버 오류' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
