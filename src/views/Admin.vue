<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import AppButton from '@/components/ui/AppButton.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

const tab = ref('products')
const products = ref([])
const orders = ref([])
const users = ref([])
const categories = ref([])
const loading = ref(false)
const { success, error: notifyError } = useNotification()

const productDialog = ref(false)
const editingProduct = ref(null)
const productForm = ref({
  name: '',
  description: '',
  price: null,
  stock: null,
  category: ''
})

const imageFile = ref(null)
const imagePreview = ref(null)

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error'
}

onMounted(() => {
  fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const [prodRes, orderRes, userRes, catRes] = await Promise.all([
      api.get('/getProducts'),
      api.get('/orders'),
      api.get('/users'),
      api.get('/getCategories')
    ])
    products.value = prodRes.data
    orders.value = orderRes.data
    users.value = userRes.data
    categories.value = catRes.data
  } catch (error) {
    console.error('Fetch error:', error)
    notifyError('Failed to load admin data.')
  } finally {
    loading.value = false
  }
}

function openProductDialog(product = null) {
  imageFile.value = null
  imagePreview.value = null
  
  if (product) {
    editingProduct.value = { ...product }
    productForm.value = { 
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category
    }
    
    if (product.image) {
      imagePreview.value = `http://localhost:8000/storage/${product.image}`
    }
  } else {
    editingProduct.value = null
    productForm.value = { name: '', description: '', price: null, stock: null, category: '' }
  }
  productDialog.value = true
}

function handleImageChange(event) {
  const file = event.target.files[0]
  if (!file) return
  
  if (file.size > 2 * 1024 * 1024) {
    notifyError('Image size must be less than 2MB')
    event.target.value = ''
    return
  }
  
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    notifyError('Only JPG, JPEG, PNG files allowed')
    event.target.value = ''
    return
  }
  
  imageFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  imageFile.value = null
  imagePreview.value = null
}

function resetProductForm() {
  productForm.value = { name: '', description: '', price: null, stock: null, category: '' }
  editingProduct.value = null
  clearImage()
}

async function saveProduct() {
  try {
    const formData = new FormData()
    formData.append('name', productForm.value.name)
    formData.append('description', productForm.value.description)
    formData.append('price', productForm.value.price)
    formData.append('stock', productForm.value.stock)
    formData.append('category', productForm.value.category)
    
    if (imageFile.value instanceof File) {
      formData.append('image', imageFile.value)
    }
    
    if (editingProduct.value) {
      formData.append('_method', 'PUT') 
      await api.post(`/updateProduct/${editingProduct.value.id}`, formData)
    } else {
      await api.post('/saveProducts', formData)
    }
    
    await fetchData()
    productDialog.value = false
    resetProductForm()
    success(editingProduct.value ? 'Product updated successfully!' : 'Product added successfully!')
  } catch (error) {
    console.error('Save error:', error)
    notifyError('Failed to save product.')
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await api.delete(`/delete/${id}`)
    await fetchData()
    success('Product deleted successfully!')
  } catch (error) {
    console.error('Delete error:', error)
    notifyError('Failed to delete product.')
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    await api.patch(`/orders/${orderId}`, { status })
    success('Order status updated.')
    await fetchData()
  } catch (error) {
    console.error('Update status error:', error)
    notifyError('Failed to update order status.')
  }
}

const orderStatusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
</script>

<template>
  <div class="admin-page bg-background min-h-screen pb-16">
    <!-- Header -->
    <section class="admin-header bg-surface border-bottom py-8 mb-8">
      <v-container>
        <div class="d-flex align-center justify-space-between flex-wrap gap-4">
          <div class="d-flex align-center">
            <v-icon icon="mdi-shield-crown" size="36" color="primary" class="mr-4" />
            <div>
              <h1 class="text-h2 font-weight-bold mb-1">Admin Dashboard</h1>
              <p class="text-body text-muted">Manage products, orders, and users</p>
            </div>
          </div>
          
          <div v-if="tab === 'products'">
            <AppButton prepend-icon="mdi-plus" @click="openProductDialog()">
              Add Product
            </AppButton>
          </div>
        </div>
      </v-container>
    </section>

    <v-container>
      <!-- Navigation Tabs -->
      <v-tabs v-model="tab" color="primary" class="mb-8 border-bottom">
        <v-tab value="products" class="text-subtitle-1 text-none font-weight-bold tracking-wide">
          <v-icon icon="mdi-package-variant" class="mr-2" size="small" /> Products ({{ products.length }})
        </v-tab>
        <v-tab value="orders" class="text-subtitle-1 text-none font-weight-bold tracking-wide">
          <v-icon icon="mdi-shopping" class="mr-2" size="small" /> Orders ({{ orders.length }})
        </v-tab>
        <v-tab value="users" class="text-subtitle-1 text-none font-weight-bold tracking-wide">
          <v-icon icon="mdi-account-group" class="mr-2" size="small" /> Users ({{ users.length }})
        </v-tab>
      </v-tabs>

      <!-- Loading State -->
      <div v-if="loading" class="py-12">
        <v-row>
          <v-col cols="12" v-for="n in 5" :key="n">
            <SkeletonLoader type="text" height="60px" class="rounded-lg mb-2" />
          </v-col>
        </v-row>
      </div>

      <v-window v-else v-model="tab">
        <!-- Products Tab -->
        <v-window-item value="products">
          <v-card class="rounded-xl border bg-surface" elevation="0">
            <v-table class="admin-table">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Image</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Name</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Category</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Price</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Stock</th>
                  <th class="text-right font-weight-bold text-uppercase text-caption tracking-wide text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id" class="table-row">
                  <td class="py-3">
                    <v-avatar size="48" rounded="lg" class="border">
                      <v-img :src="product.image ? `http://localhost:8000/storage/${product.image}` : '/placeholder-product.jpg'" cover></v-img>
                    </v-avatar>
                  </td>
                  <td class="font-weight-medium">{{ product.name }}</td>
                  <td>
                    <v-chip size="small" color="primary-50" text-color="primary" class="font-weight-bold">
                      {{ product.category }}
                    </v-chip>
                  </td>
                  <td class="font-weight-medium">KES {{ product.price?.toLocaleString() }}</td>
                  <td>
                    <v-chip :color="product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'" size="small" class="font-weight-bold">
                      {{ product.stock }}
                    </v-chip>
                  </td>
                  <td class="text-right">
                    <v-btn icon="mdi-pencil" size="small" variant="text" color="info" @click="openProductDialog(product)"></v-btn>
                    <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteProduct(product.id)"></v-btn>
                  </td>
                </tr>
                <tr v-if="products.length === 0">
                  <td colspan="6" class="text-center py-8 text-muted">No products found</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-window-item>

        <!-- Orders Tab -->
        <v-window-item value="orders">
          <v-card class="rounded-xl border bg-surface" elevation="0">
            <v-table class="admin-table">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Order ID</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Customer</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Total</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Date</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Status</th>
                  <th class="text-right font-weight-bold text-uppercase text-caption tracking-wide text-muted">Update Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id" class="table-row">
                  <td class="font-weight-bold">#{{ order.id }}</td>
                  <td>{{ order.farmer?.name || 'Guest' }}</td>
                  <td class="font-weight-medium">KES {{ order.total_amount?.toLocaleString() }}</td>
                  <td class="text-body-2 text-muted">{{ new Date(order.created_at).toLocaleDateString() }}</td>
                  <td>
                    <v-chip 
                      :color="statusColors[order.status?.toLowerCase()] || 'grey'" 
                      size="small" 
                      class="text-uppercase font-weight-bold"
                    >
                      {{ order.status }}
                    </v-chip>
                  </td>
                  <td class="text-right">
                    <v-select
                      v-model="order.status"
                      :items="orderStatusOptions"
                      density="compact"
                      variant="outlined"
                      hide-details
                      style="max-width: 150px; display: inline-block;"
                      class="status-select"
                      @update:model-value="(val) => updateOrderStatus(order.id, val)"
                    ></v-select>
                  </td>
                </tr>
                <tr v-if="orders.length === 0">
                  <td colspan="6" class="text-center py-8 text-muted">No orders found</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-window-item>

        <!-- Users Tab -->
        <v-window-item value="users">
          <v-card class="rounded-xl border bg-surface" elevation="0">
            <v-table class="admin-table">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Name</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Email</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Phone</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Role</th>
                  <th class="text-left font-weight-bold text-uppercase text-caption tracking-wide text-muted">Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="table-row">
                  <td class="font-weight-medium">
                    <div class="d-flex align-center">
                      <v-avatar size="32" color="primary-lighten-1" class="mr-3">
                        <span class="text-white text-caption font-weight-bold">{{ user.name.charAt(0) }}</span>
                      </v-avatar>
                      {{ user.name }}
                    </div>
                  </td>
                  <td class="text-muted">{{ user.email }}</td>
                  <td class="text-muted">{{ user.phone || 'N/A' }}</td>
                  <td>
                    <v-chip :color="user.role_id === 1 ? 'error' : 'info'" size="small" class="font-weight-bold">
                      {{ user.role_id === 1 ? 'Admin' : 'Customer' }}
                    </v-chip>
                  </td>
                  <td class="text-body-2 text-muted">{{ new Date(user.created_at).toLocaleDateString() }}</td>
                </tr>
                <tr v-if="users.length === 0">
                  <td colspan="5" class="text-center py-8 text-muted">No users found</td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-window-item>
      </v-window>

      <!-- Product Dialog -->
      <v-dialog v-model="productDialog" max-width="600" persistent>
        <v-card class="rounded-xl">
          <v-card-title class="pa-6 border-bottom d-flex justify-space-between align-center">
            <h3 class="text-h4 font-weight-bold m-0">{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
            <v-btn icon="mdi-close" variant="text" size="small" @click="productDialog = false"></v-btn>
          </v-card-title>
          
          <v-card-text class="pa-6">
            <!-- Image Upload Section -->
            <div class="mb-6">
              <label class="text-subtitle-2 font-weight-bold mb-3 d-block text-muted">Product Image</label>
              
              <!-- Image Preview -->
              <div v-if="imagePreview" class="image-preview-container position-relative rounded-lg overflow-hidden border mb-2" style="height: 200px;">
                <v-img :src="imagePreview" height="100%" cover></v-img>
                <div class="image-overlay d-flex align-center justify-center">
                  <v-btn color="error" icon="mdi-delete" @click="clearImage" title="Remove Image"></v-btn>
                </div>
              </div>
              
              <!-- Upload Input -->
              <v-file-input
                v-else
                accept="image/jpeg,image/png,image/jpg"
                label="Click or drag to upload image (JPG, PNG, max 2MB)"
                prepend-icon="mdi-cloud-upload-outline"
                @change="handleImageChange"
                variant="outlined"
                show-size
                color="primary"
                class="dashed-upload"
              ></v-file-input>
            </div>

            <v-text-field 
              v-model="productForm.name" 
              label="Product Name" 
              variant="outlined"
              color="primary"
              class="mb-4"
              hide-details="auto"
            ></v-text-field>
            
            <v-textarea 
              v-model="productForm.description" 
              label="Description" 
              rows="3"
              variant="outlined"
              color="primary"
              class="mb-4"
              hide-details="auto"
            ></v-textarea>
            
            <v-row class="mb-2">
              <v-col cols="12" sm="6">
                <v-text-field 
                  v-model="productForm.price" 
                  label="Price (KES)" 
                  type="number"
                  variant="outlined"
                  color="primary"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field 
                  v-model="productForm.stock" 
                  label="Stock Quantity" 
                  type="number"
                  variant="outlined"
                  color="primary"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-text-field
              v-model="productForm.category"
              label="Category Name (e.g. Seeds, Fertilizers)"
              variant="outlined"
              color="primary"
              hide-details="auto"
              class="mt-2"
            ></v-text-field>
          </v-card-text>
          
          <v-card-actions class="pa-6 border-top bg-grey-lighten-4">
            <v-spacer></v-spacer>
            <AppButton variant="text" @click="productDialog = false" class="mr-2">Cancel</AppButton>
            <AppButton @click="saveProduct" :disabled="!productForm.name || !productForm.price">
              {{ editingProduct ? 'Update Product' : 'Save Product' }}
            </AppButton>
          </v-card-actions>
        </v-card>
      </v-dialog>
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

.gap-4 {
  gap: 16px;
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.admin-table :deep(th) {
  background-color: var(--color-grey-light) !important;
  border-bottom: 2px solid var(--color-border) !important;
}

.table-row {
  transition: background-color var(--transition-fast);
}

.table-row:hover {
  background-color: var(--color-surface-hover);
}

.admin-table :deep(td) {
  border-bottom: 1px solid var(--color-border) !important;
  vertical-align: middle;
}

.status-select :deep(.v-field) {
  border-radius: var(--radius-lg);
}

.image-preview-container {
  border: 1px solid var(--color-border);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.image-preview-container:hover .image-overlay {
  opacity: 1;
}

.dashed-upload :deep(.v-field__outline) {
  border: 2px dashed var(--color-border);
}
</style>
