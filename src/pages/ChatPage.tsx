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
  const [latestMessageId, setLatestMessageId] = useState<number | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

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

      setMessages((prev) => [...res.messages.reverse(), ...prev]);
      setHasNext(res.hasNext);
      setNextMessageId(res.nextMessageId);

      // 첫 로드일 때만 isFetchMessages를 true로 설정
      if (isFirstLoad) {
        setIsFetchMessages(true);
        setIsFirstLoad(false);
        isLoadingNewMessages.current = false;
      } else {
        // DOM 업데이트 완료를 기다린 후 스크롤 보정
        setTimeout(() => {
          if (scrollContainer) {
            const newHeight = scrollContainer.scrollHeight;
            const heightDifference = newHeight - previousHeight;
            scrollContainer.scrollTop = previousScrollTop + heightDifference;
            isLoadingNewMessages.current = false;
          }
        }, 10); // 10ms 지연으로 DOM 업데이트 보장
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      isLoadingNewMessages.current = false;
    }
  }, [sessionId, nextMessageId, isFirstLoad, hasNext]);

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
      setLatestMessageId(messageId);

      setTimeout(() => scrollToBottom(), 0);

      try {
        const fullAnswer = await sendChatMessageStreaming(sessionId, question, messageId);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.memberMessageId === fullAnswer.memberMessageId
              ? { ...msg, answer: fullAnswer.answer, isStreaming: true, roleModels: fullAnswer.roleModels }
              : msg
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

  // 첫 로드 완료 후에만 스크롤을 아래로 이동
  useEffect(() => {
    if (isFetchMessages && !isInitialScrollDone && isFirstLoad === false) {
      scrollToBottom();
      setIsInitialScrollDone(true);
    }
  }, [isFetchMessages, isInitialScrollDone, isFirstLoad]);

  // 세션 ID가 변경될 때마다 초기화
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

  // 메시지 로드
  useEffect(() => {
    if (sessionId && !isFetchMessages && isFirstLoad) {
      loadMessages();
    }
  }, [sessionId, isFetchMessages, loadMessages, isFirstLoad]);

  // 초기 메시지 처리 (메시지 로드 완료 후)
  useEffect(() => {
    if (state?.message && sessionId && isFetchMessages && !isInitialMessageSent) {
      sendInitialMessage(state.message);
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
          {/* Observer를 첫 번째 메시지 위에 위치 */}
          {hasNext && messages.length > 0 && <ObserverElement ref={observerRef} />}

          {/* 스크롤 앵커 - 두 번째 메시지에 위치 */}
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
      />
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

const ObserverElement = styled.div`
  height: 1px;
  width: 100%;
`;

const ScrollAnchor = styled.div`
  height: 0;
  width: 100%;
  position: relative;
`;
