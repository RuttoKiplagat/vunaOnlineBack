import {defineStore} from 'pinia';
import {ref, computed} from "vue";
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem("authToken"))

    const isLoggedIn = computed(()=> !!token.value);
    const isAdmin = computed(()=> user.value?.role_id === 1)


async function login (credentials) {
    const response = await api.post('/login', credentials)
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('authToken', token.value)
    localStorage.setItem('isAdmin', user.value.role_id === 1)
    return response.data
}
async function register(userData){
    const response = await api.post('/register', userData)
    return response.data
}

async function logout(){
    token.value = null
    user.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('isAdmin')
}

async function fetchUser() {
    try {
        const reponse = await api.get('/user')
        user.value = reponse.user
    }
    catch (error){
        logout();
    }
}
  return { user, token, isLoggedIn, isAdmin, login, register, logout, fetchUser };
}
)
