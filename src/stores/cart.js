import { defineStore } from 'pinia';
import { cartApi } from '@/services/cartApi';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchCart() {
            this.loading = true;
            this.error = null;
            try {
                const response = await cartApi.getCart();
                this.items = response.data;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to fetch cart';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async addToCart(product, quantity = 1) {
            this.loading = true;
            this.error = null;
            try {
                await cartApi.addToCart(product.id, quantity);
                await this.fetchCart();
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to add item to cart';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async updateQuantity(id, quantity) {
            this.loading = true;
            this.error = null;
            try {
                await cartApi.updateQuantity(id, quantity);
                await this.fetchCart();
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to update quantity';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async removeFromCart(id) {
            this.loading = true;
            this.error = null;
            try {
                await cartApi.removeFromCart(id);
                await this.fetchCart();
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to remove item';
                throw err;
            } finally {
                this.loading = false;
            }
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