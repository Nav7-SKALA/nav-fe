import React from 'react';
import styled from 'styled-components';
import ProjectCard from '../card/ProjectCard';
import { Project, ProjectFormDto } from '../../../types/project';
import { useEncryptedStorage } from '../../../hooks/useEncryptedStorage';

interface ProjectStepProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  projectsDto: ProjectFormDto[];
  setProjectsDto: React.Dispatch<React.SetStateAction<ProjectFormDto[]>>;
}
const ProjectStep = ({ projects, setProjects, projectsDto, setProjectsDto }: ProjectStepProps) => {
  const { removeEncryptedItemByIndex: removeEncryptedProjectByIndex } =
    useEncryptedStorage<ProjectFormDto>('encrypted-projects');

  const handleDeleteProject = (index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
    setProjectsDto((prev) => prev.filter((_, i) => i !== index));
    removeEncryptedProjectByIndex(index);
  };

  return (
    <ProjectSection>
      <ProjectList>
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} onDelete={() => handleDeleteProject(index)} />
        ))}
      </ProjectList>

      {projects.length === 0 && (
        <EmptyState>
          <EmptyMessage>등록된 프로젝트가 없습니다.</EmptyMessage>
          <EmptySubMessage>+ 버튼을 클릭하여 프로젝트를 추가해보세요.</EmptySubMessage>
        </EmptyState>
      )}
    </ProjectSection>
  );
};

const ProjectSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ProjectList = styled.div`
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

export default ProjectStep;
