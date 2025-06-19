import React from 'react';
import styled from 'styled-components';
import { FiTrash2 } from 'react-icons/fi';
import { Experience } from '../../../types/experience';

interface ExperienceCardProps {
  experience: Experience;
  onDelete: (id: number) => void;
}

const ExperienceCard = ({ experience, onDelete }: ExperienceCardProps) => {
  return (
    <CardWrapper>
      <CardHeader>
        <ExperienceName>
          {`[${experience.experienceName}]`} <ExperienceDate>{experience.experiencedAt}</ExperienceDate>
        </ExperienceName>
        <ActionButtons>
          <IconButton onClick={() => onDelete(experience.id)} $isDelete>
            <FiTrash2 size={18} />
          </IconButton>
        </ActionButtons>
      </CardHeader>

      <ExperienceDetails>
        <DetailItem>
          {(experience.experienceDescribe ?? '')
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line, index) => (
              <li key={index}>{line.trim()}</li>
            ))}
        </DetailItem>
      </ExperienceDetails>
    </CardWrapper>
  );
};
export default ExperienceCard;

const CardWrapper = styled.div`
  border: 1px solid rgba(94, 86, 86, 0.5);
  border-radius: 0.75rem;
  padding: 1.5rem;
  background-color: #ffffff;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ExperienceName = styled.h3`
  display: flex;
  align-items: flex-end;
  gap: 0.3rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #606060;
  margin-bottom: 0.25rem;
  margin-top: 0rem;
`;

const ExperienceDate = styled.span`
  font-size: 0.6rem;
  color: #606060;
  font-weight: 400;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.2rem;
`;

interface IconButtonProps {
  $isDelete?: boolean;
}

const IconButton = styled.button<IconButtonProps>`
  padding: 0.375rem;
  color: ${(props) => (props.$isDelete ? '#ff7272' : '#606060')};
  background: none;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition:
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: ${(props) => (props.$isDelete ? '#ff7272' : '#606060')};
    transform: scale(1.15);
  }
`;

const ExperienceDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailItem = styled.div`
  font-size: 0.875rem;
  color: #606060;

  li {
    line-height: 1.6; /* ✅ 줄 간격 */
    margin-bottom: 0.25rem; /* ✅ 아래 여백 (optional) */
    position: relative;
  }
`;
