import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Message, MessageBlock } from '../../types/chat';
import RoleModelProfileCard from './RoleModelProfileCard';
import SimilarRoadmapCard from './SimilarRoadmapCard';
import RoadmapCard from './RoadmapCard';
import ReactMarkdown from 'react-markdown';
import RoleModelCard from './RoleModelCard';
import Modal from 'react-modal';
import { Search, Download } from 'lucide-react';

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

const ThreeDButterflyTypingIndicator = () => {
  return (
    <TypingContainer role="status" aria-label="답변 생성 중">
      <ButterflyGIF src="/butterflies.gif" alt="나비 타이핑 중" />
      <TypingText>G.Navi가 답변을 작성하고 있습니다</TypingText>
      <DotsContainer>
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </DotsContainer>
    </TypingContainer>
  );
};

const ButterflyGIF = styled.img`
  width: 1.6rem;
  height: 1.6rem;
`;

const ChatItem = ({
  message,
  setMessages,
  onContentUpdate,
  isNewMessage = false,
  isLoadingPreviousChats = false,
  roleModelInfo,
}: ChatItemProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const roleModelRef = useRef<HTMLDivElement | null>(null);

  const isStreaming = message.isStreaming === true;

  const [displayedBlocks, setDisplayedBlocks] = useState<MessageBlock[]>([]);
  const [streamingIndex, setStreamingIndex] = useState<number | null>(null);
  const [streamingText, setStreamingText] = useState<string>('');

  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const handleImageClick = (src: string) => setModalImageSrc(src);
  const handleCloseModal = () => setModalImageSrc(null);

  // 초기 스트리밍 대상 설정
  useEffect(() => {
    if (!isStreaming || !message.blocks) return;

    const nextTextIndex = message.blocks.findIndex((b) => b.type === 'text');
    if (nextTextIndex === -1) {
      setDisplayedBlocks(message.blocks);
      return;
    }

    const blocksBeforeText = message.blocks.slice(0, nextTextIndex);
    setDisplayedBlocks(blocksBeforeText);
    setStreamingIndex(nextTextIndex);
    setStreamingText('');
  }, [isStreaming, message.blocks]);

  // 스트리밍 로직
  useEffect(() => {
    if (streamingIndex === null || !message.blocks) return;

    const block = message.blocks[streamingIndex];
    if (!block || block.type !== 'text' || typeof block.content !== 'string') return;

    let i = 0;
    const interval = setInterval(() => {
      i++;

      if (i > block.content.length) {
        clearInterval(interval);

        // 현재 블록까지 포함된 새로운 렌더링 목록
        const updated = [...displayedBlocks, { ...block }];

        // 나머지 블록들 중 다음 스트리밍할 text 블록 찾기
        const remainingBlocks = message.blocks.slice(streamingIndex + 1);
        const nextTextIndexInRest = remainingBlocks.findIndex((b) => b.type === 'text');

        if (nextTextIndexInRest !== -1) {
          // 다음 text 블록 존재 → 스트리밍 예약
          const nextStreamingIndex = streamingIndex + 1 + nextTextIndexInRest;
          const newDisplayed = remainingBlocks.slice(0, nextTextIndexInRest);
          setDisplayedBlocks([...updated, ...newDisplayed]);
          setStreamingIndex(nextStreamingIndex);
          setStreamingText('');
        } else {
          // 다음 text 블록 없음 → 모두 정적 렌더링
          setDisplayedBlocks([...updated, ...remainingBlocks]);
          setStreamingIndex(null);
          setMessages((prev) =>
            prev.map((msg) => (msg.memberMessageId === message.memberMessageId ? { ...msg, isStreaming: false } : msg))
          );
        }
      }

      const partial = block.content.slice(0, i);
      setStreamingText(partial);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      onContentUpdate?.();
    }, 10);

    return () => clearInterval(interval);
  }, [streamingIndex, message.blocks, displayedBlocks, message.memberMessageId, onContentUpdate, setMessages]);

  // roleModel ref 스크롤 이동
  useEffect(() => {
    if (isNewMessage && !isLoadingPreviousChats) {
      const scrollTimer = setTimeout(() => {
        roleModelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return () => clearTimeout(scrollTimer);
    }
  }, [isNewMessage, isLoadingPreviousChats]);

  useEffect(() => {
    if (!isStreaming && message.blocks?.length > 0 && displayedBlocks.length === 0) {
      setDisplayedBlocks(message.blocks);
    }
  }, [isStreaming, message.blocks, displayedBlocks.length]);

  // 렌더링 함수
  const renderBlock = (block: MessageBlock, idx: number) => {
    switch (block.type) {
      case 'similar_text':
      case 'text':
        return (
          <ChatItemContent key={idx}>
            <ReactMarkdown>{(block.content as string).replace(/^"|"$/g, '').replace(/\\n/g, '\n')}</ReactMarkdown>
          </ChatItemContent>
        );
      case 'roadmaps':
        return (
          <FadeInContainer key={idx} ref={roleModelRef} $skipAnimation={isLoadingPreviousChats}>
            <RoadmapCard data={block.content} />
          </FadeInContainer>
        );
      case 'similar_roadmaps':
        return (
          <FadeInContainer key={idx} ref={roleModelRef} $skipAnimation={isLoadingPreviousChats}>
            <SimilarRoadmapCard data={block.content} />
          </FadeInContainer>
        );
      case 'role_model':
        return (
          <FadeInContainer key={idx} ref={roleModelRef} $skipAnimation={isLoadingPreviousChats}>
            <RoleModelCard roleModelGroups={block.content} />
          </FadeInContainer>
        );
      case 'role_model_card':
        return (
          <FadeInContainer key={idx} ref={roleModelRef} $skipAnimation={isLoadingPreviousChats}>
            <RoleModelProfileCard
              name={block.content.group_name}
              careerTitle={block.content.current_position}
              skillSet={block.content.common_skill_set}
              tenure={block.content.experience_years}
            />
          </FadeInContainer>
        );
      case 'ax_college':
        const imagePath = `/ax_college/${block.content}.jpeg`;
        return (
          <FadeInContainer key={idx} ref={roleModelRef} $skipAnimation={isLoadingPreviousChats}>
            <div style={{ width: '100%', marginBottom: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }} />
            <ChatItemContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <strong style={{ marginBottom: '0.75rem' }}>AX College 추천 분야</strong>

              <div style={{ position: 'relative', width: '100%' }}>
                <img src={imagePath} alt={block.content} style={{ width: '100%', borderRadius: '0.5rem' }} />

                <div
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    display: 'flex',
                    gap: '0.5rem',
                    background: 'rgba(255, 255, 255, 1)', // ✅ 배경색 추가
                    borderRadius: '0.5rem',
                    padding: '0.3rem',
                    boxShadow: '0 0 6px rgba(0, 0, 0, 0.1)', // ✅ 약간의 그림자
                  }}
                >
                  <button
                    onClick={() => handleImageClick(imagePath)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.2rem',
                      color: '#333', // ✅ 아이콘 색상 조정
                    }}
                    title="확대 보기"
                  >
                    <Search size={18} />
                  </button>

                  <a
                    href={imagePath}
                    download
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.2rem',
                      color: '#333', // ✅ 아이콘 색상 조정
                    }}
                    title="이미지 다운로드"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            </ChatItemContent>
          </FadeInContainer>
        );

      default:
        return null;
    }
  };

  const renderChatBlocks = (blocks: MessageBlock[]) => {
    return blocks.map((block, idx) => {
      const items: React.ReactNode[] = [];

      // similar_text 제목
      if (block.type === 'similar_text' && message.responseType === 'path_recommend') {
        items.push(
          <div
            key={`title-similar-${idx}`}
            style={{ fontWeight: 600, fontSize: '1rem', margin: '1rem 0 0.5rem', color: '#555' }}
          >
            📌 [참고용] 사내 전문가 경력 로드맵
          </div>
        );
      }

      // text 제목
      if (block.type === 'text' && message.responseType === 'path_recommend') {
        items.push(
          <div
            key={`title-main-${idx}`}
            style={{ fontWeight: 600, fontSize: '1rem', margin: '1rem 0 0.5rem', color: '#555' }}
          >
            🚀 개인 맞춤형 커리어 성장 추천 로드맵
          </div>
        );
      }

      // 블록 자체 렌더링
      items.push(renderBlock(block, idx));

      return items;
    });
  };

  // 일반 메시지 (질문/답변)
  return (
    <>
      {message.question && (
        <MessageWrapper $align="right">
          <ChatItemContainer $role="USER">
            <ChatItemContent>
              <ReactMarkdown>{message.question}</ReactMarkdown>
            </ChatItemContent>
          </ChatItemContainer>
        </MessageWrapper>
      )}
      {(displayedBlocks.length > 0 || streamingIndex !== null || isStreaming) && (
        <MessageWrapper $align="left">
          <ChatItemContainer ref={scrollRef} $role="AGENT">
            {renderChatBlocks(displayedBlocks)}
            {streamingIndex !== null && streamingText && (
              <ChatItemContent>
                <ReactMarkdown>{streamingText}</ReactMarkdown>
              </ChatItemContent>
            )}
            {isStreaming && displayedBlocks.length === 0 && streamingText === '' && <ThreeDButterflyTypingIndicator />}
          </ChatItemContainer>
        </MessageWrapper>
      )}
      <Modal
        isOpen={!!modalImageSrc}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 0,
            border: 'none',
            background: 'transparent',

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            width: '90vw',
            height: '90vh',

            maxWidth: '100vw',
            maxHeight: '100vh',
            overflow: 'auto',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1000,
          },
        }}
        ariaHideApp={false}
      >
        <img
          src={modalImageSrc}
          alt="확대 이미지"
          style={{
            maxWidth: '90vw', // ✅ 뷰포트 기준 최대 너비 제한
            maxHeight: '90vh', // ✅ 최대 높이 제한
            height: 'auto',
            width: 'auto', // ✅ 원본 비율 유지하며 자동
            objectFit: 'contain',
            borderRadius: '0.75rem',
            boxShadow: '0 0 20px rgba(0,0,0,0.3)',
            cursor: 'zoom-out',
          }}
          onClick={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default ChatItem;

// Styled Components

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

// 개선된 로딩 인디케이터 스타일
const TypingContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  gap: 0.5rem;
`;

const TypingText = styled.span`
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 0.15rem;
  margin-left: 0.25rem;
`;

const blink = keyframes`
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
`;

const Dot = styled.span<{ delay: string }>`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #007bff;
  animation: ${blink} 1.5s infinite;
  animation-delay: ${(props) => props.delay};
`;
