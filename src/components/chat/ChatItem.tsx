import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Message } from '../../types/chat';
import RoleModelCard from './RoleModelCard';
import { RoleModel } from '../../types/roleModel';
import ReactMarkdown from 'react-markdown';

interface ChatItemProps {
  message: Message;
  index: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onContentUpdate?: () => void;
  isNewMessage?: boolean;
}

const ChatItem = ({ message, index, setMessages, onContentUpdate, isNewMessage }: ChatItemProps) => {
  const [displayedContent, setDisplayedContent] = useState(message.isStreaming ? '' : message.answer);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showRoleModels, setShowRoleModels] = useState(false);
  const roleModelRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!message.isStreaming && message.roleModels?.length > 0) {
      const timer = setTimeout(() => {
        setShowRoleModels(true);
      }, 200); // 0.2초 후 등장

      return () => {
        clearTimeout(timer);
        setShowRoleModels(false);
      };
    }
  }, [message.isStreaming, message.roleModels]);

  useEffect(() => {
    if (showRoleModels && roleModelRef.current && isNewMessage) {
      roleModelRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showRoleModels, isNewMessage]);

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
          <FadeInContainer ref={roleModelRef}>
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

const FadeInContainer = styled.div`
  animation: fadeIn 0.4s ease-in-out;

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
