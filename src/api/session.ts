import api from './index';
import { ChatSession } from '../types/session';
import { Message, MessageBlock } from '../types/chat';
import { RoleModelGroup } from '../types/roleModel';

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

export interface RoleModelDtoResponse {
  roleModelId: string;
  greetingMessage: string;
  group_name: string;
  current_position: string;
  experience_years: string;
  common_skill_set: string[];
}

export interface FetchSessionMessageResponse {
  sessionId: string;
  sessionTitle: string;
  createdAt: string;
  messages: Message[];
  hasNext: boolean;
  nextMessageId?: string; // 추가: 다음 메시지 ID
  roleModelDTO?: RoleModelDtoResponse | null;
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

  const cleanedMessages = (data.messages ?? []).map((msg: any) => {
    const answer = msg.answer ?? {};
    const blocks: MessageBlock[] = [];

    switch (msg.type) {
      case 'path_recommend': {
        // similar_text
        if (answer.similar_text) {
          blocks.push({ type: 'similar_text', content: answer.similar_text });
        }

        // similar_roadmaps
        if (Array.isArray(answer.similar_roadmaps) && answer.similar_roadmaps.length > 0) {
          blocks.push({ type: 'similar_roadmaps', content: answer.similar_roadmaps });
        }

        // text
        if (answer.text) {
          blocks.push({ type: 'text', content: answer.text });
        }

        // roadmaps
        if (Array.isArray(answer.roadmaps) && answer.roadmaps.length > 0) {
          blocks.push({ type: 'roadmaps', content: answer.roadmaps });
        }
        break;
      }

      case 'role_model': {
        if (Array.isArray(answer.rolemodels) && answer.rolemodels.length > 0) {
          const enrichedRoleModels = answer.rolemodels.map((rm: RoleModelGroup) => {
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

      case 'career_goal':
      case 'role_model_chat': {
        if (answer.text) {
          blocks.push({ type: 'text', content: answer.text });
        }
        break;
      }

      case 'trend_path': {
        if (answer.text) {
          blocks.push({ type: 'text', content: answer.text });
        }
        if (answer.ax_college) {
          blocks.push({ type: 'ax_college', content: answer.ax_college });
        }
        break;
      }

      case 'EXCEPTION': {
        if (answer.text) {
          blocks.push({ type: 'text', content: answer.text });
        }
        break;
      }
    }

    return {
      ...msg,
      blocks,
      responseType: msg.type,
    };
  });

  return {
    sessionId: data.sessionId,
    sessionTitle: data.sessionTitle,
    createdAt: data.createdAt,
    messages: cleanedMessages,
    hasNext: data.hasNext ?? false,
    nextMessageId: data.nextMessageId ?? null,
    roleModelDTO: data.roleModelDTO ?? null,
  };
};

export const createRoleModelSession = async (
  group: RoleModelGroup
): Promise<{ sessionId: string; roleModelId: string }> => {
  const response = await api.post('/sessions/rolemodels', group, { withCredentials: true });
  const sessionId = response.data?.result?.sessionId;
  const roleModelId = response.data?.result?.roleModelId;

  return {
    sessionId,
    roleModelId,
  };
};
