import api from './api';

export const authApi = {
  login: (credentials) => {
    return api.post('/login', credentials);
  },
  
  register: (userData) => {
    return api.post('/register', userData);
  },
  
  getUser: () => {
    return api.get('/user');
  },
  
  logout: () => {
    // Assuming backend has a logout endpoint
    return api.post('/logout').catch(() => {}); 
  }
};
