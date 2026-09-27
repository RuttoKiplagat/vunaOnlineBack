<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { success, error: notifyError } = useNotification()

const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    notifyError('Please enter both email and password.')
    return
  }
  
  loading.value = true
  
  try {
    await authStore.login({
      email: email.value,
      password: password.value
    })

    success('Login successful! Welcome back.')

    setTimeout(() => {
      const redirect = route.query.redirect || '/products'
      router.push(redirect)
    }, 1000)

  } catch (err) {
    notifyError(err.response?.data?.message || "Please check your credentials")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page bg-grey-lighten-4 min-h-screen d-flex align-center justify-center py-12">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <v-card class="auth-card rounded-xl border elevation-2 overflow-hidden bg-surface">
            <!-- Header Image/Brand area -->
            <div class="auth-header bg-primary text-white pa-6 pa-md-8 text-center position-relative">
              <div class="header-overlay position-absolute top-0 left-0 w-100 h-100"></div>
              <div class="position-relative z-index-1">
                <v-icon icon="mdi-leaf" size="48" class="mb-4 text-white opacity-90" />
                <h1 class="text-h3 font-weight-bold mb-2">Welcome Back</h1>
                <p class="text-body-1 opacity-80">Log in to your VunaOnline account</p>
              </div>
            </div>

            <v-card-text class="pa-6 pa-md-8">
              <v-form @submit.prevent="handleLogin" class="mt-4">
                <v-text-field
                  v-model="email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-email-outline"
                  class="mb-4"
                  hide-details="auto"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  label="Password"
                  placeholder="Enter your password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  color="primary"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  class="mb-2"
                  hide-details="auto"
                ></v-text-field>

                <div class="d-flex justify-space-between align-center mb-6">
                  <v-checkbox
                    label="Remember me"
                    color="primary"
                    hide-details
                    density="compact"
                    class="text-body-2"
                  ></v-checkbox>
                  <a href="#" class="text-primary text-caption font-weight-bold text-decoration-none hover-underline">
                    Forgot Password?
                  </a>
                </div>

                <AppButton
                  type="submit"
                  size="x-large"
                  class="w-100"
                  :loading="loading"
                  icon="mdi-login"
                >
                  Log In
                </AppButton>
              </v-form>

              <div class="text-center mt-8 text-body-2 text-muted">
                Don't have an account?
                <router-link to="/register" class="text-primary font-weight-bold ml-1 text-decoration-none hover-underline">
                  Create an account
                </router-link>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.border {
  border: 1px solid var(--color-border);
}

.auth-header {
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
}

.header-overlay {
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSI+PC9jaXJjbGU+Cjwvc3ZnPg==') repeat;
}

.z-index-1 {
  z-index: 1;
}

.opacity-80 {
  opacity: 0.8;
}

.opacity-90 {
  opacity: 0.9;
}

.w-100 {
  width: 100%;
}

.h-100 {
  height: 100%;
}

.hover-underline:hover {
  text-decoration: underline !important;
}
</style>