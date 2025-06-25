import React from 'react';
import styled from 'styled-components';
import { FiTrash2 } from 'react-icons/fi';
import { Project } from '../../../types/project';

interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
}

const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  return (
    <CardWrapper>
      <CardHeader>
        <ProjectTitle>
          {project.title} <ProjectPeriod>{project.period}</ProjectPeriod>
        </ProjectTitle>
        {onDelete && (
          <ActionButtons>
            <IconButton onClick={onDelete} $isDelete>
              <FiTrash2 size={18} />
            </IconButton>
          </ActionButtons>
        )}
      </CardHeader>

      <ProjectDetails>
        <DetailItem>
          도메인: <DetailValue>{project.domain}</DetailValue>
        </DetailItem>
        <DetailItem>
          프로젝트 규모: <DetailValue>{project.projectSize}</DetailValue>
        </DetailItem>
        <DetailItem>
          역할: <DetailValue>{project.role.join(', ')}</DetailValue>
        </DetailItem>
      </ProjectDetails>

      {project.skills?.length > 0 && (
        <SkillTags>
          {project.skills.map((skill, index) => (
            <SkillTag key={index}>{skill}</SkillTag>
          ))}
        </SkillTags>
      )}
    </CardWrapper>
  );
};
export default ProjectCard;

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

const ProjectTitle = styled.h3`
  display: flex;
  align-items: flex-end;
  gap: 0.3rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #606060;
  margin-bottom: 0.25rem;
  margin-top: 0rem;
`;

const ProjectPeriod = styled.span`
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

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  font-size: 0.875rem;
  color: #606060;
`;

const DetailValue = styled.span`
  color: #000000; /* 검정 */
  font-weight: 500; /* Optional: 살짝 강조 */
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span`
  padding: 0.5rem 1rem;
  background-color: #ff7d7d;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: 30px;
`;
