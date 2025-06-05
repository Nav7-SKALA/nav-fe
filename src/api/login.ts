import api from './index';

export const login = async (loginId: string, password: string) => {
  const response = await api.post('/auth/login', { loginId, password }, { withCredentials: true });
  return response.data;
};
