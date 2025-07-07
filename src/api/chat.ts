import api from './index';
import { Message, MessageBlock } from '../types/chat';
import { RoleModelGroup } from '../types/roleModel';

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
    const map = data?.result?.map;

    if (!data?.isSuccess && !map) {
      throw new Error('응답 형식이 올바르지 않습니다.');
    }

    const type = data.result.type;

    const blocks: MessageBlock[] = [];

    switch (type) {
      case 'path_recommend': {
        const { similar_text, similar_roadmaps, text, roadmaps } = map;
        if (similar_text) {
          blocks.push({ type: 'similar_text', content: similar_text });
        }

        if (Array.isArray(similar_roadmaps) && similar_roadmaps.length > 0) {
          blocks.push({ type: 'similar_roadmaps', content: similar_roadmaps });
        }

        if (text) {
          blocks.push({ type: 'text', content: text });
        }

        if (Array.isArray(roadmaps) && roadmaps.length > 0) {
          blocks.push({ type: 'roadmaps', content: roadmaps });
        }
        break;
      }

      case 'role_model': {
        if (Array.isArray(map.rolemodels) && map.rolemodels.length > 0) {
          const enrichedRoleModels = map.rolemodels.map((rm: RoleModelGroup) => {
            const greetingMessage = `안녕하세요, ${rm.group_name}입니다. \n\n저는 ${rm.current_position}로서 약 ${rm.experience_years}의 경력을 가지고 있어요. \n\n${rm.advice_message} 저에게 궁금한점이 있으신가요?`;
            return {
              ...rm,
              greetingMessage,
            };
          });

          console.log(enrichedRoleModels);

          blocks.push({ type: 'role_model', content: enrichedRoleModels });
        }
        break;
      }

      case 'career_goal': {
        if (map.text) {
          blocks.push({ type: 'text', content: map.text });
        }
        break;
      }

      case 'trend_path': {
        if (map.text) {
          blocks.push({ type: 'text', content: map.text });
        }

        if (map.ax_college) {
          blocks.push({ type: 'ax_college', content: map.ax_college.toLowerCase() });
        }
        break;
      }

      case 'EXCEPTION': {
        if (map.text) {
          blocks.push({ type: 'text', content: map.text });
        }
        break;
      }
    }

    const answerMessage = {
      memberMessageId: messageId ?? Date.now(),
      sessionId,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      question,
      isStreaming: false,
      blocks,
      responseType: type,
    };

    return answerMessage;
  } catch (error) {
    console.error('메시지 전송 실패:', error);
    throw error;
  }
};

export const sendRoleModelChatStreaming = async (
  sessionId: string,
  question: string,
  messageId?: number
): Promise<Message> => {
  try {
    const response = await api.post(`/sessions/rolemodels/${sessionId}`, { question });
    const blocks: MessageBlock[] = [];
    const data = response.data;

    if (data.result.answer) {
      blocks.push({ type: 'text', content: response.data.result.answer });
    }
    const answerMessage = {
      memberMessageId: messageId ?? Date.now(),
      sessionId,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      question,
      isStreaming: false,
      blocks,
    };

    return answerMessage;
  } catch (error) {
    console.error('롤모델 대화 전송 실패:', error);
    throw error;
  }
};
