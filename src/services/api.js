import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    // 'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('authToken');

        // If the token exists, attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Always tell Laravel to return JSON
        config.headers['Accept'] = 'application/json';

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Session expired or invalid token. Redirecting to login...');
            
        }
        return Promise.reject(error);
    }
);

export default api;