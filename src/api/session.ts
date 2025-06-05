import api from './index';
import { ChatSession } from '../types/session';

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
