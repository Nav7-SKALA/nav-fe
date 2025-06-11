import api from './index';
import { RoleModel } from '../types/roleModel';
import { Message } from '../types/chat';

export interface SendChatMessageResponse {
  sessionId: string;
  answer: string;
}
export const sendInitChatMessage = async (question: string): Promise<{ sessionId: string }> => {
  try {
    const response = await api.post(
      `/sessions`,
      { question },
      {
        withCredentials: true,
      }
    );
    const data = response.data;

    if (data?.isSuccess && data?.result?.sessionId && typeof data.result.sessionId === 'string') {
      return { sessionId: data.result.sessionId };
    } else {
      throw new Error('응답 형식이 올바르지 않습니다.');
    }
  } catch (error) {
    console.error('메시지 전송 실패:', error);
    throw error;
  }
};

export const sendChatMessageStreaming = async (
  sessionId: string,
  question: string,
  messageId?: number
): Promise<Message> => {
  try {
    const response = await api.post(
      `/sessions/${sessionId}`,
      { question },
      {
        withCredentials: true,
      }
    );
    const data = response.data;
    const rawResponse = data?.result?.map?.response;

    if (!data?.isSuccess && !rawResponse) {
      throw new Error('응답 형식이 올바르지 않습니다.');
    }

    const answerMessage = {
      memberMessageId: messageId ?? Date.now(),
      sessionId: sessionId,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      question: question,
      answer: '',
      isStreaming: false,
      roleModels: [],
    };

    // 문자열 응답 처리
    if (typeof rawResponse === 'string') {
      return {
        ...answerMessage,
        answer: rawResponse,
      };
    }

    // 배열 응답 처리
    if (Array.isArray(rawResponse)) {
      const roleModels: RoleModel[] = rawResponse.map((item: any) => ({
        years: item.years && !isNaN(Number(item.years)) ? Number(item.years) : 0,
        careerTitle: item.careerTitle ?? '엔지니어',
        name: item.name ?? '이름 없음',
      }));
      return {
        ...answerMessage,
        answer: '추천 롤모델을 확인해보세요!',
        roleModels: roleModels,
      };
    }
    throw new Error('응답 형식이 올바르지 않습니다.');
  } catch (error) {
    console.error('메시지 전송 실패:', error);
    throw error;
  }
};
