import api from './api';

export const productApi = {
  getProducts: (category = null) => {
    const url = category ? `/getProducts?category=${category}` : '/getProducts';
    return api.get(url);
  },
  
  getProduct: (id) => {
    return api.get(`/getProduct/${id}`);
  },
  
  getCategories: () => {
    return api.get('/getCategories');
  }
};
