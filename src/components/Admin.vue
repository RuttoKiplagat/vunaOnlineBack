<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const tab = ref('products');
const products = ref([]);
const orders = ref([]);
const users = ref([]);
const loading = ref(false);

const productDialog = ref(false);
const editingProduct = ref(null);
const productForm = ref({
  name: '',
  description: '',
  price: null,
  stock: null,
  category: ''
});

const imageFile = ref(null);
const imagePreview = ref(null);

const categories = ref([]);
//const categoriesNames = ['Seeds', 'Fertilizers', 'Pesticides', 'Animal Feeds', 'Irrigation Equipment', 'Tools', 'Others'];

onMounted(() => {
  fetchData();
});

async function fetchData() {
  loading.value = true;
  try {
    const [prodRes, orderRes, userRes, catRes] = await Promise.all([
      api.get('/getProducts'),
      api.get('/orders'),
      api.get('/users'),
      api.get('/getCategories')
    ]);
    products.value = prodRes.data;
    orders.value = orderRes.data;
    users.value = userRes.data;
    categories.value = catRes.data;
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Failed to load data: ' + (error.response?.data?.message || error.message));
  } finally {
    loading.value = false;
  }
}

function openProductDialog(product = null) {
  imageFile.value = null;
  imagePreview.value = null;
  
  if (product) {
    editingProduct.value = { ...product };
    productForm.value = { 
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category
    };
    
    if (product.image) {
      imagePreview.value = `/storage/${product.image}`;
    }
  } else {
    editingProduct.value = null;
    productForm.value = { name: '', description: '', price: null, stock: null, category: '' };
  }
  productDialog.value = true;
}

function handleImageChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) {
    alert('Image size must be less than 2MB');
    event.target.value = '';
    return;
  }
  
  if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
    alert('Only JPG, JPEG, PNG files allowed');
    event.target.value = '';
    return;
  }
  
  imageFile.value = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.onerror = () => {
    alert('Failed to read image file');
  };
  reader.readAsDataURL(file);
}

function clearImage() {
  imageFile.value = null;
  imagePreview.value = null;
}

function resetProductForm() {
  productForm.value = { name: '', description: '', price: null, stock: null, category: '' };
  editingProduct.value = null;
  clearImage();
}

async function saveProduct() {
  try {
    const formData = new FormData();
    formData.append('name', productForm.value.name);
    formData.append('description', productForm.value.description);
    formData.append('price', productForm.value.price);
    formData.append('stock', productForm.value.stock);
    formData.append('category', productForm.value.category);
    
    if (imageFile.value instanceof File) {
    formData.append('image', imageFile.value);
  }
    
    if (editingProduct.value) {
    formData.append('_method', 'PUT'); 
    await api.post(`/updateProduct/${editingProduct.value.id}`, formData); 
} else {
    await api.post('/saveProducts', formData);
}
    
    await fetchData();
    productDialog.value = false;
    resetProductForm();
    alert('Product saved successfully!');
  } catch (error) {
    console.error('Save error:', error);
    alert('Failed to save product: ' + (error.response?.data?.message || error.message));
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  try {
    await api.delete(`/delete/${id}`);
    await fetchData();
    alert('Product deleted successfully!');
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete product: ' + (error.response?.data?.message || error.message));
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    await api.patch(`/orders/${orderId}`, { status });
    await fetchData();
  } catch (error) {
    console.error('Update status error:', error);
    alert('Failed to update order status: ' + (error.response?.data?.message || error.message));
  }
}

const orderStatusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
</script>

<template>
  <v-container class="py-6">
    <h1 class="text-h4 mb-6">Admin Dashboard</h1>
    
    <v-tabs v-model="tab" class="mb-4">
      <v-tab value="products">Products ({{ products.length }})</v-tab>
      <v-tab value="orders">Orders ({{ orders.length }})</v-tab>
      <v-tab value="users">Users ({{ users.length }})</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- Products Tab -->
      <v-window-item value="products">
        <v-btn color="green-darken-2" class="mb-4" @click="openProductDialog()" prepend-icon="mdi-plus">
          Add Product
        </v-btn>
        
        <v-table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>
                <v-avatar size="50" rounded>
                  <v-img :src="product.image ? `/storage/${product.image}` : '/placeholder.jpg'" cover></v-img>
                </v-avatar>
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>KES {{ product.price }}</td>
              <td>
                <v-chip :color="product.stock > 10 ? 'green' : product.stock > 0 ? 'orange' : 'red'" size="small">
                  {{ product.stock }}
                </v-chip>
              </td>
              <td>
                <v-btn icon="mdi-pencil" size="small" variant="text" @click="openProductDialog(product)"></v-btn>
                <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteProduct(product.id)"></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-window-item>

      <!-- Orders Tab -->
      <v-window-item value="orders">
        <v-table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.farmer?.name }}</td>
              <td>KES {{ order.total_amount }}</td>
              <td>
                <v-chip :color="order.status === 'delivered' ? 'green' : 'orange'" size="small">
                  {{ order.status }}
                </v-chip>
              </td>
              <td>{{ new Date(order.created_at).toLocaleDateString() }}</td>
              <td>
                <v-select
                  v-model="order.status"
                  :items="orderStatusOptions"
                  density="compact"
                  variant="outlined"
                  style="width: 150px"
                  @update:model-value="(val) => updateOrderStatus(order.id, val)"
                ></v-select>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-window-item>

      <!-- Users Tab -->
      <v-window-item value="users">
        <v-table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <v-chip :color="user.role_id === 1 ? 'red' : 'blue'" size="small">
                  {{ user.role_id === 1 ? 'Admin' : 'Customer' }}
                </v-chip>
              </td>
              <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-window-item>
    </v-window>

    <!-- Product Dialog with Image Upload -->
    <v-dialog v-model="productDialog" max-width="600">
      <v-card>
        <v-card-title>{{ editingProduct ? 'Edit Product' : 'Add Product' }}</v-card-title>
        <v-card-text>
          <!-- Image Upload Section -->
          <div class="mb-4">
            <label class="text-subtitle-2 mb-2 d-block">Product Image</label>
            
            <!-- Image Preview -->
            <div v-if="imagePreview" class="position-relative mb-2">
              <v-img
                :src="imagePreview"
                height="150"
                cover
                rounded
                class="bg-grey-lighten-3"
              ></v-img>
              <v-btn
                icon="mdi-close"
                color="error"
                size="small"
                class="position-absolute top-0 right-0 ma-2"
                @click="clearImage"
              ></v-btn>
            </div>
            
            
            <v-file-input
              v-else
              accept="image/jpeg,image/png,image/jpg"
              label="Choose image (JPG, PNG, max 2MB)"
              prepend-icon="mdi-camera"
              @change="handleImageChange"
              show-size
              truncate-length="25"
            ></v-file-input>
          </div>

          <v-text-field 
            v-model="productForm.name" 
            label="Product Name" 
            required
            prepend-inner-icon="mdi-tag"
          ></v-text-field>
          
          <v-textarea 
            v-model="productForm.description" 
            label="Description" 
            rows="3"
            prepend-inner-icon="mdi-text"
          ></v-textarea>
          
          <v-row>
            <v-col cols="6">
              <v-text-field 
                v-model="productForm.price" 
                label="Price (KES)" 
                type="number"
                prefix="KES"
                prepend-inner-icon="mdi-currency-usd"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field 
                v-model="productForm.stock" 
                label="Stock Quantity" 
                type="number"
                prepend-inner-icon="mdi-package-variant"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <v-text-field
            v-model="productForm.category"
            
            item-title="name"
            item-value="id"
            label="Category"
            prepend-inner-icon="mdi-folder"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="productDialog = false">Cancel</v-btn>
          <v-btn color="green-darken-2" @click="saveProduct" :disabled="!productForm.name">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

