import React from 'react';
import styled from 'styled-components';
import { MaleImg } from '../assets/common';

const RoleModelDetailPage = () => {
  const journeyData = [
    {
      project: '통신사 Digital Home Network NOC 구축',
      detail: {
        규모: '대형',
        역할: 'PM',
        수행연차: '12-15',
      },
    },
    {
      project: '통신사 G2(차세대) 구축',
      detail: {
        규모: '중형',
        역할: 'PM, PL',
        수행연차: '10-11',
      },
    },
    {
      project: '공공기관 AI 분석시스템 구축',
      detail: {
        규모: '대형',
        역할: 'PL',
        수행연차: '16-17',
      },
    },
    {
      project: '공공기관 AI 분석시스템 구축',
      detail: {
        규모: '대형',
        역할: 'PL',
        수행연차: '16-17',
      },
    },
  ];
  return (
    <PageWrapper>
      <Container>
        <LeftSection>
          {/* 프로필 정보 */}
          <ProfileImage src={MaleImg} />
          <Name>김현준 매니저</Name>
          <Divider />
          <Profile>
            <SectionTitle>Profile</SectionTitle>
            <Row>
              <strong>Job</strong>
              <span>Senior PM Engineer</span>
            </Row>
            <Row>
              <strong>Skill set</strong>
              <span>Infra PM, AI/Data Dev.</span>
            </Row>
            <Row>
              <strong>Tenure</strong>
              <span>20년차</span>
            </Row>
          </Profile>
          <ButtonWrapper>
            <TalkButton>대화하기</TalkButton>
          </ButtonWrapper>
        </LeftSection>

        <RightSection>
          <JourneyBox>
            <SectionTitle>Journey</SectionTitle>
            <ScrollableArea>
              <TimelineContainer>
                {journeyData.map((item, index) => (
                  <TimelineItem key={index}>
                    <ProjectCard>{item.project}</ProjectCard>
                    <ProjectLine />
                    <DetailBox>
                      <DetailRow>
                        <span>규모</span>
                        <span>{item.detail.규모}</span>
                      </DetailRow>
                      <DetailRow>
                        <span>역할</span>
                        <span>{item.detail.역할}</span>
                      </DetailRow>
                      <DetailRow>
                        <span>수행 연차</span>
                        <span>{item.detail.수행연차}</span>
                      </DetailRow>
                    </DetailBox>
                  </TimelineItem>
                ))}
              </TimelineContainer>
            </ScrollableArea>
          </JourneyBox>
          <DetailsBox>
            <SectionTitle>Details</SectionTitle>
            <ChartContainer>
              <div className="horizontal-line" />
              <CenterLabel>
                <LabelTopLeft>자격증</LabelTopLeft>
                <LabelTopRight>역량</LabelTopRight>
                <LabelBottomLeft>경험</LabelBottomLeft>
                <LabelBottomRight>도메인</LabelBottomRight>
              </CenterLabel>
              <Quadrant>
                <Label>
                  정보처리기사
                  <br />
                  AWS
                  <br />
                  SQLD
                </Label>
              </Quadrant>
              <Quadrant>
                <Label>
                  AIData Dev.
                  <br />
                  Infra PM
                </Label>
              </Quadrant>
              <Quadrant>
                <Label>
                  NVIDIA GTC
                  <br />
                  KubeCon
                </Label>
              </Quadrant>
              <Quadrant>
                <Label>
                  통신
                  <br />
                  공공
                </Label>
              </Quadrant>
            </ChartContainer>
          </DetailsBox>
        </RightSection>
      </Container>
    </PageWrapper>
  );
};

export default RoleModelDetailPage;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  padding: 1rem;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  background-color: rgba(255, 223, 223, 0.6);
  border-radius: 1.4rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 1200px;
  height: 80vh;
  gap: 2rem;
  align-items: stretch;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    height: 75vh; /* 중간 화면 */
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
    max-height: 90vh;
    height: auto;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 1rem;
    max-height: 90vh;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fffafa;
  border-radius: 1.4rem;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    flex: none;
    min-height: auto;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const RightSection = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    flex: none;
  }
`;

const ProfileImage = styled.img`
  width: min(12rem, 25vw);
  height: min(12rem, 25vw);
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: min(6rem, 30vw);
    height: min(6rem, 30vw);
  }
`;

const Name = styled.h2`
  text-align: center;
  margin: 1.8rem 0 1.8rem 0;
  font-weight: 700;
  color: #000;
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  flex-shrink: 0;
`;

const Divider = styled.div`
  width: 80%;
  height: 1px;
  background-color: #dfdfdf;
  margin: 0.5rem 0;
  flex-shrink: 0;
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 80%;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    flex: none;
  }
`;

const Row = styled.div`
  margin: 0.4rem 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  font-size: clamp(0.85rem, 2.5vw, 1rem);

  strong {
    flex-shrink: 0;
    min-width: fit-content;
  }

  span {
    text-align: right;
    word-break: break-word;
    flex-shrink: 1;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;

    span {
      text-align: left;
    }
  }
`;

const JourneyBox = styled.div`
  background: #fffafa;
  border-radius: 1.4rem;
  padding: 0.5rem 1.5rem;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    flex: none;
    min-height: 200px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const DetailsBox = styled.div`
  display: flex;
  flex-direction: column;
  background: #fffafa;
  border-radius: 1.4rem;
  padding: 0.5rem 1.5rem;
  flex: 1;
  min-height: 0;

  @media (max-width: 768px) {
    flex: none;
    min-height: 200px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: clamp(1rem, 3vw, 1.2rem);
  margin-bottom: 1rem;
  margin-top: 1rem;
  color: #000;
  font-weight: 700;
  flex-shrink: 0;
`;

const ButtonWrapper = styled.div`
  width: 80%;
  flex-shrink: 0;
  margin-top: auto;
  padding-top: 1rem;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const TalkButton = styled.button`
  width: 100%;
  padding: 1rem 1rem;
  background-color: #f88;
  color: white;
  border: none;
  border-radius: 0.8rem;
  font-weight: bold;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e66;
  }

  &:active {
    transform: translateY(1px);
  }
`;

// 새로운 ChartContainer - 전체 너비 사용
const ChartContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  width: 100%; /* 전체 너비 사용 */
  height: 280px; /* 적절한 높이 설정 */
  gap: 0;

  /* 중앙에 원 배치 */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(150px, 40%); /* 반응형 원 크기 */
    height: min(140px, 60%);
    border-radius: 50%;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background: #ffebeb;
    z-index: 1;
  }

  @media (max-width: 768px) {
    height: 240px;

    &::before {
      width: min(80px, 22%);
      height: min(80px, 22%);
    }
  }

  @media (max-width: 480px) {
    height: 200px;

    &::before {
      width: min(60px, 20%);
      height: min(60px, 20%);
    }
  }

  /* 수직선 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background-color: #aaa;
    z-index: 2;
  }

  /* 수평선 */
  & > .horizontal-line {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background-color: #aaa;
    z-index: 2;
  }
`;

const CenterLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(150px, 40%);
  height: min(140px, 60%);
  transform: translate(-50%, -50%);
  z-index: 2;
  pointer-events: none;
`;

const LabelItem = styled.div`
  position: absolute;
  font-size: clamp(0.7rem, 2vw, 0.9rem);
  font-weight: 600;
  color: #444;
`;

const LabelTopLeft = styled(LabelItem)`
  top: 30%;
  left: 30%;
  transform: translate(-50%, -50%);
`;

const LabelTopRight = styled(LabelItem)`
  top: 30%;
  left: 70%;
  transform: translate(-50%, -50%);
`;

const LabelBottomLeft = styled(LabelItem)`
  top: 70%;
  left: 30%;
  transform: translate(-50%, -50%);
`;

const LabelBottomRight = styled(LabelItem)`
  top: 70%;
  left: 70%;
  transform: translate(-50%, -50%);
`;

const Quadrant = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  position: relative;
  z-index: 2;
  font-size: clamp(0.7rem, 2vw, 0.9rem); /* 반응형 폰트 */
  font-weight: 600;
  text-align: center;
  color: #333;
  line-height: 1.2;
`;

const ScrollableArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  height: 80%;
  padding-right: 0.5rem;

  /* 스크롤바 커스터마이징 (선택사항) */
  &::-webkit-scrollbar {
    width: 0.4rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #f88;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ProjectLine = styled.div`
  position: absolute;
  left: 25%;
  bottom: 0;
  width: 2px;
  height: 1.5rem;
  background-color: #f88;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: stretch;
  gap: 1rem;
  position: relative;
  padding-bottom: 1.5rem;

  &:last-child ${ProjectLine} {
    display: none;
  }
`;

const ProjectCard = styled.div`
  background: linear-gradient(190deg, #ff9b9b 0%, #f7f7f7 100%);
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  color: black;
  font-weight: 600;
  width: clamp(160px, 20vw, 220px);
  word-break: keep-all; /* ✅ 단어 단위로 줄바꿈 */
  white-space: normal; /* ✅ 줄바꿈 허용 */
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #888;
  font-size: 0.9rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 220px;

  span:first-child {
    color: #aaa;
  }

  span:last-child {
    color: #444;
    font-weight: 500;
  }
`;
