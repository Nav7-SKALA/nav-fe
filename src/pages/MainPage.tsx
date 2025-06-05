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
import Navbar from '../components/layout/Navbar';

const MainPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // ✅ zustand 상태 추출
  const { isSidebarOpen, headerType, toggleSidebar, setHeaderType } = useLayoutStore();
  const { sessions, resetSessions, fetchNextSessions } = useSessionStore();

  useEffect(() => {
    inputRef.current?.focus();
    fetchNextSessions();
  }, []);

  // 사이드바 토글 시 헤더 타입도 변경
  useEffect(() => {
    if (isSidebarOpen) {
      setHeaderType('simple');
    } else {
      setHeaderType('default'); // 또는 기본 타입
    }
  }, [isSidebarOpen, setHeaderType]);

  const handleDeleteSession = () => {
    alert(`세션삭제됨`); // 실제 구현 필요
  };

  const handleNewChat = () => {
    navigate('/main/');
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
        <Header username="손성민" type={headerType} onSidebarToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </TopSection>
      <MainContent isSidebarOpen={isSidebarOpen}>
        <GrettingSection>
          <H1>메인 화면</H1>
          <SubGretting>안녕하세요, 손성민 님</SubGretting>
          <MainGretting>무엇을 도와드릴까요?</MainGretting>
        </GrettingSection>
        <ChatInput setMessages={setMessages} isFetchMessages={false} />
        <ExampleSection>
          <H2>예시 기능</H2>
          {exampleList.map((example, index) => (
            <Example key={index} img={example.img} title={example.title} content={example.content} />
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
}

const Example = ({ img, title, content }: ExampleProps) => {
  return (
    <ExampleContainer>
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
  { img: PathImg, title: '성장 경로', content: '앞으로의 성장 경로를 추천 받고 싶습니다' },
  { img: PencilImg, title: '롤모델', content: '금융 Domain 중심 Backend 개발자의 커리어를 보여줘' },
  { img: RoleModelImg, title: '스킬 추천', content: '지금 상태에서 어떤 기술을 익히는 것이 도움이 될까요?' },
];

const MainPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100vw;
  width: 100%;
  height: 100vh;
  background-image: url(${MainBackground});
  background-size: cover;
  background-position: center;
`;

const TopSection = styled.div`
  display: flex;
  width: 100%;
  height: 80px; /* 헤더 높이 */
`;

// const MainContent = styled.section`
//   display: flex;
//   flex: 1;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   height: calc(100vh - 80px);
//   padding-bottom: 15vh;
// `;
const MainContent = styled.section<{ isSidebarOpen: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 80px);
  padding-bottom: 15vh;
  margin-left: ${(props) => (props.isSidebarOpen ? '250px' : '0')}; /* 사이드바 너비만큼 마진 */
  transition: margin-left 0.3s ease;
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
`;

const ExampleContainer = styled.div`
  background-color: #f7f7f7;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  height: 7.5rem;
  overflow-y: auto;
  padding: 0.5rem 1.2rem 0.8rem;
`;

const ExampleContent = styled.p`
  display: flex;
  width: 100% !important;
  justify-content: space-between !important;
  box-sizing: border-box;
  padding: 0 0.3rem;
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
