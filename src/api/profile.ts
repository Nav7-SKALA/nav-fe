import api from './index';
import { ProfileFormDto } from '../types/profile';

export const initializeProfile = async (profile: ProfileFormDto) => {
  try {
    const response = await api.post('/profiles/initialize', profile);
    return response.data;
  } catch (error) {
    console.error('프로필 설정 실패', error);
    throw error;
  }
};
