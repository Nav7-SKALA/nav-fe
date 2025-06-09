import api from './index';

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

export const sendChatMessageStreaming = async (sessionId: string, question: string): Promise<string> => {
  try {
    const response = await api.post(
      `/sessions/${sessionId}`,
      { question },
      {
        withCredentials: true,
      }
    );
    const data = response.data;

    if (data?.isSuccess && data?.result?.map?.response && typeof data.result.map.response === 'string') {
      return data.result.map.response;
    } else {
      throw new Error('응답 형식이 올바르지 않습니다.');
    }
  } catch (error) {
    console.error('메시지 전송 실패:', error);
    throw error;
  }
};
