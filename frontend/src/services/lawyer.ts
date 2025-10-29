import axios from 'axios';
import { showError } from '../types/toast';

export const getPopularLawyers = async () => {
  try {
    const response = await axios.get('/lawyer/profiles', {
      // params: { sort: 'average_rating', order: 'desc' },
    });
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch lawyers failed';
    showError('Failed to load lawyers', message);
    throw new Error(message);
  }
};

export const getLawyerById = async (id: number) => {
  try {
    const response = await axios.get(`/api/lawyer_profiles/${id}`);
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch lawyer failed';
    showError('Failed to load lawyer', message);
    throw new Error(message);
  }
};

export const getLawyerByCategory = async (category: string) => {
  try {
    const response = await axios.get(
      `/api/lawyers_profiles/category/${category}`,
    );
    return response.data.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch lawyers by category failed';
    showError('Failed to load lawyers', message);
    throw new Error(message);
  }
};

export const getLawyerByPage = async (page: number) => {
  try {
    const response = await axios.get(`/api/lawyer_profiles/page/${page}`);
    return response.data.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch lawyers by page failed';
    showError('Failed to load lawyers', message);
    throw new Error(message);
  }
};

export const getLawyerRatings = async (lawyerId: number) => {
  try {
    const response = await axios.get(
      `/api/booking/lawyers/${lawyerId}/ratings`,
    );
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch ratings failed';
    showError('Failed to load ratings', message);
    throw new Error(message);
  }
};
