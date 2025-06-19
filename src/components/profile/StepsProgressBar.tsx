import React from 'react';
import styled from 'styled-components';
import { FiBriefcase, FiLayers, FiSave } from 'react-icons/fi';

interface StepProgressCardProps {
  currentStep: string;
  completedSteps: string[];
}
const StepProgressCard = ({ currentStep, completedSteps }: StepProgressCardProps) => {
  const steps = ['project', 'experience', 'certificate'];
  const stepLabels = {
    project: '프로젝트',
    experience: '경험',
    certificate: '자격증',
  };

  const totalSteps = steps.length;
  const completedCount = completedSteps.length + (currentStep ? 1 : 0);
  const percentage = Math.round((completedCount / totalSteps) * 100);

  const getStepStatus = (step) => {
    if (step === currentStep) return 'current';
    return 'pending';
  };

  return (
    <ProgressCardWrapper>
      <ProgressCardHeader>
        <HeaderText>프로필 완성도</HeaderText>
        <ProgressPercentage>{percentage}%</ProgressPercentage>
      </ProgressCardHeader>

      <ProgressBar>
        <ProgressFill style={{ width: `${percentage}%` }} />
      </ProgressBar>

      <StepList>
        {steps.map((step) => {
          const Icon = {
            project: FiBriefcase,
            experience: FiLayers,
            certificate: FiSave,
          }[step];

          return (
            <StepItem key={step} status={getStepStatus(step)}>
              <StepItemContent>
                <Icon size={20} />
                <span>{stepLabels[step]}</span>
              </StepItemContent>
            </StepItem>
          );
        })}
      </StepList>
    </ProgressCardWrapper>
  );
};

export default StepProgressCard;

const ProgressCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const ProgressCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const HeaderText = styled.span`
  font-weight: 600;
  color: #606060;
`;

const ProgressPercentage = styled.span`
  color: #ff8b8b;
  font-weight: 700;
`;

const ProgressBar = styled.div`
  height: 8px;
  width: 100%;
  background: #e0e0e0;
  border-radius: 4px;
  margin: 0.3rem 0 1.2rem 0;
  overflow: hidden;
  position: relative;
  min-height: 8px;
`;

const ProgressFill = styled.div`
  height: 8px;
  // background: linear-gradient(90deg, #ff8b8b, #ff6b6b);
  background: #ff8b8b;
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const StepItem = styled.div<{ status: 'current' | 'pending' }>`
  padding: 0.6rem 1rem;
  border-radius: 10px;
  transition: all 0.2s ease;
  font-weight: ${({ status }) => (status === 'current' ? '600' : '500')};
  color: ${({ status }) => (status === 'current' ? '#f57c00' : '#606060')};
  background-color: ${({ status }) => (status === 'current' ? '#fff3e0' : '#f4f4f4')};
  border: ${({ status }) => (status === 'current' ? '2px solid #ffcc02' : '2px solid transparent')};
`;

const StepItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 아이콘과 텍스트 간 여백 */
  font-size: 1rem;
`;
