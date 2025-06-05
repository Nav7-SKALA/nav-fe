import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Message } from '../../types/chat';

interface ChatItemProps {
  message: Message;
  index: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onContentUpdate?: () => void;
}

const ChatItem = ({ message, index, setMessages, onContentUpdate }: ChatItemProps) => {
  const [displayedContent, setDisplayedContent] = useState(message.isStreaming ? '' : message.answer);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!message.isStreaming) return;

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

  const formatBold = (text: string) => text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  const renderText = (text: string) => {
    const paragraphs = text
      .replace(/^"|"$/g, '')
      .replace(/\\n/g, '\n')
      .split(/\n{2,}/);
    return paragraphs.map((para, pIndex) => (
      <ChatItemContent key={pIndex}>
        {para.split('\n').map((line, lIndex, arr) => (
          <React.Fragment key={lIndex}>
            <span dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
            {lIndex !== arr.length - 1 && <br />}
          </React.Fragment>
        ))}
      </ChatItemContent>
    ));
  };

  return (
    <>
      <ChatItemContainer $role="USER">{renderText(message.question)}</ChatItemContainer>
      <ChatItemContainer ref={scrollRef} $role="AGENT">
        {renderText(displayedContent)}
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
`;
