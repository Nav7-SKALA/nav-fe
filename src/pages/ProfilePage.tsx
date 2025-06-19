import React, { useState } from 'react';
import styled from 'styled-components';
import { LoginBackgroundImg } from '../assets/main';
import { NaviLogo } from '../assets/common';

import ProfileFormSteps from '../components/profile/ProfileFormSteps';
import StepProgressBar from '../components/profile/StepsProgressBar';
import ProfileSection from '../components/profile/ProfileSection';
import { ProfileFormDto } from '../types/profile';

const steps = ['project', 'experience', 'certificate'];

const ProfilePage = () => {
  const [currentStep, setCurrentStep] = useState('project');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [profileSectionData, setProfileSectionData] = useState<ProfileFormDto>({
    years: 0,
    skillSetIds: [],
    profileImg: '',
  });

  const handleNextStep = () => {
    const curIndex = steps.indexOf(currentStep);
    if (curIndex < steps.length - 1) {
      const nextStep = steps[curIndex + 1];
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep(nextStep);
    }
  };
  return (
    <PageWrapper>
      <Logo />
      <ContentContainer>
        <LeftCard>
          <ProfileFormSteps
            currentStep={currentStep}
            onNextStep={handleNextStep}
            profileSectionData={profileSectionData}
          />
        </LeftCard>
        <RightCard>
          <ProfileSection profileData={profileSectionData} onChange={setProfileSectionData} />
          <StepProgressBar currentStep={currentStep} completedSteps={completedSteps} />
        </RightCard>
      </ContentContainer>
    </PageWrapper>
  );
};

export default ProfilePage;

const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-image: url(${LoginBackgroundImg});
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1130px;
  max-height: 600px;
  gap: 2rem;
  margin: 0 auto;
  align-items: stretch;
`;

const LeftCard = styled.div`
  flex: 2.3;
  background: white;
  border-radius: 25px;
  padding: 2.5rem 4.5rem 2.5rem 4.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  overflow-y: auto;
`;

const RightCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* ✅ 위, 아래로 고르게 배치 */
  gap: 0.8rem;
  min-width: 0;

  /* 첫 번째 자식 요소 (ProfileCard) */
  > *:nth-child(1) {
    flex: 1.7; /* 두 번째 요소의 2배 높이 */
    background: white;
    border-radius: 25px;
    padding: 0.8rem 1.5rem 0.8rem 1.5rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    min-height: 0;
    width: 100%;
    min-width: 0;
    overflow: hidden;
  }

  /* 두 번째 자식 요소 (StepProgressCard) */
  > *:nth-child(2) {
    flex: 1; /* 기본 높이 */
    background: white;
    border-radius: 25px;
    padding: 1.5rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    min-height: 0;
    width: 100%;
  }
`;

const Logo = styled(NaviLogo)`
  position: absolute;
  top: 2rem;
  right: 3rem;
  width: 5rem;
  height: 5rem;
  z-index: 10;

  @media (min-width: 1920px) {
    width: 7rem;
    height: 7rem;
  }
`;
