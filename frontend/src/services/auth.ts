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
  try {
    const body = {
      email: data.email,
      password: data.password,
      username: data.name,
    };
    const response = await axios.post('/users/register', body, {
      baseURL: envConfig.baseUrl,
      headers: { 'Content-Type': 'application/json' },
    });
    const payload = response?.data?.data ?? response?.data;
    console.log('signup response: ', payload);
    if (payload?.status === 'error') {
      throw new Error(payload?.message || 'Sign up failed');
    }
    showSuccess('Sign up successful');
    return payload;
  } catch (err: any) {
    const errmsg = err?.response?.data;
    const message =
      errmsg?.message ||
      errmsg?.detail ||
      errmsg?.error ||
      err?.message ||
      'Sign up failed';
    showError('Failed to sign up', message);
    throw new Error(message);
  }
};

export const fetchUserInfo = async () => {
  try {
    const response = await axios.get('/users/me', {
      baseURL: envConfig.baseUrl,
    });
    return response;
  } catch (error: any) {
    console.log('error fetch user info: ', error);
    const errmsg = error?.response?.data;
    const message =
      errmsg?.message ||
      errmsg?.detail ||
      errmsg?.error ||
      error?.message ||
      'Fetch user info failed';
    showError('Failed to fetch user info', message);
    throw error;
  }
};
export const updateUserInfo = async (data: any) => {
  try {
    const body = {
      username: data.username,
      phone_number: data.phone_number,
      address: data.address,
      gender: data.gender,
      dob: data.dob,
      avatar_url: data.avatar_url,
    };
    const response = await axios.put('/users/update', body, {
      headers: { 'Content-Type': 'application/json' },
      baseURL: envConfig.baseUrl,
    });
    showSuccess('Update user info successful');
    return response?.data?.data ?? response?.data;
  } catch (error: any) {
    console.log('error update user info: ', error);
    const errmsg = error?.response?.data;
    const message =
      errmsg?.message ||
      errmsg?.detail ||
      errmsg?.error ||
      error?.message ||
      'Update user info failed';
    showError('Failed to update user info', message);
    throw error;
  }
};
