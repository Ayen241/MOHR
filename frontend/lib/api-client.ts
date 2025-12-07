import axios, { AxiosInstance, AxiosError } from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let axiosInstance: AxiosInstance;

export const getApiClient = async (): Promise<AxiosInstance> => {
  if (axiosInstance) {
    return axiosInstance;
  }

  axiosInstance = axios.create({
    baseURL: API_URL,
  });

  // Add request interceptor to attach auth token
  axiosInstance.interceptors.request.use(
    async (config) => {
      const session = await getSession();
      if (session?.user?.email) {
        // Include user info in headers for backend validation
        config.headers['X-User-Email'] = session.user.email;
        config.headers['X-User-ID'] = (session.user as any).id || '';
        config.headers['X-User-Role'] = (session.user as any).role || '';
      }
      
      // Set Content-Type only if not FormData (let browser set it for FormData)
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// API helper functions
export const apiCall = {
  get: async <T = any>(url: string, config = {}) => {
    const client = await getApiClient();
    return client.get<T>(url, config);
  },

  post: async <T = any>(url: string, data?: any, config = {}) => {
    const client = await getApiClient();
    return client.post<T>(url, data, config);
  },

  put: async <T = any>(url: string, data?: any, config = {}) => {
    const client = await getApiClient();
    return client.put<T>(url, data, config);
  },

  delete: async <T = any>(url: string, config = {}) => {
    const client = await getApiClient();
    return client.delete<T>(url, config);
  },
};

// Profile API functions
export const profileApi = {
  // Get current user profile
  getProfile: async () => {
    return apiCall.get<any>('/api/users/profile');
  },

  // Update user profile (name, phone, department, etc.)
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    department?: string;
  }) => {
    return apiCall.put<any>('/api/users/profile', data);
  },

  // Upload user avatar/profile picture
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const client = await getApiClient();
    return client.post<any>('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete user avatar
  deleteAvatar: async () => {
    return apiCall.delete<any>('/api/users/avatar');
  },
};
