import { defineStore } from 'pinia';
import api from '../services/api.js';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: []
    }),

    actions: {
        async fetchCart() {
            const response = await api.get('/getCart');
            this.items = response.data;
        },

        async addToCart(product) {
            await api.post('/saveCart', {
                product_id: product.id,
                quantity: 1
            });
            await this.fetchCart();
        },

        async updateQuantity(id, quantity) {
            await api.put(`/cart/${id}`, { quantity });
            await this.fetchCart();
        },

        async removeFromCart(id) {
            await api.delete(`/cart/${id}`);
            await this.fetchCart();
        }
    },

    getters: {
        totalPrice: (state) =>
            state.items.reduce(
                (total, item) => total + item.quantity * item.product.price, 0
            ),

        itemCount: (state) =>
            state.items.reduce((count, item) => count + item.quantity, 0)
    }
});