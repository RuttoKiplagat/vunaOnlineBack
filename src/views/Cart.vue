<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { useNotification } from '@/composables/useNotification'
import AppButton from '@/components/ui/AppButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const cartStore = useCartStore()
const router = useRouter()
const { success, error: notifyError } = useNotification()

onMounted(async () => {
  try {
    await cartStore.fetchCart()
  } catch (error) {
    console.error("Failed to load cart items:", error)
    notifyError("Failed to load your cart items.")
  }
})

function checkout() {
  router.push('/checkout')
}

async function updateQuantity(item, newQuantity) {
  if (newQuantity < 1) return
  try {
    await cartStore.updateQuantity(item.id, newQuantity)
  } catch (error) {
    notifyError("Could not update quantity.")
  }
}

async function removeItem(id) {
  try {
    await cartStore.removeFromCart(id)
    success("Item removed from cart.")
  } catch (error) {
    notifyError("Could not remove item.")
  }
}
</script>

<template>
  <div class="cart-page bg-background min-h-screen pb-16">
    <!-- Header -->
    <section class="cart-header bg-surface border-bottom py-8 mb-8">
      <v-container>
        <div class="d-flex align-center">
          <v-icon icon="mdi-cart" size="36" color="primary" class="mr-4" />
          <div>
            <h1 class="text-h2 font-weight-bold mb-1">Shopping Cart</h1>
            <p class="text-body text-muted">Review your items before checkout</p>
          </div>
        </div>
      </v-container>
    </section>

    <v-container>
      <div v-if="cartStore.loading && cartStore.items.length === 0" class="text-center py-16">
        <v-progress-circular indeterminate color="primary" size="64" />
      </div>

      <div v-else-if="!cartStore.items || cartStore.items.length === 0">
        <EmptyState
          icon="mdi-cart-remove"
          title="Your cart is empty"
          description="Looks like you haven't added any products to your cart yet."
          actionText="Continue Shopping"
          @action="router.push('/products')"
        />
      </div>

      <v-row v-else>
        <!-- Cart Items -->
        <v-col cols="12" lg="8">
          <div class="cart-items-container">
            <transition-group name="list">
              <div 
                v-for="item in cartStore.items" 
                :key="item.id" 
                class="cart-item bg-surface rounded-xl border mb-4 p-4 d-flex flex-column flex-sm-row align-sm-center"
              >
                <!-- Item Image -->
                <div class="item-image-wrapper mr-sm-6 mb-4 mb-sm-0">
                  <v-img 
                    :src="item.product?.image ? `http://localhost:8000/storage/${item.product.image}` : '/placeholder-product.jpg'" 
                    height="120" 
                    width="120"
                    cover
                    class="rounded-lg border"
                  >
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                        <v-icon icon="mdi-image" size="32" color="grey-lighten-2" />
                      </div>
                    </template>
                  </v-img>
                </div>

                <!-- Item Details -->
                <div class="item-details flex-grow-1">
                  <div class="d-flex justify-space-between align-start mb-2">
                    <div>
                      <span class="text-caption text-uppercase text-primary font-weight-bold tracking-wide">
                        {{ item.product?.category?.name || 'Category' }}
                      </span>
                      <h3 class="text-h4 font-weight-bold mb-1">{{ item.product?.name }}</h3>
                      <div class="text-price text-primary">KES {{ item.product?.price?.toLocaleString() }}</div>
                    </div>
                    
                    <v-btn 
                      icon="mdi-close" 
                      variant="text" 
                      color="error" 
                      density="comfortable"
                      @click="removeItem(item.id)"
                      class="delete-btn"
                    />
                  </div>

                  <div class="d-flex justify-space-between align-end mt-4">
                    <!-- Quantity Control -->
                    <div class="quantity-selector">
                      <button 
                        class="qty-btn" 
                        @click="updateQuantity(item, item.quantity - 1)" 
                        :disabled="item.quantity <= 1"
                      >
                        <v-icon icon="mdi-minus" size="small" />
                      </button>
                      <span class="qty-value">{{ item.quantity }}</span>
                      <button 
                        class="qty-btn" 
                        @click="updateQuantity(item, item.quantity + 1)"
                      >
                        <v-icon icon="mdi-plus" size="small" />
                      </button>
                    </div>

                    <!-- Subtotal -->
                    <div class="text-right">
                      <div class="text-caption text-muted mb-1">Subtotal</div>
                      <div class="text-h5 font-weight-bold">
                        KES {{ (item.product?.price * item.quantity).toLocaleString() }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </v-col>

        <!-- Order Summary -->
        <v-col cols="12" lg="4">
          <div class="order-summary bg-surface rounded-xl border p-6 sticky-top">
            <h3 class="text-h3 font-weight-bold mb-6">Order Summary</h3>
            
            <div class="summary-row mb-4">
              <span class="text-muted">Subtotal ({{ cartStore.itemCount }} items)</span>
              <span class="font-weight-medium">KES {{ cartStore.totalPrice?.toLocaleString() }}</span>
            </div>
            
            <div class="summary-row mb-4">
              <span class="text-muted">Shipping</span>
              <span class="text-success font-weight-medium">Calculated at checkout</span>
            </div>
            
            <v-divider class="my-6"></v-divider>
            
            <div class="summary-row mb-8">
              <span class="text-h4 font-weight-bold">Total</span>
              <span class="text-h2 font-weight-bold text-primary">
                KES {{ cartStore.totalPrice?.toLocaleString() }}
              </span>
            </div>
            
            <AppButton 
              size="x-large" 
              class="w-100 mb-4" 
              @click="checkout"
            >
              Proceed to Checkout
            </AppButton>
            
            <div class="d-flex align-center justify-center text-muted text-caption mt-4">
              <v-icon icon="mdi-lock" size="small" class="mr-2" />
              Secure Checkout
            </div>
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

.p-4 {
  padding: var(--space-md);
}

.p-6 {
  padding: var(--space-xl);
}

.sticky-top {
  position: sticky;
  top: 100px;
}

.cart-item {
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.cart-item:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-light);
}

.item-image-wrapper {
  flex-shrink: 0;
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.delete-btn {
  opacity: 0.5;
  transition: opacity var(--transition-fast);
}

.cart-item:hover .delete-btn {
  opacity: 1;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-background);
  overflow: hidden;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.qty-btn:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.05);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.w-100 {
  width: 100%;
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>