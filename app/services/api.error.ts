// services/api.error.ts
import axios, { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
  isNetworkError: boolean;
  isTimeout: boolean;
  isServerError: boolean;
  isClientError: boolean;
}

export class ApiErrorHandler {
  static handle(error: unknown): ApiError {
    // Default error
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      isNetworkError: false,
      isTimeout: false,
      isServerError: false,
      isClientError: false,
    };

    if (!axios.isAxiosError(error)) {
      return apiError;
    }

    const axiosError = error as AxiosError<{ status_message?: string }>;

    // Network error (no response)
    if (!axiosError.response) {
      if (axiosError.code === 'ECONNABORTED' || axiosError.message.includes('timeout')) {
        return {
          ...apiError,
          message: 'Request timeout. Please check your internet connection.',
          isTimeout: true,
          isNetworkError: true,
        };
      }

      return {
        ...apiError,
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
      };
    }

    // Server responded with error
    const statusCode = axiosError.response.status;
    const serverMessage = axiosError.response.data?.status_message;

    apiError.statusCode = statusCode;

    switch (statusCode) {
      case 400:
        apiError.message = serverMessage || 'Invalid request. Please try again.';
        apiError.isClientError = true;
        break;

      case 401:
        apiError.message = 'Authentication failed. Invalid API key.';
        apiError.isClientError = true;
        break;

      case 404:
        apiError.message = serverMessage || 'Resource not found.';
        apiError.isClientError = true;
        break;

      case 429:
        apiError.message = 'Too many requests. Please try again later.';
        apiError.isClientError = true;
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        apiError.message = 'Server error. Please try again later.';
        apiError.isServerError = true;
        break;

      default:
        apiError.message = serverMessage || `Error ${statusCode}. Please try again.`;
        if (statusCode >= 500) {
          apiError.isServerError = true;
        } else if (statusCode >= 400) {
          apiError.isClientError = true;
        }
    }

    return apiError;
  }

  static getUserFriendlyMessage(error: ApiError): string {
    if (error.isNetworkError) {
      return 'Unable to connect. Please check your internet connection and try again.';
    }

    if (error.isTimeout) {
      return 'Request timed out. Please try again.';
    }

    if (error.isServerError) {
      return 'Service temporarily unavailable. Please try again in a few moments.';
    }

    return error.message;
  }
}

export const logError = (error: ApiError, context?: string) => {
  if (__DEV__) {
    console.error(`[API Error]${context ? ` ${context}` : ''}:`, error);
  }

};