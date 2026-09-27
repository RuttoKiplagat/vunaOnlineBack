<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/product.js'
import { useCartStore } from '@/stores/cart.js'
import { useNotification } from '@/composables/useNotification'
import AppButton from '@/components/ui/AppButton.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const { success, error: notifyError } = useNotification()

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const activeTab = ref('description')

onMounted(async () => {
  try {
    const id = route.params.id
    // Usually we would fetch the single product, but we can also get it from the store if loaded
    if (productsStore.products.length === 0) {
      await productsStore.fetchProducts()
    }
    product.value = productsStore.products.find(p => p.id == id)
  } catch (error) {
    console.error(error)
    notifyError("Failed to load product details")
  } finally {
    loading.value = false
  }
})

const increment = () => {
  if (quantity.value < product.value.stock) quantity.value++
}

const decrement = () => {
  if (quantity.value > 1) quantity.value--
}

async function addToCart() {
  if (!product.value || product.value.stock === 0) return
  
  try {
    // Add multiple times or handle quantity in cartStore
    for (let i = 0; i < quantity.value; i++) {
      await cartStore.addToCart(product.value)
    }
    success(`${quantity.value}x ${product.value.name} added to cart!`)
  } catch (error) {
    console.error("Failed to add to cart:", error)
    notifyError("Could not add item to cart.")
  }
}
</script>

<template>
  <div class="product-details-page bg-background section-padding min-h-screen">
    <v-container>
      <!-- Breadcrumbs -->
      <v-breadcrumbs
        :items="[
          { title: 'Home', disabled: false, to: '/' },
          { title: 'Products', disabled: false, to: '/products' },
          { title: product?.name || 'Loading...', disabled: true }
        ]"
        class="pa-0 mb-8"
      >
        <template v-slot:divider>
          <v-icon icon="mdi-chevron-right" size="small"></v-icon>
        </template>
      </v-breadcrumbs>

      <!-- Loading State -->
      <v-row v-if="loading">
        <v-col cols="12" md="6">
          <SkeletonLoader type="image" height="500px" />
        </v-col>
        <v-col cols="12" md="6">
          <SkeletonLoader type="text" height="60px" class="mb-4" />
          <SkeletonLoader type="text" height="30px" width="40%" class="mb-8" />
          <SkeletonLoader type="text" height="120px" class="mb-8" />
          <SkeletonLoader type="text" height="60px" class="mb-8" />
        </v-col>
      </v-row>

      <!-- Not Found State -->
      <div v-else-if="!product" class="text-center py-16">
        <v-icon icon="mdi-alert-circle-outline" size="64" color="warning" class="mb-4"></v-icon>
        <h2 class="text-h2 mb-4">Product Not Found</h2>
        <p class="text-body text-muted mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
        <AppButton to="/products">Back to Products</AppButton>
      </div>

      <!-- Product Content -->
      <v-row v-else>
        <!-- Product Image -->
        <v-col cols="12" md="6" lg="5">
          <div class="product-image-container sticky-top">
            <v-img
              :src="product.image ? `http://localhost:8000/storage/${product.image}` : '/placeholder-product.jpg'"
              :alt="product.name"
              height="500"
              cover
              class="rounded-2xl shadow-md border"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                  <v-icon icon="mdi-image" size="64" color="grey-lighten-2" />
                </div>
              </template>
            </v-img>
          </div>
        </v-col>

        <!-- Product Info -->
        <v-col cols="12" md="6" lg="7" class="pl-md-8">
          <v-chip color="primary-50" text-color="primary" class="mb-4 text-uppercase font-weight-bold tracking-wide text-caption px-4">
            {{ product.category?.name || 'Category' }}
          </v-chip>
          
          <h1 class="text-display font-weight-bold mb-2">{{ product.name }}</h1>
          
          <div class="d-flex align-center mb-6">
            <div class="d-flex align-center mr-4">
              <v-icon icon="mdi-star" color="amber-darken-1" size="20" />
              <v-icon icon="mdi-star" color="amber-darken-1" size="20" />
              <v-icon icon="mdi-star" color="amber-darken-1" size="20" />
              <v-icon icon="mdi-star" color="amber-darken-1" size="20" />
              <v-icon icon="mdi-star-half-full" color="amber-darken-1" size="20" />
              <span class="ml-2 font-weight-medium">4.5</span>
              <span class="text-muted ml-1">(128 reviews)</span>
            </div>
            <v-divider vertical class="mx-2"></v-divider>
            <div class="text-success font-weight-medium d-flex align-center ml-2">
              <v-icon icon="mdi-check-circle" size="small" class="mr-1" />
              {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
            </div>
          </div>

          <div class="price-container mb-8">
            <div v-if="product.oldPrice" class="text-h5 text-decoration-line-through text-muted mb-1">
              KES {{ product.oldPrice.toLocaleString() }}
            </div>
            <div class="text-h1 font-weight-bold text-primary-dark">
              KES {{ product.price?.toLocaleString() }}
            </div>
          </div>

          <p class="text-body text-muted mb-8 line-height-relaxed">
            {{ product.description }}
          </p>

          <!-- Add to Cart Form -->
          <v-sheet class="pa-6 bg-surface rounded-xl border mb-8">
            <div class="d-flex flex-column flex-sm-row gap-4 align-sm-center">
              <div class="quantity-selector">
                <v-btn icon="mdi-minus" variant="text" density="comfortable" @click="decrement" :disabled="quantity <= 1" />
                <span class="quantity-value">{{ quantity }}</span>
                <v-btn icon="mdi-plus" variant="text" density="comfortable" @click="increment" :disabled="quantity >= product.stock" />
              </div>
              
              <AppButton 
                class="flex-grow-1 h-100" 
                size="x-large"
                icon="mdi-cart-plus"
                :disabled="product.stock === 0"
                :loading="cartStore.loading"
                @click="addToCart"
              >
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </AppButton>
            </div>
          </v-sheet>

          <!-- Product Tabs -->
          <div class="product-tabs">
            <div class="tabs-header d-flex border-bottom mb-6">
              <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'description' }"
                @click="activeTab = 'description'"
              >
                Description
              </button>
              <button 
                class="tab-btn" 
                :class="{ active: activeTab === 'shipping' }"
                @click="activeTab = 'shipping'"
              >
                Shipping & Returns
              </button>
            </div>
            
            <div class="tabs-content text-body text-muted line-height-relaxed">
              <div v-if="activeTab === 'description'">
                <p>This premium agricultural product is carefully selected to ensure maximum yield and quality for your farm. Trusted by thousands of farmers across Kenya, it meets all required agricultural standards.</p>
                <ul class="mt-4 pl-4">
                  <li class="mb-2">High quality formulation</li>
                  <li class="mb-2">Approved by the Kenya Bureau of Standards</li>
                  <li class="mb-2">Suitable for various soil types</li>
                </ul>
              </div>
              <div v-if="activeTab === 'shipping'">
                <p>We deliver to all 47 counties in Kenya. Delivery times vary by location:</p>
                <ul class="mt-4 pl-4">
                  <li class="mb-2">Nairobi & Environs: <strong>Same Day / Next Day</strong></li>
                  <li class="mb-2">Major Towns (Mombasa, Kisumu, Nakuru): <strong>1-2 Days</strong></li>
                  <li class="mb-2">Other Areas: <strong>2-4 Days</strong></li>
                </ul>
                <p class="mt-4">Free returns within 7 days for unopened products in their original packaging.</p>
              </div>
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

.sticky-top {
  position: sticky;
  top: 100px;
}

.border {
  border: 1px solid var(--color-border);
}

.border-bottom {
  border-bottom: 1px solid var(--color-border);
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.line-height-relaxed {
  line-height: 1.7;
}

.gap-4 {
  gap: 16px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 4px;
  background-color: var(--color-background);
}

.quantity-value {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.tab-btn {
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-right: 16px;
}

.tab-btn:hover {
  color: var(--color-primary);
}

.tab-btn.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
</style>
