import { create } from 'zustand';
import { ChatSession } from '../types/session';
import { fetchSessions } from '../api/session';
import { sendInitChatMessage } from '../api/chat';

interface SessionState {
  sessions: ChatSession[];
  hasNext: boolean;
  fetchNextSessions: () => Promise<void>;
  createNewSession: (question: string) => Promise<{ sessionId: string }>;
  resetSessions: () => void;
  cursorAt?: string;
  cursorId?: string;
  isLoading: boolean;
  isInitialized: boolean;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  hasNext: true,
  cursorAt: undefined,
  cursorId: undefined,
  isLoading: false,
  isInitialized: false,

  fetchNextSessions: async () => {
    const { sessions, hasNext, cursorAt, cursorId, isLoading } = get();
    if (!hasNext || isLoading) return;
    set({ isLoading: true });
    try {
      const res = await fetchSessions({ size: 15, cursorAt, cursorId });

      if (res.sessions.length === 0) {
        set({ hasNext: false });
        return;
      }

      const last = res.sessions[res.sessions.length - 1];
      set((state) => ({
        sessions: [...state.sessions, ...res.sessions],
        hasNext: res.hasNext,
        cursorAt: last.createdAt, // 또는 적절한 필드명
        cursorId: last.sessionId,
      }));
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  resetSessions: () => {
    set({
      sessions: [],
      hasNext: true,
      cursorAt: undefined,
      cursorId: undefined,
      isLoading: false,
    });
  },

  createNewSession: async (question: string): Promise<{ sessionId: string }> => {
    try {
      const { sessionId } = await sendInitChatMessage(question);
      const newSession: ChatSession = {
        sessionId,
        sessionTitle: question,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        sessions: [newSession, ...state.sessions],
      }));
      return { sessionId };
    } catch (error) {
      console.error('Error creating new session:', error);
      throw error;
    }
  },
}));
