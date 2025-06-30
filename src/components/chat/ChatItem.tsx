import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Message } from '../../types/chat';
import RoleModelCard from './RoleModelCard';
import RoleModelProfileCard from './RoleModelProfileCard';
import ReactMarkdown from 'react-markdown';

interface ChatItemProps {
  message: Message;
  index: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onContentUpdate?: () => void;
  isNewMessage?: boolean;
  isLoadingPreviousChats?: boolean;
  roleModelInfo?: {
    name: string;
    careerTitle: string;
    skillSet: string;
    tenure: number;
    profileImage: string;
  };
}

const ChatItem = ({
  message,
  index,
  setMessages,
  onContentUpdate,
  isNewMessage = false,
  isLoadingPreviousChats = false,
  roleModelInfo,
}: ChatItemProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const roleModelRef = useRef<HTMLDivElement | null>(null);

  const isStreaming = message.isStreaming === true;
  const [displayedContent, setDisplayedContent] = useState(isStreaming && message.answer ? '' : message.answer);
  const [showRoleModels, setShowRoleModels] = useState(false);

  // 답변 스트리밍 효과
  useEffect(() => {
    if (!isStreaming || !message.answer) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i > message.answer.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((msg) => (msg.memberMessageId === message.memberMessageId ? { ...msg, isStreaming: false } : msg))
        );
        return;
      }
      setDisplayedContent(message.answer.slice(0, i));
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      onContentUpdate?.();
    }, 10);

    return () => clearInterval(interval);
  }, [isStreaming, message.answer, message.memberMessageId, setMessages, onContentUpdate]);

  // 롤모델 카드
  useEffect(() => {
    if (message.roleModels?.length > 0) {
      if (isLoadingPreviousChats) {
        setShowRoleModels(true);
      } else if (!isStreaming) {
        const timer = setTimeout(() => setShowRoleModels(true), 200);
        return () => clearTimeout(timer);
      }
    }
    return () => setShowRoleModels(false);
  }, [isStreaming, message.roleModels, isLoadingPreviousChats]);

  // 스크롤
  useEffect(() => {
    if (showRoleModels && roleModelRef.current && isNewMessage && !isLoadingPreviousChats) {
      const scrollTimer = setTimeout(() => {
        roleModelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return () => clearTimeout(scrollTimer);
    }
  }, [showRoleModels, isNewMessage, isLoadingPreviousChats]);

  const renderText = (text: string) => {
    const cleanText = text.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
    return (
      <ChatItemContent>
        <ReactMarkdown>{cleanText}</ReactMarkdown>
      </ChatItemContent>
    );
  };

  // 롤모델 인트로 메시지
  if (message.type === 'intro' && roleModelInfo) {
    return (
      <MessageWrapper $align="left">
        <ChatItemContainer $role="AGENT">
          <FadeInContainer>
            <RoleModelProfileCard {...roleModelInfo} />
          </FadeInContainer>
        </ChatItemContainer>
      </MessageWrapper>
    );
  }

  // 롤모델 메시지
  if (message.type === 'modelMessage') {
    return (
      <MessageWrapper $align="left">
        <ChatItemContainer ref={scrollRef} $role="AGENT">
          {renderText(isStreaming ? displayedContent : message.answer)}
        </ChatItemContainer>
      </MessageWrapper>
    );
  }

  return (
    <>
      {message.question && (
        <MessageWrapper $align="right">
          <ChatItemContainer $role="USER">{renderText(message.question)}</ChatItemContainer>
        </MessageWrapper>
      )}
      {(message.answer || isStreaming) && (
        <MessageWrapper $align="left">
          <ChatItemContainer ref={scrollRef} $role="AGENT">
            {isStreaming && displayedContent.length === 0 && (
              <TypingIndicator>
                답변 생성 중<span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </TypingIndicator>
            )}
            {message.answer && renderText(isStreaming ? displayedContent : message.answer)}
            {showRoleModels && (
              <FadeInContainer ref={roleModelRef} $skipAnimation={isLoadingPreviousChats}>
                <RoleModelCard roleModels={message.roleModels} />
              </FadeInContainer>
            )}
          </ChatItemContainer>
        </MessageWrapper>
      )}
    </>
  );
};

export default ChatItem;

const MessageWrapper = styled.div<{ $align: 'left' | 'right' }>`
  display: flex;
  justify-content: ${(props) => (props.$align === 'right' ? 'flex-end' : 'flex-start')};
  width: 100%;
  max-width: 65rem;
  padding: 0 1.25rem;
  box-sizing: border-box;
`;

const ChatItemContainer = styled.div<{ $role: 'USER' | 'AGENT' }>`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  background-color: ${(props) => (props.$role === 'USER' ? '#F7F7F7' : '#fff')};
  padding: 0.8rem 1rem;
  border-radius: 25px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  width: fit-content;
  margin: 0.5rem 0;
`;

const ChatItemContent = styled.div`
  font-size: 0.9rem;
  margin: 0;
  word-break: break-word;
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
