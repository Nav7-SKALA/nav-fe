import api from './index';
import { Direction } from '../types/direction';

export const fetchDirection = async () => {
  const response = await api.get('/directions');
  return response.data.result;
};

export const fetchDirectionsAll = async () => {
  const response = await api.get('/directions/all');
  const data = response.data.result.slice(0, -1);
  return data.reverse();
};

export const createDirection = async (prompt: string): Promise<Direction> => {
  const response = await api.post<Direction>('/directions/add', { prompt });
  return response.data;
};
