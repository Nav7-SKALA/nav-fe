import api from './index';
import { ProjectFormDto } from '../types/project';

export const fetchProjectRoles = async () => {
  const response = await api.get('/projects/roles');
  return response.data.result;
};

export const fetchProjectSkillSets = async () => {
  const response = await api.get('/projects/skillSets');
  return response.data.result;
};

export const fetchProjectDomains = async () => {
  const response = await api.get('/projects/domains');
  return response.data.result;
};

export const initializeProjects = async (projects: ProjectFormDto[]) => {
  try {
    const response = await api.post('/profiles/me/projects', {
      projects,
    });
    return response.data;
  } catch (error) {
    console.error('프로젝트 전송 실패:', error);
    throw error;
  }
};
