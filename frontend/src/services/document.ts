import axios from 'axios';
import { showError } from '../types/toast';

export const getPopularDocuments = async () => {
  try {
    const response = await axios.get('/api/legal_documents');
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch documents failed';
    showError('Failed to load documents', message);
    throw new Error(message);
  }
};

export const getDocumentById = async (id: string) => {
  try {
    const response = await axios.get(`/api/legal_documents/${id}`);
    return response.data.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch document failed';
    showError('Failed to load document', message);
    throw new Error(message);
  }
};

export const getDocumentByCategory = async (category: string) => {
  try {
    const response = await axios.get(
      `/api/legal_documents/category/${category}`,
    );
    return response.data.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch documents by category failed';
    showError('Failed to load documents', message);
    throw new Error(message);
  }
};

export const getDocumentByPage = async (page: number) => {
  try {
    const response = await axios.get(`/api/legal_documents/page/${page}`);
    return response.data.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch documents by page failed';
    showError('Failed to load documents', message);
    throw new Error(message);
  }
};
