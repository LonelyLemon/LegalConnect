import axios from 'axios';

export const getPopularLawyers = async () => {
  try {
    const response = await axios.get('/api/lawyer_profiles');
    return response.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};

export const getLawyerById = async (id: string) => {
  try {
    const response = await axios.get(`/api/lawyers_profiles/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};

export const getLawyerByCategory = async (category: string) => {
  try {
    const response = await axios.get(
      `/api/lawyers_profiles/category/${category}`,
    );
    return response.data.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};

export const getLawyerByPage = async (page: number) => {
  try {
    const response = await axios.get(`/api/lawyers_profiles/page/${page}`);
    return response.data.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};
