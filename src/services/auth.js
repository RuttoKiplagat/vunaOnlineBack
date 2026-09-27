import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '@/services/authApi';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(localStorage.getItem('authToken'));
    const loading = ref(false);
    const error = ref(null);

    const isLoggedIn = computed(() => !!token.value);
    const isAdmin = computed(() => user.value?.role_id === 1);

    async function login(credentials) {
        loading.value = true;
        error.value = null;
        try {
            const response = await authApi.login(credentials);
            token.value = response.data.token;
            user.value = response.data.user;
            localStorage.setItem('authToken', token.value);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Login failed';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function register(userData) {
        loading.value = true;
        error.value = null;
        try {
            const response = await authApi.register(userData);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Registration failed';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function logout() {
        loading.value = true;
        try {
            await authApi.logout();
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('authToken');
            loading.value = false;
        }
    }

    async function fetchUser() {
        if (!token.value) return;
        loading.value = true;
        try {
            const response = await authApi.getUser();
            user.value = response.data.user || response.data;
        } catch (err) {
            await logout();
        } finally {
            loading.value = false;
        }
    }

    return { 
        user, 
        token, 
        loading,
        error,
        isLoggedIn, 
        isAdmin, 
        login, 
        register, 
        logout, 
        fetchUser 
    };
});
