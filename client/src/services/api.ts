import axios from 'axios';

const getBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (!envUrl) {
    return 'http://localhost:5000/api';
  }
  const cleanUrl = envUrl.trim().replace(/\/$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  timeout: 15000,
});

interface ApiErrorResponse {
  message?: string;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('slack-clone-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const apiMessage = error.response?.data?.message;
      if (apiMessage) {
        return Promise.reject(new Error(apiMessage));
      }
      if (error.code === 'ERR_NETWORK' || !error.response) {
        return Promise.reject(
          new Error(
            'Unable to connect to backend server. Please verify backend server is running and VITE_API_URL is configured.',
          ),
        );
      }
    }

    return Promise.reject(error);
  },
);

export default api;

