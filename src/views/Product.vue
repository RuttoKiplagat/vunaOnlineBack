<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProductsStore } from '@/stores/product.js'
import ProductCard from '@/components/product/ProductCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const productsStore = useProductsStore()
const selectedCategory = ref(null)
const searchQuery = ref('')
const showMobileFilters = ref(false)

onMounted(() => {
  productsStore.fetchProducts()
  productsStore.fetchCategories()
})

const filteredProducts = computed(() => {
  let products = productsStore.products
  
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value || p.category?.name === selectedCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      (p.description && p.description.toLowerCase().includes(query))
    )
  }
  
  return products
})

function filterByCategory(categoryName) {
  selectedCategory.value = categoryName
  // We can fetch or just rely on the computed filteredProducts if we fetched all.
  // productsStore.fetchProducts(categoryName) 
}

function clearFilter() {
  selectedCategory.value = null
  searchQuery.value = ''
}
</script>

<template>
  <div class="product-discovery bg-background">
    <!-- Header Banner -->
    <section class="discovery-header text-white text-center py-12">
      <v-container>
        <h1 class="text-display mb-4">Farm Inputs & Suppliers</h1>
        <p class="text-h3 font-weight-regular opacity-90 max-w-md mx-auto">
          Quality products for better yields. Discover premium seeds, fertilizers, and equipment.
        </p>
      </v-container>
    </section>

    <v-container class="py-12">
      <v-row>
        <!-- Desktop Sidebar -->
        <v-col cols="12" md="3" class="d-none d-md-block">
          <div class="sidebar-filters sticky-top">
            <h3 class="text-h3 font-weight-bold mb-6">Filters</h3>
            
            <div class="mb-6">
              <v-text-field
                v-model="searchQuery"
                placeholder="Search products..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="comfortable"
                hide-details
                class="search-input"
                rounded="lg"
              ></v-text-field>
            </div>

            <div class="filter-group mb-6">
              <h4 class="text-label mb-4">Categories</h4>
              <v-list density="compact" nav class="bg-transparent px-0">
                <v-list-item
                  :active="!selectedCategory"
                  @click="clearFilter"
                  rounded="lg"
                  class="filter-item mb-1"
                  color="primary"
                >
                  <v-list-item-title>All Products</v-list-item-title>
                </v-list-item>
                
                <v-list-item
                  v-for="category in productsStore.categories"
                  :key="category.name"
                  :active="selectedCategory === category.name"
                  @click="filterByCategory(category.name)"
                  rounded="lg"
                  class="filter-item mb-1"
                  color="primary"
                >
                  <v-list-item-title>{{ category.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </div>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="9">
          <!-- Mobile Filters Toggle & Search -->
          <div class="d-md-none mb-6">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search products..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-4"
              rounded="lg"
            ></v-text-field>
            
            <v-sheet class="pa-4 rounded-lg border">
              <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-medium mr-4">Filter:</span>
                <v-chip-group v-model="selectedCategory" show-arrows column>
                  <v-chip
                    :value="null"
                    :color="!selectedCategory ? 'primary' : undefined"
                    @click="clearFilter"
                    class="font-weight-medium"
                  >
                    All
                  </v-chip>
                  <v-chip
                    v-for="category in productsStore.categories"
                    :key="category.name"
                    :value="category.name"
                    :color="selectedCategory === category.name ? 'primary' : undefined"
                    @click="filterByCategory(category.name)"
                    class="font-weight-medium"
                  >
                    {{ category.name }}
                  </v-chip>
                </v-chip-group>
              </div>
            </v-sheet>
          </div>

          <!-- Active Filters & Results Count -->
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="text-body text-muted">
              Showing <strong class="text-on-surface">{{ filteredProducts.length }}</strong> products
              <span v-if="selectedCategory">in <strong>{{ selectedCategory }}</strong></span>
            </div>
            
            <v-select
              placeholder="Sort by"
              :items="['Price: Low to High', 'Price: High to Low', 'Newest']"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 200px;"
              rounded="lg"
            ></v-select>
          </div>

          <!-- Loading State -->
          <div v-if="productsStore.loading" class="product-grid">
            <SkeletonLoader v-for="n in 8" :key="n" type="card" class="h-100" />
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="mt-8">
            <EmptyState
              icon="mdi-magnify-close"
              title="No products found"
              description="We couldn't find any products matching your current filters or search query."
              actionText="Clear Filters"
              @action="clearFilter"
            />
          </div>

          <!-- Products Grid -->
          <div v-else class="product-grid">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="fade-in-up"
            >
              <ProductCard :product="product" />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.discovery-header {
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
  position: relative;
  overflow: hidden;
}

.opacity-90 {
  opacity: 0.9;
}

.max-w-md {
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

.search-input :deep(.v-field) {
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
}

.filter-item {
  transition: all var(--transition-fast);
}

.filter-item:hover {
  background-color: var(--color-surface-hover);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.border {
  border: 1px solid var(--color-border);
}

.text-on-surface {
  color: var(--color-on-surface);
}

@media (max-width: 600px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-md);
  }
}
</style>