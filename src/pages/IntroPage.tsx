import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { useSessionStore } from '../store/useSessionStore';

const IntroPage = () => {
  const sessions = useSessionStore((state) => state.sessions);
  const fetchNextSessions = useSessionStore((state) => state.fetchNextSessions);
  const resetSessions = useSessionStore((state) => state.resetSessions);

  useEffect(() => {
    const initLoad = async () => {
      resetSessions(); // 초기화
      await fetchNextSessions(); // 첫 페이지 불러오기
      useSessionStore.setState({ isInitialized: true });
      console.log('초기 세션 불러오기 완료');
    };
    initLoad();
  }, []);

  const handleDeleteSession = (sessionId: string) => {
    useSessionStore.setState((prev) => ({
      sessions: prev.sessions.filter((s) => s.sessionId !== sessionId),
    }));
    console.log(`세션 ${sessionId} 삭제됨`);
  };

  const handleNewChat = () => {
    const newSession = {
      sessionId: Date.now().toString(),
      sessionTitle: '새로운 채팅',
      createdAt: new Date().toISOString(),
    };
    useSessionStore.setState((prev) => ({
      sessions: [newSession, ...prev.sessions],
    }));
    console.log('새 채팅 생성됨');
  };

  const handleToggleSidebar = () => {
    console.log('사이드바 토글됨');
  };

  return (
    <Navbar
      sessions={sessions}
      onDeleteSession={handleDeleteSession}
      onNewChat={handleNewChat}
      onToggleSidebar={handleToggleSidebar}
    />
  );
};

export default IntroPage;
