<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api'

const router = useRouter();

const kenyanCounties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]

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
const error = ref('')
const success = ref('')
const showPassword = ref(false)


const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const rules = {
    required: v => !!v || "Please fill in the field'",
    email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    min: v => v.length >= 6 || 'Password must be at least 6 characters',
    max: v => v.length <= 15 || 'Password must be less than 15 characters',
    matchPassword: v => v === form.value.password || 'Passwords must match'
}

const register = async () => {
    loading.value = true
    error.value = ''
    success.value = ''

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

        const response = await api.post('/register', formData);

        
        snackbar.value.message = response.data.message || 'Registration successful! Please check your email to verify your account.'
        snackbar.value.color = 'success'
        snackbar.value.show = true

       
        setTimeout(() => {
            router.push('/login')
        }, 3000)
    }
    catch (err) {
        if (err?.response?.data?.errors) {
            const errors = err.response.data.errors
            error.value = Object.values(errors).flat().join(', ')
        } else {
            error.value = err.response?.data?.message || 'An error occurred during registration. Please try again.'
        }
        
        
        snackbar.value.message = error.value
        snackbar.value.color = 'error'
        snackbar.value.show = true
    }
    finally {
        loading.value = false
    }
}
</script>

<template>
    <v-container class="py-10">
        <v-row justify="center">
            <v-col cols="12" md="6">
                <v-card class="pa-6" elevation="4">
                    <v-card-title class="text-h5 text-center white--text">
                        Make an Account
                    </v-card-title>
                
                    
                    <v-alert v-if="error" type="error" dismissible>
                        {{ error }}
                    </v-alert>
                    <v-alert v-if="success" type="success" dismissible>
                        {{ success }}
                    </v-alert>

                    <v-form @submit.prevent="register" class="mt-4">
                      
                        <v-text-field
                            v-model="form.name"
                            label="Full Name"
                            :rules="[rules.required]"
                            required
                            :max-length="40"
                            variant="outlined"
                        ></v-text-field>
                        
                        <v-text-field
                            v-model="form.email"
                            label="Email"
                            :rules="[rules.required, rules.email]"
                            required
                            variant="outlined"
                        ></v-text-field>

                        <v-text-field
                            v-model="form.phone"
                            label="Phone Number"
                            :rules="[rules.required]"
                            required
                            :max-length="15"
                            variant="outlined"
                        ></v-text-field>

                        <v-select
                            v-model="form.county"
                            :items="kenyanCounties"
                            label="County"
                            :rules="[rules.required]"
                            required
                            variant="outlined"
                            prepend-inner-icon="mdi-map-marker"
                        ></v-select>

                        <v-text-field
                            v-model="form.deliveryAddress"
                            label="Delivery Address"
                            :rules="[rules.required]"
                            required
                            :max-length="100"   
                        ></v-text-field>

                        <v-text-field
                            v-model="form.password"
                            label="Password"
                            :type="showPassword ? 'text' : 'password'"
                            :rules="[rules.required, rules.min]"
                            required
                            variant="outlined"
                            class="mb-3"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="showPassword = !showPassword"
                        ></v-text-field>

                        <v-text-field
                            v-model="form.password_confirmation"
                            label="Confirm Password"
                            :type="showPassword ? 'text' : 'password'"
                            :rules="[rules.required, rules.matchPassword]"
                            required
                            variant="outlined"
                            class="mb-3"
                            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                            @click:append-inner="showPassword = !showPassword"
                        ></v-text-field>

                        <v-btn
                            type="submit"
                            color="green-darken-2"
                            block
                            size="large"
                            :loading="loading"
                        >
                            Register
                        </v-btn>
                    </v-form>

                    <v-card-text class="text-center mt-4">
                        Already have an account?
                        <router-link to="/login" class="text-green-darken-2">Login here</router-link>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- SNACKBAR -->
        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :timeout="6000"
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