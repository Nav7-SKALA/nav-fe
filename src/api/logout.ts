import api from './index';

export const logout = async () => {
  const response = await api.post('/member/logout');
  return response.data;
};
