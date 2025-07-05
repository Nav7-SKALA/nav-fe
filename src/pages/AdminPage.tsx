import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Edit2, Save, X, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaPowerOff } from 'react-icons/fa';
import { useUserStore } from '../store/useUserStore';
import { Direction } from '../types/direction';
import { fetchDirection, fetchDirectionsAll, createDirection } from '../api/direction';
import { logout } from '../api/logout';

// 스타일 컴포넌트
const Container = styled.div`
  min-height: 100vh;
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(1rem);
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px rgba(220, 38, 38, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 3rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
`;

const TopBar = styled.div`
  position: absolute;
  top: 3rem;
  right: 3rem;
`;

const ExitBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: #fff;
  border-radius: 100%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    background-color: #e0e0e0;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  color: #606060;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: #606060;
  font-size: 1.125rem;
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto;
  font-weight: 500;
`;

const Section = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(1rem);
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px rgba(220, 38, 38, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: linear-gradient(135deg, #dc2626 0%, #ff9b9b 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.3;
`;

const SectionContent = styled.div`
  padding: 2.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 700;
  color: #606060;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DescriptionBox = styled.div`
  color: #606060;
  font-size: 1.125rem;
  line-height: 1.8;
  padding: 2rem;
  background: rgba(148, 163, 184, 0.1);
  border-radius: 1rem;
  border: 1px solid rgba(220, 38, 38, 0.1);
  font-weight: 500;
`;

const Textarea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  padding: 2rem;
  border: 2px solid rgba(220, 38, 38, 0.2);
  border-radius: 1rem;
  font-size: 1.125rem;
  line-height: 1.8;
  min-height: 200px;
  resize: vertical;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
  font-weight: 400;

  &:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  line-height: 1;

  ${(props) => {
    if (props.$variant === 'primary') {
      return `
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white;
        box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
        
        &:hover {
          background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
        }
      `;
    } else {
      return `
        background: rgba(248, 250, 252, 0.8);
        color: #475569;
        border: 2px solid rgba(148, 163, 184, 0.3);
        
        &:hover {
          background: rgba(241, 245, 249, 0.9);
          border-color: rgba(148, 163, 184, 0.5);
          transform: translateY(-1px);
        }
      `;
    }
  }}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const HistorySection = styled.div`
  background: linear-gradient(135deg, #64748b 0%, #a4b1c4 100%);
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HistoryItem = styled.div`
  padding: 2.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  transition: background-color 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(248, 250, 252, 0.7);
  }
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const HistoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #606060;
  font-size: 0.9375rem;
  font-weight: 500;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:first-child::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    background: #94a3b8;
    border-radius: 50%;
  }
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${(props) =>
    props.$isActive
      ? `
        background: rgba(16, 185, 129, 0.1);
        color: #047857;
        border: 2px solid rgba(16, 185, 129, 0.2);
      `
      : `
        background: rgba(148, 163, 184, 0.1);
        color: #475569;
        border: 2px solid rgba(148, 163, 184, 0.2);
      `}
`;

const HistoryContent = styled.div`
  color: #374151;
  font-size: 1.125rem;
  line-height: 1.8;
  padding: 2rem;
  background: rgba(148, 163, 184, 0.1);
  border-radius: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.5);
  font-weight: 400;
`;

const AdminPage = () => {
  const [currentDirection, setCurrentDirection] = useState<Direction>();
  const [history, setHistory] = useState<Direction[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(currentDirection);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const [latestRes, allRes] = await Promise.all([fetchDirection(), fetchDirectionsAll()]);

        setCurrentDirection(latestRes);
        setHistory(allRes);
      } catch (error) {
        console.error('방향성 데이터를 불러오는 중 오류 발생: ', error);
      }
    };

    fetchDirections();
  }, []);

  const handleEdit = () => {
    if (!currentDirection) return;
    setEditForm(currentDirection);
    setIsEditing(true);
  };

  const handleLogoutBtn = async () => {
    // zustand 초기화
    useUserStore.getState().logout();
    localStorage.removeItem('user-storage');

    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
    navigate('/login');
  };

  const handleSave = async () => {
    if (!editForm?.prompt) return;

    try {
      await createDirection(editForm.prompt);

      const [latestRes, allRes] = await Promise.all([fetchDirection(), fetchDirectionsAll()]);

      setCurrentDirection(latestRes);
      setHistory(allRes);
      setIsEditing(false);
    } catch (error) {
      console.error('방향성 저장 중 오류 발생: ', error);
    }
  };

  const handleCancel = () => {
    setEditForm(currentDirection);
    setIsEditing(false);
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <TopBar>
            <ExitBtn onClick={handleLogoutBtn}>
              <FaPowerOff size={24} color="FF8B8B" />
            </ExitBtn>
          </TopBar>
          <Title>기업 방향성 관리</Title>
          <Subtitle>사내 구성원의 커리어 증진을 위한 기업 방향성을 설정하고 관리합니다.</Subtitle>
        </Header>

        {/* 현재 방향성 섹션 */}
        <Section>
          <SectionHeader>
            <SectionTitleWrapper>
              <IconWrapper>
                <Target color="white" size={24} />
              </IconWrapper>
              <SectionTitle>현재 기업 방향성</SectionTitle>
            </SectionTitleWrapper>
            {!isEditing && (
              <Button $variant="primary" onClick={handleEdit}>
                <Edit2 size={18} />
                수정
              </Button>
            )}
          </SectionHeader>

          <SectionContent>
            {!isEditing && currentDirection && (
              <FormGroup>
                <Label>상세 설명</Label>
                <DescriptionBox>{currentDirection.prompt}</DescriptionBox>
              </FormGroup>
            )}

            {isEditing && editForm && (
              <FormGroup>
                <Label>상세 설명</Label>
                <Textarea
                  value={editForm.prompt}
                  onChange={(e) => setEditForm((prev) => prev && { ...prev, prompt: e.target.value })}
                  placeholder="기업 방향성에 대한 상세한 설명을 입력하세요"
                />
                <ButtonGroup>
                  <Button onClick={handleCancel}>
                    <X size={18} />
                    취소
                  </Button>
                  <Button $variant="primary" onClick={handleSave}>
                    <Save size={18} />
                    저장
                  </Button>
                </ButtonGroup>
              </FormGroup>
            )}
          </SectionContent>
        </Section>

        {/* 방향성 히스토리 섹션 */}
        <Section>
          <HistorySection>
            <IconWrapper>
              <Clock color="white" size={24} />
            </IconWrapper>
            <SectionTitle>방향성 변경 내역</SectionTitle>
          </HistorySection>

          <div>
            {history.map((item) => (
              <HistoryItem key={item.directionId}>
                <HistoryHeader>
                  <HistoryMeta>
                    <MetaItem>{item.createdAt}</MetaItem>
                    <MetaItem>
                      <span>작성자:</span>
                      <span>관리자</span>
                    </MetaItem>
                    <StatusBadge $isActive={false}>비활성</StatusBadge>
                  </HistoryMeta>
                </HistoryHeader>
                <HistoryContent>{item.prompt}</HistoryContent>
              </HistoryItem>
            ))}
          </div>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default AdminPage;
