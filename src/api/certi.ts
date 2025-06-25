import api from './index';
import { CertificationDto } from '../types/certification';

export const fetchCertifications = async () => {
  const response = await api.get('/certifications');
  return response.data.result;
};

export const initializeCertifications = async (certifications: CertificationDto[]) => {
  try {
    const response = await api.post('/profiles/me/certifications', {
      certifications,
    });
    return response.data;
  } catch (error) {
    console.error('자격증 추가 실패', error);
    throw error;
  }
};

export const fetchCertificationAll = async () => {
  const response = await api.get('/profiles/me/certifications/all');
  return response.data.result;
};
