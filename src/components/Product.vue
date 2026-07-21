<script setup>
import { onMounted, ref } from 'vue'
import { useProductsStore } from '@/stores/product.js'
import productCard from './productCard.vue';


const productsStore = useProductsStore()
const selectedCategory = ref(null)
const showChat = ref(false)

onMounted(() => {
    productsStore.fetchProducts()
    productsStore.fetchCategories()
})

function filterByCategory(categoryName) {
  selectedCategory.value = categoryName
  productsStore.fetchProducts(categoryName)
}

function clearFilter(){
    selectedCategory.value = null
    productsStore.fetchProducts()
}
</script>

<template>
  <v-container>
    <div>
      <h1 class="text-h3 font-weight-bold mb-2">Farm Inputs & Suppliers</h1>
      <p class="text-body-1 text-grey">Quality products for better yields</p>
    </div>

    <v-sheet color="green-lighten-4" class="pa-4 rounded-lg mb-6">
      <div class="d-flex align-center flex-wrap">
        <span class="text-subtitle-2 font-weight-medium mr-4">Filter by:</span>
        <v-chip-group v-model="selectedCategory" show-arrows>
          <v-chip
            :color="!selectedCategory ? 'green-darken-2' : undefined"
            @click="clearFilter"
            class="mr-2"
          >
            All Products
          </v-chip>
          <v-chip
            v-for="category in productsStore.categories"
            :key="category.name"
            :value="category.name"
            :color="selectedCategory === category.name ? 'green-darken-2' : undefined"
            @click="filterByCategory(category.name)"
            class="mr-2"
          >
            {{ category.name }}
          </v-chip>
        </v-chip-group>
      </div>
    </v-sheet>

    <div v-if="productsStore.loading" key="loading-view">
      <v-row>
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="card" class="rounded-lg"></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>

    <div v-else key="data-view">
      <v-row v-if="productsStore.products && productsStore.products.length > 0">
        <v-col
          v-for="product in productsStore.products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
        >
          <productCard :product="product" />
        </v-col>
      </v-row>

      <v-sheet v-else class="pa-12 text-center" color="grey-lighten-4" rounded>
        <v-icon icon="mdi-package-variant" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
        <h3 class="text-h6 text-grey mb-2">No products found</h3>
        <v-btn color="green-darken-2" @click="clearFilter">View All Products</v-btn>
      </v-sheet>

     

    </div>
  </v-container>
</template>