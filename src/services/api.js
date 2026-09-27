import axios from 'axios';
import { useNotification } from '@/composables/useNotification';

// Create a centralized Axios instance
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Retrieve token from localStorage (in a real app, might want to get this from store, but this avoids circular deps)
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { error: notifyError } = useNotification();
        
        if (error.code === 'ECONNABORTED' || !error.response) {
            notifyError('Network error. Please check your connection.');
            return Promise.reject(error);
        }

        const status = error.response.status;
        
        switch (status) {
            case 401:
                // Only handle auth errors silently or redirect if needed, avoid spamming toasts
                console.warn('Session expired or unauthorized.');
                // We'll let the auth store handle the actual logout/redirect logic 
                // when it catches a 401.
                break;
            case 403:
                notifyError('You do not have permission to perform this action.');
                break;
            case 404:
                // Not found - let the calling component handle this gracefully
                break;
            case 422:
                // Validation errors - let the component display specific field errors
                break;
            case 429:
                notifyError('Too many requests. Please try again later.');
                break;
            case 500:
                notifyError('An unexpected server error occurred.');
                break;
            default:
                notifyError(error.response?.data?.message || 'Something went wrong.');
        }
        
        return Promise.reject(error);
    }
);

export default api;