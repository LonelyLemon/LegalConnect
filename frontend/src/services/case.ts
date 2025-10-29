import axios from 'axios';
import { showError } from '../types/toast';

export const getUserCase = async () => {
  try {
    const response = await axios.get('/api/cases');
    return response.data.data;
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
