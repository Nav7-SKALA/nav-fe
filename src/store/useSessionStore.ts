import { create } from 'zustand';
import { ChatSession } from '../types/session';
import { fetchSessions, FetchSessionParams } from '../api/session';

interface SessionState {
  sessions: ChatSession[];
  hasNext: boolean;
  fetchNextSessions: () => Promise<void>;
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
}));
