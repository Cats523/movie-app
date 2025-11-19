// services/api.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { TMDB_API_BASE_URL } from '../utils/constants';
import { TMDB_API_KEY } from '@env';
import { ApiErrorHandler, logError } from './api.error';

const api = axios.create({
  baseURL: TMDB_API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Log requests in dev mode
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in dev mode
    if (__DEV__) {
      console.log(`[API Response] ${response.config.url} - Status: ${response.status}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle and log errors
    const apiError = ApiErrorHandler.handle(error);
    logError(apiError, error.config?.url);

    // Attach processed error for easier handling in components
    return Promise.reject(apiError);
  }
);

export default api;