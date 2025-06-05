import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaQuestion } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import axios from 'axios';
import { Message } from '../../types/chat';

interface ChatInputProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isFetchMessages: boolean;
}

interface LocationState {
  message?: string;
}

const USE_MOCK = true;

const ChatInput = ({ setMessages, isFetchMessages }: ChatInputProps) => {
  const location = useLocation();
  // const state = location.state as LocationState;
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const [isComposing, setIsComposing] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>(window.location.pathname);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, [window.location.pathname]);

  useEffect(() => {
    setInputValue('');
  }, [currentPage]);

  useEffect(() => {
    if (USE_MOCK && isFetchMessages && currentPage === '/chat' && state?.message) {
      simulateMessageFlow(state.message);
    }
  }, [isFetchMessages]);

  /*
  useEffect(() => {
    if (isFetchMessages && currentPage === '/chat' && state?.message) {
      const question = state.message;
      setMessages((prev) => [
        ...prev,
        {
          question,
          answer: '',
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          sessionId: 0,
          memberMessageId: Date.now(),
          isStreaming: true,
        },
      ]);
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/chat/messages`,
          {
            question,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
            },
          }
        )
        .then((res) => {
          const answer = res.data.body.answer;
          setMessages((prev) =>
            prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, answer, isStreaming: true } : msg))
          );
        })
        .catch((error) => {
          console.error('질문 전송 오류:', error);
          alert('질문 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
        });
    }
  }, [isFetchMessages]); */

  const simulateMessageFlow = (question: string) => {
    setMessages((prev) => [
      ...prev,
      {
        question,
        answer: '',
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        sessionId: 0,
        memberMessageId: Date.now(),
        isStreaming: true,
      },
    ]);

    setTimeout(() => {
      const mockAnswer = `Mock 응답: "${question}"에 대한 답변입니다.`;
      setMessages((prev) =>
        prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, answer: mockAnswer, isStreaming: true } : msg))
      );
    }, 1200);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  /*

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim() === '') return;

    const userQuestion = inputValue;
    setInputValue('');

    setMessages((prev) => [
      ...prev,
      {
        question: userQuestion,
        answer: '',
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        sessionId: 0,
        memberMessageId: Date.now(),
        isStreaming: true,
      },
    ]);

    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/chat/messages`,
        { question: userQuestion },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
          },
        }
      )
      .then((res) => {
        const answer = res.data.body.answer;
        setMessages((prev) =>
          prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, answer, isStreaming: true } : msg))
        );
      })
      .catch((err) => {
        console.error('질문 전송 오류:', err);
        alert('질문 전송 중 오류가 발생했습니다.');
      });

    if (currentPage === '/') {
      navigate('/chat', { state: { message: userQuestion } });
    }
  }; */

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim() === '') return;

    const userQuestion = inputValue;
    setInputValue('');

    simulateMessageFlow(userQuestion);

    if (currentPage === '/' && !USE_MOCK) {
      navigate('/chat', { state: { message: userQuestion } });
    }
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
  width: ${(props) => (props.$currentPage === '/chat' ? 'calc(100vw - 40px)' : '60vw')};
  max-width: ${(props) => (props.$currentPage === '/chat' ? 'calc(60rem - 2.5rem)' : '38rem')};
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
