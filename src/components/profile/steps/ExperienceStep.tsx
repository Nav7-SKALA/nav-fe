import React from 'react';
import styled from 'styled-components';
import ExperienceCard from '../card/ExperienceCard';
import { Experience } from '../../../types/experience';
import { useEncryptedStorage } from '../../../hooks/useEncryptedStorage';

interface ExperienceStepProps {
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
}

const ExperienceStep = ({ experiences, setExperiences }: ExperienceStepProps) => {
  const { removeEncryptedItemByIndex: removeEncryptedExperienceByIndex } =
    useEncryptedStorage<Experience>('encrypted-experiences');
  const handleDeleteExperience = (index: number) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
    removeEncryptedExperienceByIndex(index);
  };

  return (
    <ExperienceSection>
      <ExperienceList>
        {experiences.map((experience, index) => (
          <ExperienceCard key={index} experience={experience} onDelete={() => handleDeleteExperience(index)} />
        ))}
      </ExperienceList>

      {experiences.length === 0 && (
        <EmptyState>
          <EmptyMessage>등록된 경험이 없습니다.</EmptyMessage>
          <EmptySubMessage>+ 버튼을 클릭하여 경험을 추가해보세요.</EmptySubMessage>
        </EmptyState>
      )}
    </ExperienceSection>
  );
};

const ExperienceSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

const EmptyMessage = styled.p`
  color: #606060;
  margin-bottom: 0.25rem;
`;

const EmptySubMessage = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
`;

export default ExperienceStep;
