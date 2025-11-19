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

      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {

      console.error('[API Request Error]', error);

    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {


      console.log(`[API Response] ${response.config.url} - Status: ${response.status}`);

    return response;
  },
  (error: AxiosError) => {

    const apiError = ApiErrorHandler.handle(error);
    logError(apiError, error.config?.url);


    return Promise.reject(apiError);
  }
);

export default api;