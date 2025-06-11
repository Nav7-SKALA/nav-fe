import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Message } from '../../types/chat';
import RoleModelCard from './RoleModelCard';
import ReactMarkdown from 'react-markdown';

interface ChatItemProps {
  message: Message;
  index: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onContentUpdate?: () => void;
  isNewMessage?: boolean;
  isLoadingPreviousChats?: boolean; // 이전 채팅 로딩 중인지 구분
}

const ChatItem = ({
  message,
  index,
  setMessages,
  onContentUpdate,
  isNewMessage = false,
  isLoadingPreviousChats = false,
}: ChatItemProps) => {
  const [displayedContent, setDisplayedContent] = useState(message.isStreaming ? '' : message.answer);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showRoleModels, setShowRoleModels] = useState(false);
  const roleModelRef = useRef<HTMLDivElement | null>(null);

  // 스트리밍 처리
  useEffect(() => {
    if (!message.isStreaming || !message.answer) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i > message.answer.length) {
        clearInterval(interval);
        setMessages((prev) => prev.map((msg, idx) => (idx === index ? { ...msg, isStreaming: false } : msg)));
        return;
      }
      setDisplayedContent(message.answer.slice(0, i));
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      onContentUpdate?.();
    }, 10);

    return () => clearInterval(interval);
  }, [message.isStreaming, message.answer, index, setMessages, onContentUpdate]);

  // 롤모델 카드 표시 처리
  useEffect(() => {
    if (message.roleModels?.length > 0) {
      if (isLoadingPreviousChats) {
        // 이전 채팅 로딩 시 즉시 표시 (애니메이션 없음)
        setShowRoleModels(true);
      } else if (!message.isStreaming) {
        // 새로운 메시지의 경우 스트리밍 완료 후 딜레이와 함께 표시
        const timer = setTimeout(() => {
          setShowRoleModels(true);
        }, 200);

        return () => {
          clearTimeout(timer);
        };
      }
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      setShowRoleModels(false);
    };
  }, [message.isStreaming, message.roleModels, isLoadingPreviousChats]);

  // 새로운 메시지의 롤모델 카드만 스크롤
  useEffect(() => {
    if (showRoleModels && roleModelRef.current && isNewMessage && !isLoadingPreviousChats) {
      // 약간의 딜레이를 주어 애니메이션과 함께 스크롤
      const scrollTimer = setTimeout(() => {
        roleModelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // 'end' 대신 'nearest'로 변경하여 불필요한 스크롤 방지
        });
      }, 100);

      return () => clearTimeout(scrollTimer);
    }
  }, [showRoleModels, isNewMessage, isLoadingPreviousChats]);

  const renderText = (text: string) => {
    const cleanText = text
      .replace(/^"|"$/g, '') // 앞뒤 큰따옴표 제거
      .replace(/\\n/g, '\n'); // 이스케이프된 \n → 실제 줄바꿈

    return (
      <ChatItemContent>
        <ReactMarkdown>{cleanText}</ReactMarkdown>
      </ChatItemContent>
    );
  };

  return (
    <>
      <ChatItemContainer $role="USER">{renderText(message.question)}</ChatItemContainer>
      <ChatItemContainer ref={scrollRef} $role="AGENT">
        {/* 응답이 아직 없고 스트리밍 중일 때만 인디케이터 출력 */}
        {message.answer === '' && message.isStreaming && (
          <TypingIndicator>
            답변 생성 중<span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </TypingIndicator>
        )}
        {/* 답변 도착 후에는 한 글자씩 출력 */}
        {renderText(displayedContent)}
        {showRoleModels && (
          <FadeInContainer
            ref={roleModelRef}
            $skipAnimation={isLoadingPreviousChats} // 이전 채팅 로딩 시 애니메이션 스킵
          >
            <RoleModelCard roleModels={message.roleModels} />
          </FadeInContainer>
        )}
      </ChatItemContainer>
    </>
  );
};

export default ChatItem;

const ChatItemContainer = styled.div<{ $role: 'USER' | 'AGENT' }>`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin: 0.5rem 1.25rem !important;
  margin-left: ${(props) => (props.$role === 'USER' ? 'auto' : '1.25rem')} !important;
  background-color: ${(props) => (props.$role === 'USER' ? '#F7F7F7' : '#fff')};
  padding: 0.8rem 1rem;
  border-radius: 25px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  width: fit-content;
`;

const ChatItemContent = styled.p`
  font-size: 0.9rem;
  margin: 0;
  word-break: break-word; // 긴 단어 자동 줄바꿈
`;

const TypingIndicator = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #888;
  display: flex;
  align-items: center;

  .dot {
    animation: blink 1.5s infinite;
    animation-delay: 0s;
  }

  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    0%,
    80%,
    100% {
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
  }
`;

const FadeInContainer = styled.div<{ $skipAnimation?: boolean }>`
  ${({ $skipAnimation }) =>
    !$skipAnimation &&
    `
    animation: fadeIn 0.4s ease-in-out;
  `}

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
