<script setup>
import {ref, onMounted} from 'vue';
import {useCartStore} from '@/stores/cart';
import { useAuthStore } from '@/services/auth';
import {useRouter} from 'vue-router';
import api from '@/services/api';


const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false)
const orderComplete = ref(false)
const orderId = ref(null)

const paymentMethods = [
  { title: 'M-Pesa', value: 'mpesa', icon: 'mdi-cellphone' },
  { title: 'Cash on Delivery', value: 'cod', icon: 'mdi-cash' },
  { title: 'Bank Transfer', value: 'bank', icon: 'mdi-bank' }
  
];

const form = ref({
    phone: authStore.user?.phone || '',
    deliveryAddress: authStore.user?.deliveryAddress|| '',
    paymentMethod: 'mpesa',
    mpesaCode: ''
})

const rules = {
    required: v => !!v || 'Required'
}

onMounted(() => {
    if (cartStore.items.length === 0){
        router.push('/cart')
    }
})

async function placeOrder(){
    loading.value = true;

    try{
        const orderData = {
            products: cartStore.items.map(item =>({
                
                product_id: item.product_id || item.product.id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total_amount: cartStore.totalPrice,
            deliveryAddress: form.value.deliveryAddress,
            phone: form.value.phone,
            paymentMethod: form.value.paymentMethod,
            mpesaCode: form.value.paymentMethod === 'mpesa' ? form.value.mpesaCode : null
        };

        const response = await api.post('/orders', orderData);
        orderId.value = response.data.order_id;
        orderComplete.value =true;
        cartStore.clearCart();
    } catch (error){
        console.log(error.response?.data?.message || 'Failed to place order');
    } finally {
        loading.value =false
    }
    }

</script>

<template>
    <v-container>
        <!--Success-->
        <v-row v-if="orderComplete" justify="center">
            <v-col cols="12" md="6" class="text-center">
                <v-icon icon="mdi-check-circle" color="green" size="64" class="mb-4"></v-icon>
                <h1 class="text-h4 mb-4">Order Placed Succesfully</h1>
                <p class="text-body-1 mb-4">Your order #{{ orderId }} has been received</p>
                <v-btn to="/orders" color="green-darken-2">view Orders</v-btn>
                <v-btn to="/products" color="green-darken-2">continue shopping</v-btn>
            </v-col>
        </v-row>
        <!--Checkout-->
        <v-row v-else>
            <v-col cols="12" md="6">
                <v-card class="pa-4 mb-4">
                    <v-card-title>Delivery Information</v-card-title>
                        <v-form ref="formRef">
                        <v-text-field
                        v-model="form.phone"
                        label="Phone Number"
                        :rules="[rules.required]"
                        required
                        variant="outlined"
                        class="mb-3"
                        ></v-text-field>
            
                        <v-textarea
                        v-model="form.deliveryAddress"
                        label="Delivery Address"
                        :rules="[rules.required]"
                        required
                        variant="outlined"
                        rows="3"
                        class="mb-3"
                        ></v-textarea>
                    </v-form>

                </v-card>
                <v-card class="pa-4">
                    <v-card-title class="text-h6 mb-4">Payment Method</v-card-title>
                    <v-radio-group v-model="form.paymentMethod">
                        <v-radio
                        v-for="method in paymentMethods"
                        :key="method.value"
                        :label="method.title"
                        :value="method.value"
                        :prepend-icon="method.icon">
                        </v-radio>
                    </v-radio-group>

                    <v-text-field
                    v-if="form.paymentMethod === 'mpesa'"
                    v-model="form.mpesaCode"
                    label="M-Pesa Transaction Code"
                    placeholder="e.g., QK7X99ABC"
                    :rules="[rules.required]"
                    required
                    variant="outlined"
                    class="mt-4"
                ></v-text-field>
                </v-card>
            </v-col>
            <v-col cols="12" md="4">
                <v-card class="pa-4">
                    <v-card-title class="text-h6 mb-4">Order Summary</v-card-title>
            <!--
                    <div v-for="item in cartStore.items" :key="item.id" class="d-flex justify-space-between mb-2">
                        <span>KES {{ Number(item.price) * Number(item.quantity) }}</span>
                        <span>KES {{ item.price * item.quantity }}</span>
                    </div>
                -->
                    <v-divider class="my-4"></v-divider>
            
                    <div class="d-flex justify-space-between text-h6 font-weight-bold">
                        <span>Total</span>
                        <span class="text-green-darken-2">KES {{ cartStore.totalPrice }}</span>
                    </div>
            
                    <v-btn
                        @click="placeOrder"
                        color="green-darken-2"
                        block
                        size="large"
                        class="mt-4"
                        :loading="loading"
                        :disabled="cartStore.items.length === 0"
                    >
                        Place Order
                    </v-btn>
            
                    <v-btn to="/cart" variant="text" block class="mt-2">
                        Back to Cart
                    </v-btn>
            </v-card>
        </v-col>
        </v-row>
    </v-container>
</template>