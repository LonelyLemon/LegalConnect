import axios from 'axios';
import { showError } from '../types/toast';
import { t } from '../i18n';
import { store } from '../redux/store';

export const getUserCase = async () => {
  try {
    const response = await axios.get('/booking/cases/me');
    const payload = response?.data ?? [];
    return payload;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch cases failed';
    showError(t('toast.fetchCasesFailed'), message);
    throw new Error(message);
  }
};

export const getPendingCase = async () => {
  try {
    // Get user role from store to determine correct endpoint
    const user = store?.getState()?.user?.user;
    const userRole = user?.role;
    
    // Use /booking/requests/incoming for lawyers, /booking/requests/me for clients
    const endpoint = userRole === 'lawyer' 
      ? '/booking/requests/incoming' 
      : '/booking/requests/me';
    
    const response = await axios.get(endpoint);
    const payload = response?.data ?? [];
    return Array.isArray(payload) ? payload : [];
  } catch (error: any) {
    // If this is an auth error (403/401), it might be because user doesn't have access
    // Return empty array instead of throwing to prevent logout
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      console.warn('Access denied to booking requests endpoint. This may be normal if user role changed.');
      return [];
    }
    
    // For other errors, log and return empty array to prevent logout
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch cases failed';
    console.error('Error fetching pending cases:', message);
    // Show error but don't throw to prevent logout
    showError(t('toast.fetchCasesFailed') || 'Failed to fetch cases', message);
    return [];
  }
};
