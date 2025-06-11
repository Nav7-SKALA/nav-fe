import api from './index';

export const signup = async (loginId: string, password: string, email: string, memberName: string, gender: string) => {
  const response = await api.post('/auth/signup', { loginId, password, email, memberName, gender }, { withCredentials: true });
  return response.data;
};

export const duplicate_Id = async (Id: string) => {
    const response = await api.post('/auth/duplicate-loginId', { Id }, { withCredentials: true });
    return response.data;
  };

export const duplicate_Email = async (email: string) => {
const response = await api.post('/auth/duplicate-email', { email }, { withCredentials: true });
return response.data;
};
  
export const make_code = async (email: string) => {
  const response = await api.post(`/auth/email/send?email=${encodeURIComponent(email)}`, null, { withCredentials: true });
  return response.data;
};

export const duplicate_code = async (email: string, code: string) => {
  const response = await api.post(
      `/auth/email/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
      null,
      { withCredentials: true }
  );
  return response.data;
};