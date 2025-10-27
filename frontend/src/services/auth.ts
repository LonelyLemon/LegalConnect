import envConfig from '../config/env';
import { FormLogin, FormSignUp } from '../types/auth';
import axios from 'axios';

export const signIn = async (data: FormLogin) => {
  const response = await axios.post('/auth/login', data, {
    baseURL: envConfig.baseUrl,
  });
  console.log('login response: ', response.data.data);
  if (response.data.status === 'error') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export const signUp = async (data: FormSignUp) => {
  const response = await axios.post('/auth/signup', data, {
    baseURL: envConfig.baseUrl,
  });
  console.log('signup response: ', response.data);
  if (response.data.status === 'error') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};
