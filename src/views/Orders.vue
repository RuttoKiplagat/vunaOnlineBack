<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import AppButton from '@/components/ui/AppButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

const orders = ref([])
const loading = ref(true)
const { error: notifyError } = useNotification()

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error'
}

const statusIcons = {
  pending: 'mdi-clock-outline',
  processing: 'mdi-cogs',
  shipped: 'mdi-truck-delivery-outline',
  delivered: 'mdi-check-circle-outline',
  cancelled: 'mdi-close-circle-outline'
}

onMounted(async () => {
  try {
    const response = await api.get('/orders')
    // Ensure orders is an array
    orders.value = Array.isArray(response.data) ? response.data : []
    
    // Sort orders by ID descending (newest first)
    orders.value.sort((a, b) => b.id - a.id)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    notifyError('Failed to load your orders.')
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'Recent'
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<template>
  <div class="orders-page bg-background min-h-screen pb-16">
    <!-- Header -->
    <section class="orders-header bg-surface border-bottom py-8 mb-8">
      <v-container>
        <div class="d-flex align-center">
          <v-icon icon="mdi-package-variant" size="36" color="primary" class="mr-4" />
          <div>
            <h1 class="text-h2 font-weight-bold mb-1">My Orders</h1>
            <p class="text-body text-muted">Track and manage your recent purchases</p>
          </div>
        </div>
      </v-container>
    </section>

    <v-container>
      <!-- Loading State -->
      <v-row v-if="loading">
        <v-col cols="12" v-for="n in 3" :key="n">
          <v-card class="rounded-xl border pa-6 mb-4" elevation="0">
            <div class="d-flex justify-space-between mb-4">
              <SkeletonLoader type="text" width="20%" height="24px" />
              <SkeletonLoader type="text" width="15%" height="32px" />
            </div>
            <v-divider class="mb-4"></v-divider>
            <div class="d-flex mb-4">
              <SkeletonLoader type="image" width="80px" height="80px" class="rounded-lg mr-4" />
              <div class="flex-grow-1">
                <SkeletonLoader type="text" width="40%" height="20px" class="mb-2" />
                <SkeletonLoader type="text" width="20%" height="16px" />
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="mt-8">
        <EmptyState
          icon="mdi-package-variant-closed"
          title="No orders yet"
          description="You haven't placed any orders yet. Explore our products and make your first purchase!"
          actionText="Start Shopping"
          @action="$router.push('/products')"
        />
      </div>

      <!-- Orders List -->
      <v-row v-else>
        <v-col cols="12" lg="10" class="mx-auto">
          <transition-group name="list">
            <div v-for="(order, index) in orders" :key="order.id" class="mb-6 fade-in-up" :style="{ animationDelay: `${index * 0.1}s` }">
              <v-card class="order-card rounded-xl border bg-surface" elevation="0">
                <!-- Order Header -->
                <div class="order-header pa-4 pa-sm-6 bg-grey-lighten-4 border-bottom d-flex flex-column flex-sm-row justify-space-between align-sm-center gap-4">
                  <div>
                    <div class="d-flex align-center mb-1">
                      <span class="text-h4 font-weight-bold mr-3">Order #{{ order.id }}</span>
                      <span class="text-caption text-muted">{{ formatDate(order.created_at) }}</span>
                    </div>
                    <div class="text-body-2 text-muted">
                      {{ order.items?.length || 0 }} items • KES {{ order.total_amount?.toLocaleString() }}
                    </div>
                  </div>
                  
                  <v-chip 
                    :color="statusColors[order.status?.toLowerCase()] || 'grey'" 
                    class="font-weight-bold text-uppercase tracking-wide"
                    size="small"
                  >
                    <v-icon :icon="statusIcons[order.status?.toLowerCase()] || 'mdi-help-circle-outline'" size="small" class="mr-1" />
                    {{ order.status || 'Pending' }}
                  </v-chip>
                </div>

                <!-- Order Content -->
                <v-card-text class="pa-4 pa-sm-6">
                  <div class="order-items-list mb-6">
                    <div v-for="(item, i) in order.items" :key="item.id" class="d-flex py-3" :class="{ 'border-bottom': i !== order.items.length - 1 }">
                      <v-img 
                        :src="item.product?.image ? `http://localhost:8000/storage/${item.product.image}` : '/placeholder-product.jpg'" 
                        height="64" 
                        width="64"
                        cover
                        class="rounded-lg border flex-shrink-0 mr-4"
                      ></v-img>
                      
                      <div class="flex-grow-1 d-flex justify-space-between">
                        <div>
                          <div class="text-subtitle-1 font-weight-bold mb-1">{{ item.product?.name || 'Product unavailable' }}</div>
                          <div class="text-caption text-muted">Qty: {{ item.quantity }}</div>
                        </div>
                        <div class="text-right font-weight-medium">
                          KES {{ (item.price * item.quantity).toLocaleString() }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Delivery Details -->
                  <div class="bg-background rounded-lg p-4 border">
                    <h4 class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center">
                      <v-icon icon="mdi-truck-outline" size="small" color="primary" class="mr-2" />
                      Delivery Details
                    </h4>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-muted mb-1">Address</div>
                        <div class="text-body-2">{{ order.deliveryAddress || 'Not provided' }}</div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="text-caption text-muted mb-1">Contact</div>
                        <div class="text-body-2">{{ order.phone || 'Not provided' }}</div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>

                <!-- Order Actions -->
                <v-card-actions class="pa-4 pa-sm-6 pt-0 border-top bg-grey-lighten-4">
                  <v-spacer></v-spacer>
                  <AppButton 
                    variant="outline" 
                    size="small" 
                    class="mr-2"
                    icon="mdi-receipt-text-outline"
                  >
                    Invoice
                  </AppButton>
                  <AppButton 
                    size="small"
                    icon="mdi-refresh"
                  >
                    Reorder
                  </AppButton>
                </v-card-actions>
              </v-card>
            </div>
          </transition-group>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.border {
  border: 1px solid var(--color-border);
}

.border-bottom {
  border-bottom: 1px solid var(--color-border);
}

.border-top {
  border-top: 1px solid var(--color-border);
}

.p-4 {
  padding: var(--space-md);
}

.gap-4 {
  gap: 16px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.order-card {
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.order-card:hover {
  box-shadow: var(--shadow-md) !important;
  transform: translateY(-2px);
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>