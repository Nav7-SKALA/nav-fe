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
    title: '커리어 추천',
    content: '내 경력 기반으로 향후에는 어떤 직무를 갖게 될까?',
    description:
      '현재 역량과 목표를 바탕으로 개인화된 성장 경로 방향성을 제공합니다. 단계별 학습 계획과 마일스톤을 통해 체계적인 성장을 도와드립니다.',
    examplePrompt: '내 경력 기반으로 향후에는 어떤 직무를 갖게 될까요?',
    exampleOutput:
      '🚀 15년 후 맞춤형 미래 직무 TOP 3\n• 1-5년차: 기반 강화\n• 6-10년차: 융합 전문가\n• 11-15년차: 미래 선도자',
  },
  {
    img: RoleModelImg,
    title: '멘토 추천',
    content: '백엔드 개발 전문가한테 조언 받고 싶습니다',
    description:
      '다양한 분야의 전문가들의 커리어 path를 분석하여 실질적인 인사이트를 제공합니다. 실제 경험과 노하우를 바탕으로 한 조언을 받을 수 있습니다.',
    examplePrompt: '백엔드 개발 전문가한테 조언 받고 싶습니다.',
    exampleOutput:
      '대표적인 금융 백엔드 개발자 커리어:\n• 주니어(1-3년): 기본 API 개발, 금융 도메인 이해\n• 미들(3-7년): 대용량 거래 처리, 보안 시스템 구축\n• 시니어(7년+): 아키텍처 설계, 팀 리딩\n',
  },
  {
    img: PencilImg,
    title: '경력 추천',
    content: '프론트엔드 분야의 매니저들은 어떻게 경력을 쌓았나요?',
    description: '실제 유사한 경로로 전환한 동료들의 사례를 바탕으로, 단계별 프로젝트 경험과 성장 포인트를 제공합니다.',
    examplePrompt: '백엔드 기반 경력을 살려 프론트엔드로 전환하고 싶은데, 어떤 기술과 경험을 먼저 쌓아야 할까요?',
    exampleOutput:
      '전환 로드맵 예시:\n- 3~5년차: UI 구현 중심 프론트엔드 프로젝트 참여\n- 5~7년차: 아키텍처 설계 및 성능 최적화 경험\n- 7~9년차: 팀 리딩 및 기술 전략 수립\n백엔드 경험은 통합적 시스템 이해 측면에서 강점입니다.',
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
