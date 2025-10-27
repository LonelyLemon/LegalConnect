import axios from 'axios';

export const getPopularDocuments = async () => {
  try {
    const response = await axios.get('/api/legal_documents');
    return response.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};

export const getDocumentById = async (id: string) => {
  try {
    const response = await axios.get(`/api/legal_documents/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};

export const getDocumentByCategory = async (category: string) => {
  try {
    const response = await axios.get(
      `/api/legal_documents/category/${category}`,
    );
    return response.data.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};

export const getDocumentByPage = async (page: number) => {
  try {
    const response = await axios.get(`/api/legal_documents/page/${page}`);
    return response.data.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};
