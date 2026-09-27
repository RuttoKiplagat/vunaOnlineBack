<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useNotification } from '@/composables/useNotification'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()
const { success, error: notifyError } = useNotification()

function viewDetails() {
  router.push(`/products/${props.product.id}`)
}

async function addToCart() {
  try {
    await cartStore.addToCart(props.product)
    success(`${props.product.name} added to cart!`)
  } catch (error) {
    console.error("Failed to add to cart:", error)
    notifyError("Could not add item to cart.")
  }
}

const getStockColor = (stock) => {
  if (stock > 10) return 'success'
  if (stock > 0) return 'warning'
  return 'error'
}

const getStockText = (stock) => {
  if (stock > 10) return 'In Stock'
  if (stock > 0) return 'Low Stock'
  return 'Out of Stock'
}
</script>

<template>
  <div class="product-card" @click="viewDetails" role="button" tabindex="0">
    <!-- Image Container -->
    <div class="product-image-wrapper">
      <v-img
        :src="product.image ? `http://localhost:8000/storage/${product.image}` : '/placeholder-product.jpg'"
        height="220"
        cover
        class="product-image"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
            <v-icon icon="mdi-image" size="48" color="grey-lighten-2" />
          </div>
        </template>
      </v-img>

      <!-- Badges -->
      <div class="product-badges">
        <span v-if="product.discount" class="badge badge-discount">
          -{{ product.discount }}%
        </span>
        <span class="badge" :class="`badge-${getStockColor(product.stock)}`">
          {{ getStockText(product.stock) }}
        </span>
      </div>

      <!-- Quick Actions Overlay -->
      <div class="product-actions-overlay">
        <v-btn
          icon="mdi-heart-outline"
          color="white"
          variant="text"
          class="action-btn"
          @click.stop="() => {}"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="product-content">
      <div class="d-flex justify-space-between align-start mb-2">
        <span class="text-caption text-uppercase text-muted font-weight-semibold tracking-wide">
          {{ product.category?.name || 'Category' }}
        </span>
        <div class="d-flex align-center">
          <v-icon icon="mdi-star" color="amber-darken-1" size="14" class="mr-1" />
          <span class="text-caption font-weight-medium">4.5</span>
        </div>
      </div>

      <h3 class="product-title text-h4 font-weight-bold mb-1">
        {{ product.name }}
      </h3>
      
      <p class="text-body-2 text-muted line-clamp-2 mb-4" style="min-height: 40px;">
        {{ product.description }}
      </p>

      <div class="d-flex align-end justify-space-between mt-auto pt-4 border-top">
        <div>
          <div v-if="product.oldPrice" class="text-caption text-decoration-line-through text-muted">
            KES {{ product.oldPrice.toLocaleString() }}
          </div>
          <div class="text-price">
            KES {{ product.price?.toLocaleString() }}
          </div>
        </div>
        
        <AppButton 
          :disabled="product.stock === 0"
          :loading="cartStore.loading"
          size="small"
          icon="mdi-cart-plus"
          @click.stop="addToCart"
        >
          Add
        </AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: all var(--transition-base);
  height: 100%;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-light);
}

.product-image-wrapper {
  position: relative;
  overflow: hidden;
}

.product-image {
  transition: transform var(--transition-slow);
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
}

.badge {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(4px);
}

.badge-discount {
  background-color: var(--color-error);
  color: white;
}

.badge-success {
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-success);
  box-shadow: var(--shadow-sm);
}

.badge-warning {
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-warning);
  box-shadow: var(--shadow-sm);
}

.badge-error {
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-error);
  box-shadow: var(--shadow-sm);
}

.product-actions-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  opacity: 0;
  transform: translateX(10px);
  transition: all var(--transition-base);
}

.product-card:hover .product-actions-overlay {
  opacity: 1;
  transform: translateX(0);
}

.action-btn {
  background-color: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(4px);
}

.action-btn:hover {
  background-color: var(--color-primary) !important;
}

.product-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: var(--space-lg);
}

.product-title {
  font-size: 1.15rem;
  color: var(--color-text);
  margin-bottom: var(--space-xs);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.border-top {
  border-top: 1px solid var(--color-border);
}
</style>