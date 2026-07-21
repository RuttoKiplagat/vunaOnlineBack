<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore() 

function viewDetails() {
  router.push(`/products/${props.product.id}`)
}


async function addToCart() {
  try {
    await cartStore.addToCart(props.product)
    alert(`${props.product.name} added to cart!`)
  } catch (error) {
    console.error("Failed to add to cart:", error)
    alert("Could not add item to cart.")
  }
}
</script>

<template>
  <v-card class="product-card h-100" hover elevation="2">
    <!-- Product Image -->
    <div class="position-relative">
      <v-img
        :src="product.image ? `http://localhost:8000/storage/${product.image}` : '/placeholder-product.jpg'"
        height="200"
        cover
        class="bg-grey-lighten-3"
      >
        <template v-slot:placeholder>
          <v-row align="center" justify="center" class="fill-height">
            <v-icon icon="mdi-image" size="48" color="grey-lighten-1"></v-icon>
          </v-row>
        </template>
      </v-img>

      <!-- Stock Badge -->
      <v-chip
        :color="product.stock > 10 ? 'green' : product.stock > 0 ? 'orange' : 'red'"
        size="small"
        class="position-absolute top-0 right-0 ma-2"
      >
        {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
      </v-chip>
    </div>

    <v-card-text class="pa-4">
      <!-- Category -->
      <v-chip size="x-small" color="grey-lighten-2" class="mb-2">
        {{ product.category?.name || 'Uncategorized' }}
      </v-chip>

      <!-- Name -->
      <h3 class="text-subtitle-1 font-weight-bold text-truncate mb-2">
        {{ product.name }}
      </h3>

      <!-- Description -->
      <p class="text-body-2 text-grey text-truncate mb-3">
        {{ product.description }}
      </p>

      <!-- Price -->
      <div class="text-h6 font-weight-bold text-green-darken-2">
        KES {{ product.price?.toLocaleString() }}
      </div>
    </v-card-text>

    <v-card-actions class="pa-4 pt-0">
      <v-btn
        variant="outlined"
        color="primary"
        size="small"
        @click="viewDetails"
      >
        Details
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="green-darken-2"
        size="small"
        prepend-icon="mdi-cart-plus"
        @click="addToCart"
        :disabled="product.stock === 0"
      >
        Add
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
}
</style>