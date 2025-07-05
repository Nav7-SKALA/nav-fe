import React from 'react';
import styled from 'styled-components';
import { Roadmaps } from '../../types/roadmap';

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

const SectionCard = styled.div`
  background: #fef2f2;
  border-radius: 1rem;
  padding: 0.8rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #fecaca;
  position: relative;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #606060;
  margin: 0 0 0.5rem 0;
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
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const ProjectItem = styled.div`
  // background: linear-gradient(291deg, #ff9b9b 0%, #f7f7f7 100%);
  background: #ffdada;
  border-radius: 0.5rem;
  border: 1px solid #ebd9d9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 0.8rem;
  text-align: left;
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

const DetailText = styled.div`
  font-size: 0.75rem;
  color: #555;
  margin-top: 0.3rem;
`;

export interface RoadmapCardProps {
  data: Roadmaps[];
}

const RoadmapCard = ({ data }: RoadmapCardProps) => {
  return (
    <Container>
      <FlowContainer>
        {/* 프로젝트 섹션 */}
        {data.length > 0 && (
          <>
            <SectionCard>
              <SectionTitle>Project</SectionTitle>
              <ProjectList>
                {data.map((item, index) => (
                  <React.Fragment key={index}>
                    <ProjectItem key={index}>
                      <ProjectHeader>
                        <ProjectName>[{item.project}]</ProjectName>
                        <Period>{item.period}</Period>
                      </ProjectHeader>
                      <DetailText>
                        <strong>Role:</strong> {item.role} / {item.job}
                      </DetailText>
                      <DetailText>
                        <strong>Key Skills:</strong> {item.key_skills}
                      </DetailText>
                      <DetailText>
                        <strong>Growth Focus:</strong> {item.growth_focus}
                      </DetailText>
                    </ProjectItem>
                    {index < data.length - 1 && <Connector />}
                  </React.Fragment>
                ))}
              </ProjectList>
            </SectionCard>
          </>
        )}
      </FlowContainer>
    </Container>
  );
};

export default RoadmapCard;
