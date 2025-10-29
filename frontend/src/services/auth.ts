import envConfig from '../config/env';
import { FormLogin, FormSignUp } from '../types/auth';
import axios from 'axios';
import { showError, showSuccess } from '../types/toast';

export const signIn = async (data: FormLogin) => {
  const formData = new FormData();
  formData.append('username', data.email);
  formData.append('password', data.password);
  try {
    const response = await axios.post('/auth/login', formData, {
      baseURL: envConfig.baseUrl,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const payload = response?.data?.data ?? response?.data;
    console.log('login response: ', payload);
    if (response.data?.status === 'error') {
      throw new Error(response.data?.message || 'Login failed');
    }
    showSuccess('Login successful');
    return payload;
  } catch (err: any) {
    const errmsg = err?.response?.data;
    const message =
      errmsg?.message ||
      errmsg?.detail ||
      errmsg?.error ||
      err?.message ||
      'Login failed';
    showError('Failed to login', message);
    throw new Error(message);
  }
};

export const signUp = async (data: FormSignUp) => {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('repassword', data.repassword);
  formData.append('name', data.name);
  const response = await axios.post('/auth/signup', formData, {
    baseURL: envConfig.baseUrl,
  });
  console.log('signup response: ', response.data);
  if (response.data.status === 'error') {
    throw new Error(response.data.message);
  }
  return response.data.data;
};
