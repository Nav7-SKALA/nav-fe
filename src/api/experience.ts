import api from './index';
import { ExperienceDto } from '../types/experience';

export const initializeExperience = async (experiences: ExperienceDto[]) => {
  try {
    const response = await api.post('/profiles/me/experience', {
      experiences,
    });
    return response.data;
  } catch (error) {
    console.error('경험 전송 실패', error);
    throw error;
  }
};

export const fetchExperienceAll = async () => {
  const response = await api.get('/profiles/me/experiences/all');
  return response.data.result;
};
