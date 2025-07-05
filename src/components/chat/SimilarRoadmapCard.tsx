import React from 'react';
import styled from 'styled-components';
import {
  SimilarRoadmaps,
  SimilarRoadmapProject,
  SimilarRoadmapExperience,
  SimilarRoadmapCertification,
} from '../../types/roadmap';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  max-width: 65rem;
  margin: 0 auto;
`;

const FlowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const SectionCard = styled.div<{ bgColor: string; borderColor: string }>`
  background: ${(props) => props.bgColor || '#f8fafc'};
  border-radius: 1rem;
  padding: 0.8rem;
  min-width: 10rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.borderColor || '#e5e7eb'};
  position: relative;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #606060;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const Connector = styled.div`
  width: 2px;
  height: 1rem;
  background: #d1d5db;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    bottom: -4px;
    left: -3px;
    width: 8px;
    height: 8px;
    background: #9ca3af;
    border-radius: 50%;
  }
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const ProjectItem = styled.div`
  // background: linear-gradient(291deg, #ff9b9b 0%, #f7f7f7 100%);
  background: #ffdada;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #ebd9d9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 0.8rem;
  text-align: left;
  position: relative;
`;

const ProjectHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  margin-bottom: 0.5rem;
  gap: 0.2rem;
`;

const Period = styled.span`
  color: 606060;
  font-size: 0.6rem;
  font-weight: 700;
`;

const ProjectName = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #606060;
`;

const RoleInfo = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const Role = styled.span`
  color: #848484;
  border-radius: 0.5rem;
  font-size: 11px;
  font-weight: 500;
`;

const Job = styled.span`
  color: #848484;
  border-radius: 0.5rem;
  font-size: 11px;
  font-weight: 500;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -0.4rem;
  left: 0;
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 0.5rem;
  font-size: 10px;
  white-space: pre-wrap;
  z-index: 10;
  display: none;
  ${ProjectItem}:hover & {
    display: block;
  }
`;

const SimpleList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const SimpleItem = styled.div`
  // background: linear-gradient(291deg, #ff9b9b 0%, #f7f7f7 100%);
  background: #ffdada;
  color: #606060;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ebd9d9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

export interface SimilarRoadmapCardProps {
  data: SimilarRoadmaps;
}

const isProjectItem = (item: any): item is { project: SimilarRoadmapProject[] } => 'project' in item;
const isExperienceItem = (item: any): item is { experience: SimilarRoadmapExperience[] } => 'experience' in item;
const isCertificationItem = (item: any): item is { certification: SimilarRoadmapCertification[] } =>
  'certification' in item;

const SimilarRoadmapCard = ({ data }: SimilarRoadmapCardProps) => {
  // 데이터 구조 분리
  const projects = data.find(isProjectItem)?.project || [];
  const experiences = data.find(isExperienceItem)?.experience || [];
  const certifications = data.find(isCertificationItem)?.certification || [];

  return (
    <Container>
      <FlowContainer>
        {/* 프로젝트 섹션 */}
        {projects.length > 0 && (
          <>
            <SectionCard bgColor="#fef2f2" borderColor="#fecaca">
              <SectionTitle>Project</SectionTitle>
              <ProjectList>
                {projects.map((project, index) => (
                  <ProjectItem key={index}>
                    <ProjectHeader>
                      <ProjectName>[{project.name}]</ProjectName>
                      <Period>{project.period}</Period>
                    </ProjectHeader>
                    <RoleInfo>
                      <Role>{project.role},</Role>
                      <Job>{project.job}</Job>
                    </RoleInfo>
                    <Tooltip>{project.detail}</Tooltip>
                  </ProjectItem>
                ))}
              </ProjectList>
            </SectionCard>
            {(experiences.length > 0 || certifications.length > 0) && <Connector />}
          </>
        )}

        {/* 경험 섹션 */}
        {experiences.length > 0 && (
          <>
            <SectionCard bgColor="#fef2f2" borderColor="#fecaca">
              <SectionTitle>Experience</SectionTitle>
              <SimpleList>
                {experiences.map((exp, index) => (
                  <SimpleItem key={index}>{exp.name}</SimpleItem>
                ))}
              </SimpleList>
            </SectionCard>
            {certifications.length > 0 && <Connector />}
          </>
        )}

        {/* 자격증 섹션 */}
        {certifications.length > 0 && (
          <SectionCard bgColor="#fef2f2" borderColor="#fecaca">
            <SectionTitle>Certification</SectionTitle>
            <SimpleList>
              {certifications.map((cert, index) => (
                <SimpleItem key={index}>{cert.name}</SimpleItem>
              ))}
            </SimpleList>
          </SectionCard>
        )}
      </FlowContainer>
    </Container>
  );
};

export default SimilarRoadmapCard;
