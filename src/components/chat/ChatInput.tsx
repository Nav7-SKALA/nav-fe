import React, { useEffect, useState, ChangeEvent } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaQuestion } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import { Message } from '../../types/chat';
import { sendChatMessageStreaming } from '../../api/chat';

interface ChatInputProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isFetchMessages: boolean;
  onCreateNewSession?: (question: string) => Promise<{ sessionId: string }>;
}

const ChatInput = ({ setMessages, isFetchMessages, onCreateNewSession }: ChatInputProps) => {
  const location = useLocation();
  const { sessionId } = useParams<{ sessionId: string }>();

  const [isComposing, setIsComposing] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>(window.location.pathname);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    setInputValue('');
  }, [currentPage]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim() === '') return;

    const userQuestion = inputValue;
    setInputValue('');

    let targetSessionId = sessionId;
    if (!targetSessionId && onCreateNewSession) {
      try {
        const response = await onCreateNewSession(userQuestion);
        targetSessionId = response.sessionId;
        return;
      } catch (error) {
        console.error('Error creating new session:', error);
      }
    }

    if (!targetSessionId) return;

    const now = new Date().toISOString();
    const messageId = Date.now();

    const message: Message = {
      question: userQuestion,
      answer: '',
      createdAt: now,
      lastActiveAt: now,
      sessionId: targetSessionId,
      memberMessageId: messageId,
      isStreaming: true,
    };

    setMessages((prev) => [...prev, message]);

    const fullAnswer = await sendChatMessageStreaming(targetSessionId, userQuestion);

    // ✅ 전체 answer만 한번에 넣어주면, ChatItem이 한 글자씩 보여줌
    setMessages((prev) =>
      prev.map((msg) =>
        msg.memberMessageId === messageId
          ? { ...msg, answer: fullAnswer, isStreaming: true } // 타이핑 중
          : msg
      )
    );
  };

  return (
    <InputSection
      $currentPage={currentPage}
      onClick={() => {
        const input = document.querySelector('input');
        if (input) input.focus();
      }}
    >
      <H2>질문하기</H2>
      <Input
        type="text"
        placeholder="무엇이든 물어보세요"
        onChange={handleInputChange}
        value={inputValue}
        onKeyDown={(e) => {
          if (isComposing) return;
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
      />
      <Btns>
        <QuestionBtn>
          <FaQuestion color="#fff" size={15} />
        </QuestionBtn>
        <RightBtns>
          <SubmitBtn type="submit" onClick={handleSubmit}>
            <IoSend color="#fff" size={14} />
          </SubmitBtn>
        </RightBtns>
      </Btns>
    </InputSection>
  );
};
export default ChatInput;

const H2 = styled.h2`
  display: none;
`;

const InputSection = styled.section<{ $currentPage: string }>`
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  width: ${(props) => (props.$currentPage.startsWith('/chat') ? 'calc(100vw - 40px)' : '60vw')};
  max-width: ${(props) => (props.$currentPage.startsWith('/chat') ? 'calc(65rem - 2.5rem)' : '38rem')};
  padding: 1.5rem 1.5rem 1rem;
  box-sizing: border-box;
  margin: 0 20px;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  border: none;
  width: 100%;
  font-size: 0.9rem;
  height: 1.1rem;

  &:focus {
    outline: none;
  }
`;
const Btns = styled.div`
  display: flex;
`;
const RightBtns = styled.div`
  margin-left: auto;
  display: flex;
`;
const Button = styled.button`
  border: none;
  border-radius: 100%;
  width: 2rem;
  height: 2rem;
  background-color: #5c5c5c;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const QuestionBtn = styled(Button)``;
const SubmitBtn = styled(Button)``;
