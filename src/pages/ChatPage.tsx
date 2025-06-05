import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/layout/Header';
import ChatItem from '../components/chat/ChatItem';
import ChatInput from '../components/chat/ChatInput';
import { Message } from '../types/chat';
import axios from 'axios';

const USE_MOCK = true;

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetchMessages, setIsFetchMessages] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ✅ mock 데이터 정의
  const mockMessages: Message[] = [
    {
      memberMessageId: 1,
      sessionId: 101,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      question: '안녕하세요, 무엇을 도와드릴까요?',
      answer: '안녕하세요! 테스트 중입니다.',
      isStreaming: false,
    },
    {
      memberMessageId: 2,
      sessionId: 101,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      question: 'TypeScript로 채팅 테스트 중이에요.',
      answer: '좋습니다. streaming 효과도 동작할 거예요.',
      isStreaming: false,
    },
  ];

  useEffect(() => {
    if (USE_MOCK) {
      setMessages(mockMessages);
      setIsFetchMessages(true);
    } else {
      fetchMessages();
    }
  }, []);

  const fetchMessages = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/chat/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
        },
      })
      .then((response) => {
        console.log('메시지 가져오기 성공:', response.data.body);
        setMessages(response.data.body);
        setIsFetchMessages(true);
      })
      .catch((error) => {
        console.error('메시지 가져오기 오류:', error);
      });
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // messages가 바뀔 때마다 가장 아래로 스크롤
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ChatPageContainer>
      <Header username={'손성민'} />
      <ChatContainer>
        <ChatContent ref={scrollRef}>
          {messages.map((item, index) => {
            const currentDate = new Date(item.createdAt).toDateString();
            const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;

            const shouldShowDate = currentDate !== prevDate;

            return (
              <React.Fragment key={item.memberMessageId}>
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
      <ChatInput setMessages={setMessages} isFetchMessages={isFetchMessages} />
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
  max-width: 60rem;
  overflow-y: auto;
`;
