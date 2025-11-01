import axios from 'axios';
import { showError } from '../types/toast';
import { File } from '../components/common/filePicker';
import { t } from '../i18n';
export const getPopularDocuments = async () => {
  try {
    const page = 1;
    const size = 10;
    // Backend lists documents at GET /documentation (no path param). We can pass query params.
    const response = await axios.get(`/documentation`, {
      params: { page, size },
    });
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch documents failed';
    showError(t('toast.loadDocumentsFailed'), message);
    throw new Error(message);
  }
};

export const getDocumentById = async (id: string) => {
  try {
    const response = await axios.get(`/documentation/${id}`, {});
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch document failed';
    showError(t('toast.loadDocumentFailed'), message);
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
    showError(t('toast.loadDocumentsFailed'), message);
    throw new Error(message);
  }
};

export const getDocumentByPage = async (page: number) => {
  try {
    const response = await axios.get(`/documentation`, {
      params: { page },
    });
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch documents by page failed';
    showError(t('toast.loadDocumentsFailed'), message);
    throw new Error(message);
  }
};

export const getAllDocuments = async () => {
  try {
    const response = await axios.get(`/documentation`);
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Fetch all documents failed';
    showError(t('toast.loadDocumentsFailed'), message);
    throw new Error(message);
  }
};

export const createDocument = async ({
  title,
  document,
}: {
  title: string;
  document: File;
}) => {
  try {
    const formData = new FormData();
    formData.append('display_name', title);
    formData.append('document', {
      uri: document.uri,
      name: document.name || 'document.pdf',
      type: document.type || 'application/pdf',
    });
    const response = await axios.post('/documentation/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Create document failed';
    showError(t('toast.createDocumentFailed'), message);
    throw new Error(message);
  }
};

export const updateDocument = async (
  id: string,
  { title, document }: { title: string; document?: File },
) => {
  try {
    console.log('updateDocument called:', {
      id,
      title,
      hasDocument: !!document,
    });
    const formData = new FormData();
    formData.append('display_name', title);

    // Chỉ append document nếu có chọn file mới
    if (document) {
      console.log('Appending document to FormData:', document);
      // @ts-ignore RN FormData file shape
      formData.append('document', {
        uri: document.uri,
        name: document.name || 'document.pdf',
        type: document.type || 'application/pdf',
      });
    }

    console.log('Sending PATCH request to /documentation/' + id);
    const response = await axios.patch(`/documentation/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Update response:', response.data);
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Update document failed';
    showError(t('toast.updateDocumentFailed'), message);
    throw new Error(message);
  }
};

export const deleteDocument = async (id: string) => {
  try {
    const response = await axios.delete(`/documentation/${id}`);
    return response.data;
  } catch (error: any) {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.detail ||
      data?.error ||
      error?.message ||
      'Delete document failed';
    showError(t('toast.deleteDocumentFailed'), message);
    throw new Error(message);
  }
};
