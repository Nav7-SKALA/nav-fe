import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CareerReveal from '../components/career/CareerReveal';
import CareerStepper from '../components/career/CareerStepper';

import ProjectCard from '../components/profile/card/ProjectCard';
import ExperienceCard from '../components/profile/card/ExperienceCard';
import CertificationCard from '../components/profile/card/CertificationCard';

import { Project } from '../types/project';
import { Experience } from '../types/experience';
import { Certification } from '../types/certification';

import { fetchProjectAll } from '../api/project';
import { fetchExperienceAll } from '../api/experience';
import { fetchCertificationAll } from '../api/certi';
import { mapProjectResponseToProject, mapCertificationResponseToCertification } from '../utils/ProjectMappers';

const CareerIntroContainer = styled.div`
  padding: 3rem;
`;

const CareerIntroPage = () => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [certificationList, setCertificationList] = useState<Certification[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchDataAll = async () => {
      try {
        const [projectResponse, experienceResponse, certificationResponse] = await Promise.all([
          fetchProjectAll(),
          fetchExperienceAll(),
          fetchCertificationAll(),
        ]);
        const mappedProjects = projectResponse.map(mapProjectResponseToProject);
        setProjectList(mappedProjects);

        const experienceData: Experience[] = experienceResponse.map((item: any) => ({
          id: item.experienceId,
          experienceName: item.experienceName,
          experienceDescribe: item.experienceDescribe,
          experiencedAt: item.experiencedAt,
        }));
        setExperienceList(experienceData);

        const mappedCertifications = certificationResponse.map(mapCertificationResponseToCertification);
        setCertificationList(mappedCertifications);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchDataAll();
  }, []);

  const sections = [
    {
      title: '📁 프로젝트',
      items: projectList,
      renderItem: (item: Project, index: number) => <ProjectCard key={item.id} project={item} />,
    },
    {
      title: '💡 경험',
      items: experienceList,
      renderItem: (item: Experience, index: number) => <ExperienceCard key={item.id} experience={item} />,
    },
    {
      title: '📜 자격증',
      items: certificationList,
      renderItem: (item: Certification, index: number) => <CertificationCard key={item.id} certification={item} />,
    },
  ];

  return (
    <CareerIntroContainer>
      {!showDetails ? (
        <CareerReveal
          projectCount={projectList.length}
          experienceCount={experienceList.length}
          certificationCount={certificationList.length}
        />
      ) : (
        <CareerStepper<any> sections={sections} onComplete={() => navigate('/main')} />
      )}
    </CareerIntroContainer>
  );
};

export default CareerIntroPage;
