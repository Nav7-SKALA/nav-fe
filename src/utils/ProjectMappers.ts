import { OptionType } from '../components/common/CustomSelect';
import { CertificationResponse, Certification } from '../types/certification';
import { Project, ProjectResponse } from '../types/project';

// 공통 매퍼 함수 (id -> label)
export const getLabelById = (id: string | number, options: OptionType[]): string => {
  const found = options.find((opt) => opt.value === id);
  return found ? String(found.label) : '알 수 없음';
};

// roleId List -> roleLabel List
export const mapRoleIdsToLabels = (roleIds: (string | number)[], roleOptions: OptionType[]): string[] => {
  return roleIds.map((id) => getLabelById(id, roleOptions));
};

// skillSetId List -> skillSetLabel List
export const mapSkillIdsToLabels = (skillIds: (string | number)[], skillOptions: OptionType[]): string[] => {
  return skillIds.map((id) => getLabelById(id, skillOptions));
};

// domain Id -> Label
export const getDomainLabelById = (id: string | number | null, domainOptions: OptionType[]): string => {
  if (id === null) return '없음';
  return getLabelById(id, domainOptions);
};

export const getProjectSize = (projectSize: string | number) => {
  switch (projectSize) {
    case 'NULL':
      return '없음';
    case 'SMALL':
      return '(소형) 20억 미만';
    case 'MEDIUM_SMALL':
      return '(중소형) 20억 이상~50억 미만';
    case 'MEDIUM':
      return '(중형) 50억 이상~100억 미만';
    case 'LARGE':
      return '(대형) 100억 이상~500억 미만';
    case 'EXTRA_LARGE':
      return '(초대형) 500억 이상';
    default:
      return '없음';
  }
};

export const mapProjectResponseToProject = (data: ProjectResponse): Project => ({
  id: data.projectId,
  title: `[${data.projectName}]`,
  period: `${data.startYear}년차 ~ ${data.endYear}년차`,
  domain: data.domainName,
  projectSize: data.projectSize,
  role: data.roles,
  skills: data.skillSets,
});

export const mapCertificationResponseToCertification = (data: CertificationResponse): Certification => ({
  id: data.certificationId,
  name: `[${data.certificationName}]`,
  acquisitedAt: data.acquisitionDate,
});
