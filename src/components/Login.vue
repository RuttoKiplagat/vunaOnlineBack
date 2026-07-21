<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/services/auth.js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)


const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

async function handleLogin() {
    loading.value = true
    error.value = ''
    
    try {
        await authStore.login({
            email: email.value,
            password: password.value
        });

       
        snackbar.value.message = 'Login successful! Welcome back.'
        snackbar.value.color = 'success'
        snackbar.value.show = true

        setTimeout(() => {
            const redirect = route.query.redirect || '/products'
            router.push(redirect)
        }, 1500)

    } catch (err) {
        error.value = err.response?.data?.message || "Please check your credentials"
        
       
        snackbar.value.message = error.value
        snackbar.value.color = 'error'
        snackbar.value.show = true
    } finally {
        loading.value = false
    }
}
</script>

<template>
<v-container class="fill-height">
  <v-row justify="center" align="center">
    <v-col cols="12" md="6">
      <v-card class="pa-6" elevation="4">
        <v-card-title class="text-h5 text-center mb-4">Vuna Login</v-card-title>
      
      
        <v-alert v-if="error" type="error" dismissible class="mb-4">
          {{ error }}
        </v-alert>

        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
            variant="outlined"
            prependInnerIcon="mdi-email"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            required
            variant="outlined"
            prependInnerIcon="mdi-lock"
            :appendInnerIcon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:appendInner="showPassword = !showPassword"
            class="mb-4"
          ></v-text-field>

          <v-btn
            type="submit"
            color="green-darken-2"
            block
            class="white-text"
            size="large"
            :loading="loading"
          >LOGIN</v-btn>
        </v-form>

        <v-card-text class="text-center mt-4">
          Don't have an account?
          <router-link to="/register" class="text-green-darken-2">Register here</router-link>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <!-- SNACKBAR -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="4000"
    location="top"
  >
    {{ snackbar.message }}
    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="snackbar.show = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</v-container>
</template>