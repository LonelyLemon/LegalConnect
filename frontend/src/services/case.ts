import axios from 'axios';
import { showError } from '../types/toast';

export const getUserCase = async () => {
  try {
    const response = await axios.get('/booking/cases/me');
    const payload = response?.data?.data ?? response?.data ?? [];
    return payload;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch cases failed';
    showError('Failed to fetch cases', message);
    throw new Error(message);
  }
};
