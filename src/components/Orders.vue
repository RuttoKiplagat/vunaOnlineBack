<script setup>
import {ref, onMounted} from 'vue';
import api from '@/services/api';

const orders = ref([]);
const loading = ref(true);

const statusColors = {
    pending: 'orange',
    processing: 'blue',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red'
};

onMounted( async () => {
    try{
        const response = await api.get('/orders')
        orders.value = response.data;
    } catch (error) {
        console.error('Failed to fetch orders')
    }
    finally {
        loading.value =false
    }
})
</script>

<template>
    <v-container>
        <h1 class="text-h4">My orders</h1>
        <v-skeleton-loader v-if="loading" type="article" v-for="n in 3" :key="n"></v-skeleton-loader>
        <div v-else-if="orders.length === 0" class="text-center">
            <v-icon icon="mdi-package-variant-closed" size="64" color="grey-lighten-1"></v-icon>
            <p class="text-h6 text-grey">No orders yet</p>
            <v-btn to="/products" color="green-darken-2" class="mt-4">Start Shopping</v-btn>
        </div>
        <v-row v-else>
            <v-col v-for="order in orders" :key="order.id">
                <v-card>
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span>Order</span>
                        <v-chip 
                            :color="statusColors[order.status] || 'grey'" 
                            size="small"
                            >
                            {{ order.status ? order.status : 'No Status Found' }}
                        </v-chip>
                    </v-card-title>
                    <v-card-text>
                        <v-list density="compact">
                            <v-list-item v-for="item in order.items" :key="item.id">
                            <v-img :src="item.product?.image"></v-img>
                            <v-list-item-title>{{ item.product?.name }}</v-list-item-title>
                            <v-list-item-subtitle>Qty: {{ item.quantity }} * KES {{ item.price }}</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                        <div class="d-flex justify-space-between align-center">
                            <div>
                                <p class="text-body-2 text-grey">Delivery to: {{ order.deliveryAddress }}</p>
                                <p class="text-body-2 text-grey">Phone: {{ order.phone }}</p>
                            </div>
                            <div class="text-h6 font-weight-bold text-green-darken-2">
                                Total: KES {{ order.total_amount }}
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>