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

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { message?: string };
  const { sessionId } = useParams<{ sessionId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetchMessages, setIsFetchMessages] = useState(false);
  const [nextMessageId, setNextMessageId] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [isInitialMessageSent, setIsInitialMessageSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const loadMessages = useCallback(async () => {
    if (!scrollRef.current) return;
    const previousHeight = scrollRef.current.scrollHeight;

    const res = await fetchSessionMessages(sessionId, nextMessageId ?? undefined);
    setMessages((prev) => [...res.messages.reverse(), ...prev]);
    setHasNext(res.hasNext);
    setNextMessageId(res.nextMessageId);
    setIsFetchMessages(true);

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight - previousHeight;
      }
    }, 0);
  }, [sessionId, nextMessageId]);

  // 초기 메시지 전송 처리
  const sendInitialMessage = useCallback(
    async (question: string) => {
      if (!sessionId || isInitialMessageSent) return;

      const now = new Date().toISOString();
      const messageId = Date.now();

      const message: Message = {
        question,
        answer: '',
        createdAt: now,
        lastActiveAt: now,
        sessionId,
        memberMessageId: messageId,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, message]);
      setIsInitialMessageSent(true);

      setTimeout(() => scrollToBottom(), 0);

      try {
        const fullAnswer = await sendChatMessageStreaming(sessionId, question);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.memberMessageId === messageId ? { ...msg, answer: fullAnswer, isStreaming: true } : msg
          )
        );
      } catch (error) {
        console.error('Error sending initial message:', error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.memberMessageId === messageId ? { ...msg, answer: '오류가 발생했습니다.', isStreaming: false } : msg
          )
        );
      }
    },
    [sessionId, isInitialMessageSent]
  );

  useInfiniteScrolling({
    observerRef: observerRef.current,
    fetchMore: loadMessages,
    hasMore: hasNext && isFetchMessages,
  });

  useEffect(() => {
    if (isFetchMessages && !isInitialScrollDone) {
      scrollToBottom();
      setIsInitialScrollDone(true);
    }
  }, [isFetchMessages, isInitialScrollDone]);

  // 세션 ID가 변경될 때마다 초기화
  useEffect(() => {
    setMessages([]);
    setIsFetchMessages(false);
    setNextMessageId(null);
    setHasNext(true);
    setIsInitialMessageSent(false);
    setIsInitialScrollDone(false);
  }, [sessionId]);

  // 메시지 로드
  useEffect(() => {
    if (sessionId && !isFetchMessages) {
      loadMessages();
    }
  }, [sessionId, isFetchMessages, loadMessages]);

  // 초기 메시지 처리 (메시지 로드 완료 후)
  useEffect(() => {
    if (state?.message && sessionId && isFetchMessages && !isInitialMessageSent) {
      sendInitialMessage(state.message);
      // state 정리하여 새로고침 시 중복 실행 방지
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    state?.message,
    sessionId,
    isFetchMessages,
    isInitialMessageSent,
    sendInitialMessage,
    navigate,
    location.pathname,
  ]);

  return (
    <ChatPageContainer>
      <Header username="손성민" />
      <ChatContainer>
        <ChatContent ref={scrollRef}>
          <div ref={observerRef} style={{ height: '1px' }}></div>
          {messages.map((item, index) => {
            const currentDate = new Date(item.createdAt).toDateString();
            const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
            const shouldShowDate = currentDate !== prevDate;

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
                <ChatItem message={item} index={index} setMessages={setMessages} onContentUpdate={scrollToBottom} />
              </React.Fragment>
            );
          })}
        </ChatContent>
      </ChatContainer>
      <ChatInput setMessages={setMessages} isFetchMessages={isFetchMessages} scrollToBottom={scrollToBottom} />
      <AlertComment>Navi는 실수를 할 수 있습니다. 중요한 정보는 재차 확인하세요.</AlertComment>
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
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 9rem);
  overflow: hidden;
`;

const AlertComment = styled.p`
  font-size: 0.8rem;
  margin: 1rem 0 1.5rem;
  box-sizing: border-box;
`;

const ChatDate = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0;
  justify-self: center;
`;

const ChatContent = styled.div`
  flex: 1;
  width: 100vw;
  margin-bottom: 0.2rem;
  max-width: 65rem;
  overflow-y: auto;
`;
