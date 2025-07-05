import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainBackground from '../assets/main/img_main_background.svg';
import Header from '../components/layout/Header';
import ChatInput from '../components/chat/ChatInput';
import { Message } from '../types/chat';
import { PathImg, PencilImg, RoleModelImg } from '../assets/main';
import { useLayoutStore } from '../store/useLayoutStore';
import { useSessionStore } from '../store/useSessionStore';
import { useUserStore } from '../store/useUserStore';
import Navbar from '../components/layout/Navbar';
import { deleteSession } from '../api/session';

const MainPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // ✅ zustand 상태 추출
  const { isSidebarOpen, headerType, toggleSidebar, setHeaderType } = useLayoutStore();
  const { sessions, fetchNextSessions } = useSessionStore();
  const { memberName } = useUserStore();

  useEffect(() => {
    inputRef.current?.focus();
    fetchNextSessions();
  }, [fetchNextSessions]);

  // 사이드바 토글 시 헤더 타입도 변경
  useEffect(() => {
    if (isSidebarOpen) {
      setHeaderType('simple');
    } else {
      setHeaderType('default'); // 또는 기본 타입
    }
  }, [isSidebarOpen, setHeaderType]);

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

  const createNewSession = useSessionStore((state) => state.createNewSession);

  const handleCreateNewSession = async (question: string): Promise<{ sessionId: string }> => {
    const { sessionId } = await createNewSession(question);
    navigate(`/chat/${sessionId}`, {
      state: { question },
    });
    return { sessionId };
  };

  return (
    <MainPageContainer>
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
      <MainContent $isSidebarOpen={isSidebarOpen}>
        <GrettingSection>
          <H1>메인 화면</H1>
          <SubGretting>안녕하세요, {memberName} 님</SubGretting>
          <MainGretting>무엇을 도와드릴까요?</MainGretting>
        </GrettingSection>
        <ChatInput
          setMessages={setMessages}
          isFetchMessages={false}
          onCreateNewSession={handleCreateNewSession}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
        <ExampleSection>
          <H2>예시 기능</H2>
          {exampleList.map((example, index) => (
            <Example
              key={index}
              img={example.img}
              title={example.title}
              content={example.content}
              description={example.description}
              examplePrompt={example.examplePrompt}
              exampleOutput={example.exampleOutput}
              onClickExample={() => setInputValue(example.examplePrompt)}
            />
          ))}
        </ExampleSection>
      </MainContent>
    </MainPageContainer>
  );
};

export default MainPage;

interface ExampleProps {
  img: string;
  title: string;
  content: string;
  description: string;
  examplePrompt: string;
  exampleOutput: string;
  onClickExample: () => void;
}

const Example = ({ img, title, content, description, examplePrompt, exampleOutput, onClickExample }: ExampleProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <ExampleContainer
      onClick={onClickExample}
      onMouseEnter={() => {
        setShowModal(true);
      }}
      onMouseLeave={() => {
        setShowModal(false);
      }}
    >
      {showModal && (
        <HoverModalAbove>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <ModalSection>
              <SectionTitle>기능 설명</SectionTitle>
              <SectionText>{description}</SectionText>
            </ModalSection>

            <ModalSection>
              <SectionTitle>예시 프롬프트</SectionTitle>
              <ExampleBox>{examplePrompt}</ExampleBox>
            </ModalSection>

            <ModalSection>
              <SectionTitle>예시 출력</SectionTitle>
              <ExampleBox isOutput>{exampleOutput}</ExampleBox>
            </ModalSection>
          </ModalContent>
        </HoverModalAbove>
      )}
      <ExampleContent>
        <ExampleImg src={img} alt={title} />
        <ExampleTitle>{title}</ExampleTitle>
      </ExampleContent>
      {content.split('\n').map((line, index) => (
        <ExampleText key={index}>
          {line}
          {index !== content.split('\n').length - 1 && <br />}
        </ExampleText>
      ))}
    </ExampleContainer>
  );
};

const exampleList = [
  {
    img: PathImg,
    title: '성장 경로',
    content: '앞으로의 성장 경로를 추천 받고 싶습니다',
    description:
      '현재 역량과 목표를 바탕으로 개인화된 성장 경로 방향성을 제공합니다. 단계별 학습 계획과 마일스톤을 통해 체계적인 성장을 도와드립니다.',
    examplePrompt: '3년차 프론트엔드 개발자인데, 풀스택 개발자로 성장하고 싶어요. 어떤 순서로 공부해야 할까요?',
    exampleOutput:
      '1단계: Node.js/Express 기초 학습 (2개월)\n2단계: 데이터베이스 설계 및 활용 (1개월)\n3단계: API 설계 및 개발 (2개월)\n4단계: 클라우드 서비스 활용 (1개월)',
  },
  {
    img: RoleModelImg,
    title: '롤모델',
    content: '백엔드 개발 전문가한테 조언 받고 싶습니다',
    description:
      '다양한 분야의 전문가들의 커리어 path를 분석하여 실질적인 인사이트를 제공합니다. 실제 경험과 노하우를 바탕으로 한 조언을 받을 수 있습니다.',
    examplePrompt: '백엔드 개발 전문가한테 조언 받고 싶습니다.',
    exampleOutput:
      '대표적인 금융 백엔드 개발자 커리어:\n• 주니어(1-3년): 기본 API 개발, 금융 도메인 이해\n• 미들(3-7년): 대용량 거래 처리, 보안 시스템 구축\n• 시니어(7년+): 아키텍처 설계, 팀 리딩\n필수 스킬셋과 각 단계별 성장 포인트를 상세히 안내해드립니다.',
  },
  {
    img: PencilImg,
    title: '학습 추천',
    content: '백엔드 개발 역량을 높이려면 어떻게 공부해야 하나요?',
    description: '현재 보유 기술과 시장 트렌드를 분석하여 가장 효과적인 다음 학습 방향을 제시합니다.',
    examplePrompt: '백엔드 개발 역량을 더 빠르게 높이려면 어떻게 공부해야 할까요',
    exampleOutput:
      '추천 기술 스택 (우선순위순):\n1. Docker/Kubernetes - 컨테이너 기술 (높음)\n2. AWS/GCP 클라우드 서비스 (높음)\n3. TypeScript - 타입 안정성 향상 (중간)\n4. Redis - 캐싱 및 성능 최적화 (중간)\n각 기술의 학습 시간과 활용도, 연봉 상승 효과를 함께 제공합니다.',
  },
];

const MainPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100vw;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  background-image: url(${MainBackground});
  background-size: cover;
  background-position: center;
`;

const TopSection = styled.div`
  display: flex;
  width: 100%;
  height: 80px; /* 헤더 높이 */
`;

const MainContent = styled.section<{ $isSidebarOpen: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 80px);
  padding-bottom: 15vh;
  margin-left: ${(props) => (props.$isSidebarOpen ? '250px' : '0')}; /* 사이드바 너비만큼 마진 */
  transition: margin-left 0.5s ease;
`;

const GrettingSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const H1 = styled.h1`
  display: none;
`;

const H2 = styled.h2`
  display: none;
`;

const SubGretting = styled.p`
  font-size: 1.8rem;
  font-weight: 500;
  margin: 0;
  margin-top: 1rem;
`;

const MainGretting = styled.p`
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0.7rem 0 2rem;
`;

const ExampleSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60vw;
  max-width: 38rem;
  gap: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  overflow: visible;
  position: relative;
`;

const ExampleContainer = styled.div`
  position: relative;
  background-color: #f7f7f7;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  min-height: 7.5rem;
  padding: 0.5rem 1.2rem 0.8rem;

  height: auto;
  overflow-y: visible;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ExampleContent = styled.div`
  display: flex;
  width: 100% !important;
  justify-content: space-between !important;
  box-sizing: border-box;
  padding: 0.8rem 0.3rem;
  align-items: center;
  justify-content: center;
`;

const ExampleTitle = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
`;

const ExampleImg = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  //border-radius: 50%;
`;

const ExampleText = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
  margin: 0;
`;

const HoverModalAbove = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  padding: 0;
  width: 35rem;
  max-width: 90vw;
  z-index: 1000;
  pointer-events: none;
  border: 1px solid #e5e7eb;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 10px solid transparent;
    border-top-color: white;
  }

  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 11px solid transparent;
    border-top-color: #e5e7eb;
    z-index: -1;
  }
`;

// const ModalHeader = styled.div`
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   padding: 1rem 1.5rem;
//   border-radius: 1.2rem 1.2rem 0 0;
// `;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
  padding: 1rem 1.5rem;
  border-radius: 1.2rem 1.2rem 0 0;
`;

const ModalTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ModalContent = styled.div`
  padding: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
`;

const ModalSection = styled.div`
  margin-bottom: 1.2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  color: #606060;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;

  &::before {
    content: '▶';
    color: #ff6b6b;
    font-size: 0.7rem;
    margin-right: 0.5rem;
  }
`;

const SectionText = styled.p`
  color: #606060;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0;
`;

const ExampleBox = styled.div<{ isOutput?: boolean }>`
  background: ${(props) => (props.isOutput ? '#fff5f5' : '#f9fafb')};
  border: 1px solid ${(props) => (props.isOutput ? '#fecaca' : '#e5e7eb')};
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.8rem;
  line-height: 1.4;
  color: #374151;
  white-space: pre-line;
  font-family: ${(props) =>
    props.isOutput ? 'inherit' : 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace'};

  /* ${(props) =>
    props.isOutput &&
    `
    border-left: 3px solid #f43f5e;
  `} */
`;
