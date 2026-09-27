import api from './api';

export const cartApi = {
  getCart: () => {
    return api.get('/getCart');
  },
  
  addToCart: (productId, quantity = 1) => {
    return api.post('/saveCart', {
      product_id: productId,
      quantity
    });
  },
  
  updateQuantity: (id, quantity) => {
    return api.put(`/cart/${id}`, { quantity });
  },
  
  removeFromCart: (id) => {
    return api.delete(`/cart/${id}`);
  }
};
