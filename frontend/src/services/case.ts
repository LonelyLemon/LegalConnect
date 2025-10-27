import axios from 'axios';

export const getUserCase = async () => {
  try {
    const response = await axios.get('/api/cases');
    return response.data.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw error;
  }
};
