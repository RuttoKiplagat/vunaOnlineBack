<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const { success, error: notifyError } = useNotification()

const kenyanCounties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]

const formRef = ref(null)

const form = ref({
  name: '',
  email: '',
  phone: '',
  county: '',
  deliveryAddress: '',
  password: '',
  password_confirmation: '',
  role_id: '2'
})

const loading = ref(false)
const showPassword = ref(false)
const termsAccepted = ref(false)

const rules = {
  required: v => !!v || "This field is required",
  email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  phone: v => /^[0-9+]{10,13}$/.test(v) || 'Invalid phone number format',
  min: v => (v && v.length >= 6) || 'Password must be at least 6 characters',
  max: v => (v && v.length <= 20) || 'Password must be less than 20 characters',
  matchPassword: v => v === form.value.password || 'Passwords must match'
}

const register = async () => {
  const { valid } = await formRef.value.validate()
  
  if (!valid) return
  
  if (!termsAccepted.value) {
    notifyError("Please accept the Terms & Conditions to register.")
    return
  }

  loading.value = true

  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('email', form.value.email)
    formData.append('phone', form.value.phone)
    formData.append('county', form.value.county)
    formData.append('deliveryAddress', form.value.deliveryAddress)
    formData.append('password', form.value.password)
    formData.append('password_confirmation', form.value.password_confirmation)
    formData.append('role_id', form.value.role_id || 2)

    const response = await api.post('/register', formData)
    
    success(response.data?.message || 'Registration successful! Welcome to VunaOnline.')

    setTimeout(() => {
      router.push('/login')
    }, 2000)
    
  } catch (err) {
    if (err?.response?.data?.errors) {
      const errors = err.response.data.errors
      notifyError(Object.values(errors).flat().join(', '))
    } else {
      notifyError(err.response?.data?.message || 'An error occurred during registration. Please try again.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page bg-grey-lighten-4 min-h-screen d-flex align-center justify-center py-12">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="10" lg="8">
          <v-card class="auth-card rounded-xl border elevation-2 overflow-hidden bg-surface">
            <!-- Header Image/Brand area -->
            <div class="auth-header bg-primary text-white pa-6 text-center position-relative">
              <div class="header-overlay position-absolute top-0 left-0 w-100 h-100"></div>
              <div class="position-relative z-index-1">
                <v-icon icon="mdi-account-plus-outline" size="48" class="mb-4 text-white opacity-90" />
                <h1 class="text-h3 font-weight-bold mb-2">Create an Account</h1>
                <p class="text-body-1 opacity-80">Join VunaOnline and start shopping</p>
              </div>
            </div>

            <v-card-text class="pa-6 pa-md-8">
              <v-form ref="formRef" @submit.prevent="register" class="mt-2">
                <v-row>
                  <!-- Personal Details -->
                  <v-col cols="12">
                    <h3 class="text-subtitle-1 font-weight-bold mb-4 text-primary d-flex align-center">
                      <v-icon icon="mdi-account-outline" size="small" class="mr-2" />
                      Personal Information
                    </h3>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.name"
                      label="Full Name"
                      placeholder="e.g. John Doe"
                      :rules="[rules.required]"
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-account"
                      hide-details="auto"
                      class="mb-2"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.email"
                      label="Email Address"
                      placeholder="e.g. john@example.com"
                      type="email"
                      :rules="[rules.required, rules.email]"
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-email-outline"
                      hide-details="auto"
                      class="mb-2"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.phone"
                      label="Phone Number"
                      placeholder="e.g. 0700000000"
                      :rules="[rules.required, rules.phone]"
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-phone-outline"
                      hide-details="auto"
                      class="mb-2"
                    ></v-text-field>
                  </v-col>

                  <!-- Delivery Details -->
                  <v-col cols="12" class="mt-2">
                    <h3 class="text-subtitle-1 font-weight-bold mb-4 text-primary d-flex align-center">
                      <v-icon icon="mdi-map-marker-outline" size="small" class="mr-2" />
                      Delivery Information
                    </h3>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-autocomplete
                      v-model="form.county"
                      :items="kenyanCounties"
                      label="County"
                      placeholder="Select your county"
                      :rules="[rules.required]"
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-map"
                      hide-details="auto"
                      class="mb-2"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.deliveryAddress"
                      label="Delivery Address"
                      placeholder="e.g. Moi Avenue, Nairobi"
                      :rules="[rules.required]"
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-home-outline"
                      hide-details="auto"
                      class="mb-2"
                    ></v-text-field>
                  </v-col>

                  <!-- Security -->
                  <v-col cols="12" class="mt-2">
                    <h3 class="text-subtitle-1 font-weight-bold mb-4 text-primary d-flex align-center">
                      <v-icon icon="mdi-lock-outline" size="small" class="mr-2" />
                      Security
                    </h3>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.password"
                      label="Password"
                      :type="showPassword ? 'text' : 'password'"
                      :rules="[rules.required, rules.min, rules.max]"
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-lock-outline"
                      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="showPassword = !showPassword"
                      hide-details="auto"
                      class="mb-2"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.password_confirmation"
                      label="Confirm Password"
                      :type="showPassword ? 'text' : 'password'"
                      :rules="[rules.required, rules.matchPassword]"
                      variant="outlined"
                      color="primary"
                      prepend-inner-icon="mdi-lock-check-outline"
                      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append-inner="showPassword = !showPassword"
                      hide-details="auto"
                      class="mb-2"
                    ></v-text-field>
                  </v-col>

                  <!-- Terms and Submit -->
                  <v-col cols="12" class="mt-4">
                    <v-checkbox
                      v-model="termsAccepted"
                      color="primary"
                      hide-details
                      class="mb-6 terms-checkbox"
                    >
                      <template v-slot:label>
                        <div class="text-body-2 text-muted">
                          I agree to the 
                          <a href="#" class="text-primary font-weight-bold text-decoration-none hover-underline" @click.stop>Terms & Conditions</a> 
                          and 
                          <a href="#" class="text-primary font-weight-bold text-decoration-none hover-underline" @click.stop>Privacy Policy</a>.
                        </div>
                      </template>
                    </v-checkbox>

                    <AppButton
                      type="submit"
                      size="x-large"
                      class="w-100"
                      :loading="loading"
                      icon="mdi-account-check"
                    >
                      Create Account
                    </AppButton>
                  </v-col>
                </v-row>
              </v-form>

              <div class="text-center mt-8 text-body-2 text-muted border-top pt-6">
                Already have an account?
                <router-link to="/login" class="text-primary font-weight-bold ml-1 text-decoration-none hover-underline">
                  Log in instead
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

.border-top {
  border-top: 1px solid var(--color-border);
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

.hover-underline:hover {
  text-decoration: underline !important;
}

.terms-checkbox :deep(.v-label) {
  opacity: 1;
}
</style>