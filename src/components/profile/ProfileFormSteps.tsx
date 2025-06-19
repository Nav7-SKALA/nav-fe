import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProjectStep from './steps/ProjectStep';
import ExperienceStep from './steps/ExperienceStep';
import CertificateStep from './steps/CertificateStep';
import InputModal from './modal/InputModal';
import ProjectForm from './modal/ProjectForm';
import { AiOutlinePlus } from 'react-icons/ai';
import ExperienceForm from './modal/ExperienceForm';
import CertificationForm from './modal/CertificationForm';
import { Project, ProjectFormDto } from '../../types/project';
import { Experience, ExperienceDto } from '../../types/experience';
import { Certification, CertificationDto } from '../../types/certification';
import { ProfileFormDto } from '../../types/profile';
import {
  getDomainLabelById,
  mapRoleIdsToLabels,
  mapSkillIdsToLabels,
  getProjectSize,
} from '../../utils/ProjectMappers';
import { OptionType } from '../common/CustomSelect';
import { fetchProjectSkillSets, fetchProjectRoles, fetchProjectDomains, initializeProjects } from '../../api/project';
import { initializeExperience } from '../../api/experience';
import { initializeProfile } from '../../api/profile';
import { fetchCertifications, initializeCertifications } from '../../api/certi';
import { useEncryptedStorage } from '../../hooks/useEncryptedStorage';

interface ProfileFormStepsProps {
  currentStep: string;
  onNextStep: () => void;
  profileSectionData: ProfileFormDto;
}

const ProfileFormSteps = ({ currentStep, onNextStep, profileSectionData }: ProfileFormStepsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem('current-step');
    return savedStep ? Number(savedStep) : 0;
  });
  const stepTitles = ['프로젝트', '경험', '자격증'];

  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certification[]>([]);

  const [roleOptions, setRoleOptions] = useState<OptionType[]>([]);
  const [skillOptions, setSkillOptions] = useState<OptionType[]>([]);
  const [domainOptions, setDomainOptions] = useState<OptionType[]>([]);
  const [certiOptions, setCertiOptions] = useState<OptionType[]>([]);

  const [projectsDto, setProjectsDto] = useState<ProjectFormDto[]>([]);
  const [certificatesDto, setCertificatesDto] = useState<CertificationDto[]>([]);

  const navigate = useNavigate();

  const {
    saveEncryptedData: saveEncryptedProjects,
    loadEncryptedData: loadEncryptedProjects,
    removeEncryptedData: removeEncryptedProjects,
  } = useEncryptedStorage<ProjectFormDto>('encrypted-projects');

  const {
    saveEncryptedData: saveEncryptedExperiences,
    loadEncryptedData: loadEncryptedExperiences,
    removeEncryptedData: removeEncryptedExperiences,
  } = useEncryptedStorage<Experience>('encrypted-experiences');

  const {
    saveEncryptedData: saveEncryptedCertificates,
    loadEncryptedData: loadEncryptedCertificates,
    removeEncryptedData: removeEncryptedCertificates,
  } = useEncryptedStorage<CertificationDto>('encrypted-certificates');

  useEffect(() => {
    localStorage.setItem('current-step', step.toString());
  }, [step]);

  useEffect(() => {
    const fetchOptionsAndProjects = async () => {
      try {
        const [roles, skills, domains] = await Promise.all([
          fetchProjectRoles(),
          fetchProjectSkillSets(),
          fetchProjectDomains(),
        ]);

        const roleOpts = roles.map((r) => ({ value: r.roleId, label: r.roleName }));
        const skillOpts = skills.map((s) => ({ value: s.skillSetId, label: `${s.skillCode}: ${s.skillSetName}` }));
        const domainOpts = domains.map((d) => ({ value: d.domainId, label: d.domainName }));

        setRoleOptions(roleOpts);
        setSkillOptions(skillOpts);
        setDomainOptions(domainOpts);

        // 옵션 로딩이 끝난 후에 복호화
        const saved = loadEncryptedProjects();
        setProjectsDto(saved);

        const convertedProjects = saved.map((data) => ({
          id: Date.now() + Math.random(),
          title: `[${data.projectName}]`,
          period: `${data.startYear}년차-${data.endYear}년차`,
          domain: getDomainLabelById(data.domainId, domainOpts),
          projectSize: getProjectSize(data.projectSize),
          role: mapRoleIdsToLabels(data.role, roleOpts),
          skills: mapSkillIdsToLabels(data.skillSetIds, skillOpts),
        }));

        setProjects(convertedProjects);
      } catch (err) {
        console.error('옵션 또는 프로젝트 불러오기 실패:', err);
      }
    };

    fetchOptionsAndProjects();
  }, []);

  useEffect(() => {
    const fetchCertificatesList = async () => {
      try {
        const [certi] = await Promise.all([fetchCertifications()]);

        const certiOpts = certi.map((c) => ({ value: c.certificationId, label: c.certificationName }));

        setCertiOptions(certiOpts);

        // 옵션 로딩이 끝난 후에 복호화
        const saved = loadEncryptedCertificates();
        setCertificatesDto(saved);

        const convertedCertificates = saved.map((data) => ({
          id: Date.now() + Math.random(),
          name: `[${certiOpts.find((c) => c.value === data.certificationId)?.label ?? 'Unknown'}]`,
          acquisitedAt: data.acquisitionDate,
        }));

        setCertificates(convertedCertificates);
      } catch (err) {
        console.error('옵션 또는 프로젝트 불러오기 실패:', err);
      }
    };

    fetchCertificatesList();
  }, []);

  useEffect(() => {
    const saved = loadEncryptedExperiences();
    setExperiences(saved);
  }, []);

  const steps = [
    <ProjectStep
      projects={projects}
      setProjects={setProjects}
      projectsDto={projectsDto}
      setProjectsDto={setProjectsDto}
    />,
    <ExperienceStep experiences={experiences} setExperiences={setExperiences} />,
    <CertificateStep
      certificates={certificates}
      setCertificates={setCertificates}
      certificatesDto={certificatesDto}
      setCertificatesDto={setCertificatesDto}
    />,
  ];

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleProjectSubmit = (data: ProjectFormDto) => {
    const uiProject: Project = {
      id: Date.now(),
      title: `[${data.projectName}]`,
      period: `${data.startYear}년차-${data.endYear}년차`,
      domain: getDomainLabelById(data.domainId, domainOptions),
      projectSize: getProjectSize(data.projectSize),
      role: mapRoleIdsToLabels(data.role, roleOptions),
      skills: mapSkillIdsToLabels(data.skillSetIds, skillOptions),
    };

    const updatedProjects = [...projects, uiProject];
    const updatedProjectsDto = [...projectsDto, data];

    setProjects(updatedProjects);
    setProjectsDto(updatedProjectsDto);
    setIsModalOpen(false);

    saveEncryptedProjects(updatedProjectsDto);
  };

  const handleExperienceSubmit = (data: ExperienceDto) => {
    const experience: Experience = {
      id: Date.now(), // 또는 uuid()
      experienceName: data.experienceName,
      experienceDescribe: data.experienceDescribe,
      experiencedAt: data.experiencedAt,
    };
    const updated = [...experiences, experience];
    setExperiences(updated);
    setIsModalOpen(false);

    saveEncryptedExperiences(updated);
  };

  const handleCertificationSubmit = (data: CertificationDto) => {
    const certiLabel = certiOptions.find((c) => c.value === data.certificationId)?.label ?? 'Unknown';
    const uiCerti: Certification = {
      id: Date.now(),
      name: `[${certiLabel}]`,
      acquisitedAt: data.acquisitionDate,
    };
    const updatedCertificates = [...certificates, uiCerti];
    const updatedCertificatesDto = [...certificatesDto, data];

    setCertificates(updatedCertificates);
    setCertificatesDto(updatedCertificatesDto);
    setIsModalOpen(false);

    saveEncryptedCertificates(updatedCertificatesDto);
  };

  const handleStepNext = async () => {
    if (step === 0) {
      try {
        await initializeProjects(projectsDto);
      } catch (error) {
        alert('프로젝트 업로드 실패');
        return;
      }
      removeEncryptedProjects(); // 프로젝트 단계 → 다음 단계일 때만 제거
    } else if (step === 1) {
      try {
        const experiencesDto: ExperienceDto[] = experiences.map((exp) => ({
          experienceName: exp.experienceName,
          experienceDescribe: exp.experienceDescribe,
          experiencedAt: exp.experiencedAt,
        }));
        await initializeExperience(experiencesDto);
      } catch (error) {
        alert('경험 업로드 실패');
        return;
      }
      removeEncryptedExperiences();
    } else if (step === 2) {
      try {
        await initializeCertifications(certificatesDto);
        removeEncryptedCertificates();
        await initializeProfile(profileSectionData);
        localStorage.removeItem('current-step');
        navigate('/main');
      } catch (error) {
        alert('자격증 업로드 실패');
        return;
      }
    }

    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      onNextStep();
    }
  };

  return (
    <StepContainer>
      <StepHeader>
        <h2>Information</h2>
        <Divider />
        <SectionHeader>
          <SectionTitle>{stepTitles[step]}</SectionTitle>
          <AddButton>
            <AiOutlinePlus onClick={handleAddItem} size={'12px'} />
          </AddButton>

          {isModalOpen && (
            <InputModal title={stepTitles[step]} onClose={() => setIsModalOpen(false)}>
              {step === 0 && (
                <ProjectForm
                  onSubmit={handleProjectSubmit}
                  roleOptions={roleOptions}
                  skillOptions={skillOptions}
                  domainOptions={domainOptions}
                />
              )}
              {step === 1 && <ExperienceForm onSubmit={handleExperienceSubmit} />}
              {step === 2 && <CertificationForm onSubmit={handleCertificationSubmit} certiOptions={certiOptions} />}
            </InputModal>
          )}
        </SectionHeader>
      </StepHeader>

      <StepContentWrapper>{steps[step]}</StepContentWrapper>

      <ButtonRow>
        <Button onClick={() => setStep((prev) => prev - 1)}>이전</Button>
        {step < steps.length - 1 ? (
          <Button onClick={handleStepNext}>다음</Button>
        ) : (
          <Button onClick={handleStepNext}>제출하기</Button>
        )}
      </ButtonRow>
    </StepContainer>
  );
};

export default ProfileFormSteps;

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-height: 0;
`;

const StepHeader = styled.div`
  margin-bottom: 0.5rem;
  flex-shrink: 0;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  span {
    color: #888;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #dfdfdf; /* 연한 회색 */
  margin: 0;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #606060;
`;

const AddButton = styled.button`
  width: 1.5rem;
  height: 1.5rem;
  background-color: #ffffff;
  border: 1px solid #dfdfdf;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606060;
  font-size: 1.25rem;
  font-weight: 300;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const StepContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  // padding-right: 0.5rem; /* optional: 스크롤바 공간 고려 */
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  background-color: #ff8b8b;
  color: #ffffff;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  &:hover {
    background-color: #ff9999;
  }
`;
