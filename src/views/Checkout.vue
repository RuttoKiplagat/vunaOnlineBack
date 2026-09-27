<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useNotification } from '@/composables/useNotification'
import api from '@/services/api'
import AppButton from '@/components/ui/AppButton.vue'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const { success, error: notifyError } = useNotification()

const formRef = ref(null)
const loading = ref(false)
const orderComplete = ref(false)
const orderId = ref(null)

const paymentMethods = [
  { title: 'M-Pesa', value: 'mpesa', icon: 'mdi-cellphone', description: 'Pay via Safaricom M-Pesa' },
  { title: 'Cash on Delivery', value: 'cod', icon: 'mdi-cash', description: 'Pay when your order arrives' },
  { title: 'Bank Transfer', value: 'bank', icon: 'mdi-bank', description: 'Direct bank transfer' }
]

const form = ref({
  phone: authStore.user?.phone || '',
  deliveryAddress: authStore.user?.deliveryAddress || '',
  paymentMethod: 'mpesa',
  mpesaCode: ''
})

const rules = {
  required: v => !!v || 'This field is required',
  phone: v => /^[0-9+]{10,13}$/.test(v) || 'Invalid phone number format'
}

onMounted(() => {
  if (cartStore.items.length === 0) {
    router.push('/cart')
  }
})

async function placeOrder() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true

  try {
    const orderData = {
      products: cartStore.items.map(item => ({
        product_id: item.product_id || item.product?.id,
        quantity: item.quantity,
        price: item.product?.price
      })),
      total_amount: cartStore.totalPrice,
      deliveryAddress: form.value.deliveryAddress,
      phone: form.value.phone,
      paymentMethod: form.value.paymentMethod,
      mpesaCode: form.value.paymentMethod === 'mpesa' ? form.value.mpesaCode : null
    }

    const response = await api.post('/orders', orderData)
    orderId.value = response.data.order_id || response.data.id || Math.floor(Math.random() * 10000)
    orderComplete.value = true
    cartStore.clearCart()
    success('Order placed successfully!')
  } catch (error) {
    console.error(error)
    notifyError(error.response?.data?.message || 'Failed to place order. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="checkout-page bg-background min-h-screen pb-16">
    <!-- Header -->
    <section class="checkout-header bg-surface border-bottom py-8 mb-8">
      <v-container>
        <div class="d-flex align-center">
          <v-icon icon="mdi-lock-check" size="36" color="primary" class="mr-4" />
          <div>
            <h1 class="text-h2 font-weight-bold mb-1">Secure Checkout</h1>
            <p class="text-body text-muted">Complete your order securely</p>
          </div>
        </div>
      </v-container>
    </section>

    <v-container>
      <!-- Success State -->
      <div v-if="orderComplete" class="success-state fade-in-up text-center py-12 max-w-lg mx-auto">
        <div class="success-icon-wrapper mx-auto mb-6">
          <v-icon icon="mdi-check" color="white" size="48" />
        </div>
        <h1 class="text-display font-weight-bold text-success mb-2">Order Confirmed!</h1>
        <p class="text-body-1 mb-8">
          Thank you for shopping with VunaOnline. Your order <strong>#{{ orderId }}</strong> has been received and is being processed.
        </p>
        <div class="d-flex flex-column flex-sm-row justify-center gap-4">
          <AppButton to="/orders" size="large" variant="outline">
            View My Orders
          </AppButton>
          <AppButton to="/products" size="large">
            Continue Shopping
          </AppButton>
        </div>
      </div>

      <!-- Checkout Form -->
      <v-row v-else>
        <v-col cols="12" lg="8">
          <v-form ref="formRef" @submit.prevent="placeOrder">
            <!-- Delivery Info -->
            <div class="checkout-section bg-surface rounded-xl border p-6 mb-6">
              <h3 class="text-h3 font-weight-bold d-flex align-center mb-6">
                <v-icon icon="mdi-truck-delivery-outline" color="primary" class="mr-3" />
                Delivery Information
              </h3>
              
              <v-text-field
                v-model="form.phone"
                label="Phone Number"
                placeholder="e.g. 0700000000"
                :rules="[rules.required, rules.phone]"
                variant="outlined"
                color="primary"
                class="mb-4"
              ></v-text-field>

              <v-textarea
                v-model="form.deliveryAddress"
                label="Delivery Address"
                placeholder="Please provide detailed delivery instructions..."
                :rules="[rules.required]"
                variant="outlined"
                color="primary"
                rows="3"
                hide-details="auto"
              ></v-textarea>
            </div>

            <!-- Payment Method -->
            <div class="checkout-section bg-surface rounded-xl border p-6">
              <h3 class="text-h3 font-weight-bold d-flex align-center mb-6">
                <v-icon icon="mdi-credit-card-outline" color="primary" class="mr-3" />
                Payment Method
              </h3>
              
              <v-radio-group v-model="form.paymentMethod" hide-details class="payment-options">
                <div 
                  v-for="method in paymentMethods" 
                  :key="method.value"
                  class="payment-option border rounded-lg p-4 mb-4 transition-base cursor-pointer"
                  :class="{ 'border-primary bg-primary-lighten': form.paymentMethod === method.value }"
                  @click="form.paymentMethod = method.value"
                >
                  <div class="d-flex align-center">
                    <v-radio :value="method.value" color="primary" class="mr-2" hide-details></v-radio>
                    <v-icon :icon="method.icon" color="primary-darken-1" size="28" class="mr-4" />
                    <div>
                      <div class="font-weight-bold text-body-1">{{ method.title }}</div>
                      <div class="text-caption text-muted">{{ method.description }}</div>
                    </div>
                  </div>
                </div>
              </v-radio-group>

              <!-- M-Pesa Details -->
              <v-expand-transition>
                <div v-if="form.paymentMethod === 'mpesa'" class="mpesa-details bg-grey-lighten-4 p-4 rounded-lg mt-4 border">
                  <div class="d-flex align-start mb-4">
                    <v-icon icon="mdi-information" color="info" size="small" class="mr-2 mt-1" />
                    <p class="text-caption text-muted mb-0">
                      Go to M-Pesa > Lipa na M-Pesa > Paybill. Enter Business Number <strong>123456</strong> and Account Number <strong>VUNA</strong>. Enter the transaction code below.
                    </p>
                  </div>
                  
                  <v-text-field
                    v-model="form.mpesaCode"
                    label="M-Pesa Transaction Code"
                    placeholder="e.g. QK7X99ABC"
                    :rules="form.paymentMethod === 'mpesa' ? [rules.required] : []"
                    variant="outlined"
                    color="success"
                    hide-details="auto"
                    class="text-uppercase-input"
                  ></v-text-field>
                </div>
              </v-expand-transition>
            </div>
          </v-form>
        </v-col>

        <!-- Order Summary -->
        <v-col cols="12" lg="4">
          <div class="order-summary bg-surface rounded-xl border p-6 sticky-top">
            <h3 class="text-h3 font-weight-bold mb-6">Order Summary</h3>
            
            <div class="order-items mb-6">
              <div v-for="item in cartStore.items" :key="item.id" class="d-flex justify-space-between mb-3 text-body-2">
                <span class="text-truncate mr-2 flex-grow-1">
                  {{ item.quantity }}x {{ item.product?.name }}
                </span>
                <span class="font-weight-medium flex-shrink-0">
                  KES {{ (item.product?.price * item.quantity).toLocaleString() }}
                </span>
              </div>
            </div>
            
            <v-divider class="mb-4"></v-divider>
            
            <div class="d-flex justify-space-between align-center mb-6">
              <span class="text-h4 font-weight-bold">Total</span>
              <span class="text-h2 font-weight-bold text-primary">
                KES {{ cartStore.totalPrice?.toLocaleString() }}
              </span>
            </div>
            
            <AppButton 
              size="x-large" 
              class="w-100 mb-4" 
              :loading="loading"
              @click="placeOrder"
            >
              Place Order
            </AppButton>
            
            <AppButton 
              variant="text" 
              class="w-100" 
              to="/cart"
            >
              Back to Cart
            </AppButton>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.border-bottom {
  border-bottom: 1px solid var(--color-border);
}

.border {
  border: 1px solid var(--color-border);
}

.border-primary {
  border-color: var(--color-primary) !important;
}

.bg-primary-lighten {
  background-color: var(--color-primary-50) !important;
}

.p-4 {
  padding: var(--space-md);
}

.p-6 {
  padding: var(--space-xl);
}

.max-w-lg {
  max-width: 600px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.sticky-top {
  position: sticky;
  top: 100px;
}

.gap-4 {
  gap: 16px;
}

.w-100 {
  width: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

.payment-option:hover:not(.border-primary) {
  border-color: var(--color-primary-light);
  background-color: var(--color-background);
}

.payment-options :deep(.v-selection-control-group) {
  flex-direction: column;
}

.text-uppercase-input :deep(input) {
  text-transform: uppercase;
}

.success-icon-wrapper {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background-color: var(--color-success);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 12px rgba(76, 175, 80, 0.15);
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.2s;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>