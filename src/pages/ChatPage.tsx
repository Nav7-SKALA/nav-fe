import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import ChatItem from '../components/chat/ChatItem';
import ChatInput from '../components/chat/ChatInput';
import { Message } from '../types/chat';
import { fetchSessionMessages } from '../api/session';
import useInfiniteScrolling from '../hooks/useInfiniteScrolling';
import { sendChatMessageStreaming } from '../api/chat';
import { useLayoutStore } from '../store/useLayoutStore';
import { useUserStore } from '../store/useUserStore';
import { useSessionStore } from '../store/useSessionStore';
import { deleteSession } from '../api/session';
import Navbar from '../components/layout/Navbar';
import { RoleModelGroup } from '../types/roleModel';

type LocationState = {
  roleModelGroup?: RoleModelGroup;
  roleModelId?: string;
  question?: string;
};

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const roleModelGroup = state?.roleModelGroup;
  const roleModelId = state?.roleModelId;
  const question = state?.question;
  const isRoleModelSession = !!roleModelId;
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetchMessages, setIsFetchMessages] = useState(false);
  const [nextMessageId, setNextMessageId] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [isInitialMessageSent, setIsInitialMessageSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);
  const [latestMessageId, setLatestMessageId] = useState<number | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { isSidebarOpen, headerType, toggleSidebar, setHeaderType } = useLayoutStore();
  const { sessions, fetchNextSessions } = useSessionStore();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { memberName } = useUserStore();

  useEffect(() => {
    if (isSidebarOpen) {
      setHeaderType('simple');
    } else {
      setHeaderType('default'); // 또는 기본 타입
    }
  }, [isSidebarOpen, setHeaderType]);

  useEffect(() => {
    inputRef.current?.focus();
    fetchNextSessions();
  }, []);

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId); // ✅ 실제 API 호출
      useSessionStore.setState((prev) => ({
        sessions: prev.sessions.filter((s) => s.sessionId !== sessionId),
      }));
    } catch (error) {
      console.error('세션 삭제 실패:', error);
    }
  };

  const handleNewChat = () => {
    navigate('/main/');
  };

  // 스크롤 보정을 위한 ref
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const isLoadingNewMessages = useRef(false);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const loadMessages = useCallback(async () => {
    if (!scrollRef.current || !hasNext) return;

    isLoadingNewMessages.current = true;
    const scrollContainer = scrollRef.current;
    const previousHeight = scrollContainer.scrollHeight;
    const previousScrollTop = scrollContainer.scrollTop;

    try {
      const res = await fetchSessionMessages(sessionId, nextMessageId ?? undefined);

      const reversedMessages = res.messages.reverse();
      const newMessages: Message[] = [...reversedMessages];

      // ✅ 마지막 메시지까지 불러왔고, roleModelDTO가 있을 때 greeting 메시지 생성
      if (!res.hasNext && res.roleModelDTO) {
        const now = new Date().toISOString();
        const messageId = Date.now();

        const greetingRaw = res.roleModelDTO.greetingMessage?.trim().length
          ? res.roleModelDTO.greetingMessage
          : `안녕하세요, ${res.roleModelDTO.group_name}입니다. \n\n저는 ${res.roleModelDTO.current_position}로서 약 ${res.roleModelDTO.experience_years}의 경력을 가지고 있어요. \n\n커리어에 대해 함께 이야기해볼까요?`;

        const greeting = splitIntoSentences(greetingRaw);

        const roleModelGreetingMessage: Message = {
          sessionId: sessionId,
          memberMessageId: messageId,
          createdAt: now,
          lastActiveAt: now,
          question: '',
          isStreaming: false,
          blocks: [
            { type: 'role_model_card', content: res.roleModelDTO },
            { type: 'text', content: greeting },
          ],
        };

        newMessages.unshift(roleModelGreetingMessage);
      }

      // ✅ 한 번에 메시지 반영
      setMessages((prev) => [...newMessages, ...prev]);
      setHasNext(res.hasNext);
      setNextMessageId(res.nextMessageId);

      if (isFirstLoad) {
        setIsFetchMessages(true);
        setIsFirstLoad(false);
        isLoadingNewMessages.current = false;
      } else {
        setTimeout(() => {
          if (scrollContainer) {
            const newHeight = scrollContainer.scrollHeight;
            const heightDifference = newHeight - previousHeight;
            scrollContainer.scrollTop = previousScrollTop + heightDifference;
            isLoadingNewMessages.current = false;
          }
        }, 10);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      isLoadingNewMessages.current = false;
    }
  }, [sessionId, nextMessageId, isFirstLoad, hasNext]);

  const splitIntoSentences = (text: string) => {
    if (!text) return '';
    return (
      text
        // 문장 끝에 있는 마침표/물음표/느낌표 뒤에 줄바꿈 추가
        .replace(/([.!?])(?=\s|$)/g, '$1\n\n')
    );
  };

  const sendInitialMessage = useCallback(() => {
    if (!sessionId || isInitialMessageSent) return;

    const now = new Date().toISOString();
    const messageId = Date.now();

    // 일반 채팅 세션인 경우
    if (question) {
      const userMessage: Message = {
        sessionId,
        memberMessageId: messageId,
        createdAt: now,
        lastActiveAt: now,
        question,
        isStreaming: true,
        blocks: [],
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsInitialMessageSent(true);
      setLatestMessageId(messageId);
      setTimeout(() => scrollToBottom(), 0);

      // 답변 요청
      sendChatMessageStreaming(sessionId, question, messageId)
        .then((fullAnswer) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.memberMessageId === fullAnswer.memberMessageId
                ? {
                    ...msg,
                    blocks: fullAnswer.blocks,
                    isStreaming: true,
                  }
                : msg
            )
          );
        })
        .catch((error) => {
          console.error('초기 메시지 전송 실패:', error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.memberMessageId === messageId
                ? {
                    ...msg,
                    blocks: [{ type: 'text', content: '초기 메시지를 불러오는 데 실패했습니다.' }],
                    isStreaming: false,
                  }
                : msg
            )
          );
        });

      // 메시지 사용 후 state 초기화
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    sessionId,
    isInitialMessageSent,
    isRoleModelSession,
    roleModelGroup,
    question,
    scrollToBottom,
    navigate,
    location.pathname,
  ]);

  useInfiniteScrolling({
    observerRef: observerRef.current,
    fetchMore: loadMessages,
    hasMore: hasNext && isFetchMessages,
  });

  useEffect(() => {
    if (isFetchMessages && isFirstLoad === false) {
      const scrollTimer = setTimeout(() => {
        scrollToBottom();
        setIsInitialScrollDone(true);
      }, 30); // 조금 더 여유를 둠
      return () => clearTimeout(scrollTimer);
    }
  }, [isFetchMessages, messages, isFirstLoad]);

  useEffect(() => {
    setMessages([]);
    setIsFetchMessages(false);
    setNextMessageId(null);
    setHasNext(true);
    setIsInitialMessageSent(false);
    setIsInitialScrollDone(false);
    setLatestMessageId(null);
    setIsFirstLoad(true);
    isLoadingNewMessages.current = false;
  }, [sessionId]);

  useEffect(() => {
    if (sessionId && !isFetchMessages && isFirstLoad) {
      loadMessages();
    }
  }, [sessionId, isFetchMessages, loadMessages, isFirstLoad]);

  useEffect(() => {
    if (sessionId && isFetchMessages && !isInitialMessageSent && (question || isRoleModelSession)) {
      sendInitialMessage();
    }
  }, [sessionId, isFetchMessages, isInitialMessageSent, question, isRoleModelSession, sendInitialMessage]);

  return (
    <ChatPageContainer>
      <TopSection>
        {isSidebarOpen && (
          <Navbar
            sessions={sessions}
            onDeleteSession={handleDeleteSession}
            onNewChat={handleNewChat}
            onToggleSidebar={toggleSidebar}
          />
        )}
        <Header username={memberName} type={headerType} onSidebarToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </TopSection>
      <ChatContainer $isSidebarOpen={isSidebarOpen}>
        <ChatContent ref={scrollRef}>
          {hasNext && messages.length > 0 && <ObserverElement ref={observerRef} />}
          {messages.length > 1 && <ScrollAnchor ref={scrollAnchorRef} />}

          {messages.map((item, index) => {
            const currentDate = new Date(item.createdAt).toDateString();
            const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
            const shouldShowDate = currentDate !== prevDate;
            const isLatestMessage = latestMessageId === item.memberMessageId;

            return (
              <React.Fragment key={`${item.sessionId}-${item.memberMessageId}-${index}`}>
                {shouldShowDate && (
                  <ChatDate>
                    {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long',
                    })}
                  </ChatDate>
                )}
                <ChatItem
                  message={item}
                  index={index}
                  setMessages={setMessages}
                  onContentUpdate={scrollToBottom}
                  isNewMessage={isLatestMessage}
                  isLoadingPreviousChats={!isInitialScrollDone}
                />
              </React.Fragment>
            );
          })}
        </ChatContent>
      </ChatContainer>
      <ChatInput
        setMessages={setMessages}
        isFetchMessages={isFetchMessages}
        scrollToBottom={scrollToBottom}
        setLatestMessageId={setLatestMessageId}
        isSidebarOpen={isSidebarOpen}
        roleModelId={roleModelId}
      />
      <AlertComment $isSidebarOpen={isSidebarOpen}>
        Navi는 실수를 할 수 있습니다. 중요한 정보는 재차 확인하세요.
      </AlertComment>
    </ChatPageContainer>
  );
};

export default ChatPage;

const ChatPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  min-width: 100vw;
  width: fit-content;
  overflow-x: hidden;
`;

const TopSection = styled.div`
  display: flex;
  width: 100%;
  height: 80px; /* 헤더 높이 */
`;

const ChatContainer = styled.div<{ $isSidebarOpen: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 9rem);
  margin-left: ${(props) => (props.$isSidebarOpen ? '250px' : '0')}; /* 사이드바 너비만큼 마진 */
  transition: margin-left 0.5s ease;
  overflow: hidden;
`;

const AlertComment = styled.p<{ $isSidebarOpen: boolean }>`
  font-size: 0.8rem;
  margin: 1rem 0 1.5rem;
  margin-left: ${(props) => (props.$isSidebarOpen ? '250px' : '0')}; /* 사이드바 너비만큼 마진 */
  transition: margin-left 0.5s ease;
  box-sizing: border-box;
`;

const ChatDate = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0;
  justify-self: center;
  margin-bottom: 0.3rem;
`;

const ChatContent = styled.div`
  flex: 1;
  width: 100vw;
  margin-bottom: 0.2rem;
  max-width: 65rem;
  overflow-y: auto;
`;

const ObserverElement = styled.div`
  height: 1px;
  width: 100%;
`;

const ScrollAnchor = styled.div`
  height: 0;
  width: 100%;
  position: relative;
`;
