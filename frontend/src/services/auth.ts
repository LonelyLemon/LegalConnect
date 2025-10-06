import envConfig from '../config/env';
import { FormLogin } from '../types/auth';
import axios from 'axios';

export const signIn = async (data: FormLogin) => {
  const response = await axios.post('/auth/signin', data, {
    baseURL: envConfig.authUrl,
  });
  console.log('login response: ', response.data);
  if (response.data.status === 'error') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};
