import api from './index';
import { ChatSession } from '../types/session';
import { Message } from '../types/chat';

export interface FetchSessionParams {
  cursorAt?: string;
  cursorId?: string;
  size?: number;
}

// 실제 백엔드 응답 구조에 맞춘 타입
interface RawFetchSessionResponse {
  result: {
    details: ChatSession[];
    hasNext: boolean;
    nextCreatedAt: string | null;
    nextMessageId: string | null;
  };
  isSuccess: boolean;
  code: string;
  message: string;
}

// 프론트엔드에서 사용하기 위한 변환된 구조
export interface FetchSessionResponse {
  sessions: ChatSession[];
  hasNext: boolean;
}

export const fetchSessions = async (params: FetchSessionParams = { size: 15 }): Promise<FetchSessionResponse> => {
  const response = await api.get<RawFetchSessionResponse>('/sessions', {
    params,
    withCredentials: true,
  });

  const details = response.data.result?.details ?? [];
  const hasNext = response.data.result?.hasNext ?? false;

  return {
    sessions: details,
    hasNext,
  };
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await api.post(`/sessions/delete/${sessionId}`);
};

export interface FetchSessionMessageResponse {
  sessionId: string;
  sessionTitle: string;
  createdAt: string;
  messages: Message[];
  hasNext: boolean;
  nextMessageId?: string; // 추가: 다음 메시지 ID
}

export const fetchSessionMessages = async (
  sessionId: string,
  cursor?: string,
  size: number = 10
): Promise<FetchSessionMessageResponse> => {
  const response = await api.get(`/sessions/${sessionId}`, {
    params: { cursor, size },
    withCredentials: true,
  });

  const data = response.data.result;

  const cleanedMessages = (data.messages ?? []).map((msg: Message) => {
    let cleanedAnswer = msg.answer;

    try {
      const parsed = JSON.parse(cleanedAnswer);
      if (parsed?.response && typeof parsed.response === 'string') {
        cleanedAnswer = parsed.response;
      }
    } catch (e) {
      // 파싱 실패하면 그대로 둠
    }

    return { ...msg, answer: cleanedAnswer };
  });

  return {
    sessionId: data.sessionId,
    sessionTitle: data.sessionTitle,
    createdAt: data.createdAt,
    messages: cleanedMessages,
    hasNext: data.hasNext ?? false,
    nextMessageId: data.nextMessageId ?? null,
  };
};
