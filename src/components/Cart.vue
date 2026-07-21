<script setup>
import { onMounted} from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

onMounted(async () => {
  try {
    await cartStore.fetchCart();
  } catch (error) {
    console.error("Failed to load cart items:", error);
  }
});

function checkout() {
  router.push('/checkout');
}
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">Shopping Cart</h1>
    
    <div v-if="!cartStore.items || cartStore.items.length === 0" class="text-center py-10">
      <v-icon icon="mdi-cart-outline" size="64" color="grey-lighten-1"></v-icon>
      <p class="text-h6 text-grey mt-4">Your cart is empty</p>
      <v-btn to="/products" color="green-darken-2" class="mt-4">Continue Shopping</v-btn>
    </div>

    <v-row v-else>
      <v-col cols="12" md="8">
        <v-card v-for="item in cartStore.items" :key="item.id" class="mb-2">
          <v-row align="center" no-gutters>
            <v-col cols="3">
              <v-img 
                :src="item.product?.image ? `http://localhost:8000/storage/${item.product.image}` : '/placeholder.jpg'" 
                height="100" 
                cover
              ></v-img>
            </v-col>
            <v-col cols="6" class="pa-4">
              <h3 class="text-h6">{{ item.product?.name }}</h3>
              <p class="text-green-darken-2 font-weight-bold">KES {{ item.product?.price }}</p>
            </v-col>
            <v-col cols="3" class="pa-4 text-right">
              <v-text-field
                v-model.number="item.quantity"
                @update:model-value="(val) => cartStore.updateQuantity(item.id, val)"
                type="number"
                min="1"
                density="compact"
                style="width: 80px"
                class="d-inline-block"
              ></v-text-field>
              <v-btn icon="mdi-delete" color="error" variant="text" @click="cartStore.removeFromCart(item.id)"></v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <h3 class="text-h6 mb-4">Order Summary</h3>
          <div class="d-flex justify-space-between mb-2">
            <span>Items ({{ cartStore.itemCount }})</span>
            <span>KES {{ cartStore.totalPrice }}</span>
          </div>
          <v-divider class="my-4"></v-divider>
          <div class="d-flex justify-space-between text-h6 font-weight-bold">
            <span>Total</span>
            <span class="text-green-darken-2">KES {{ cartStore.totalPrice }}</span>
          </div>
          <v-btn @click="checkout" color="green-darken-2" block class="mt-4" size="large">
            Proceed to Checkout
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>