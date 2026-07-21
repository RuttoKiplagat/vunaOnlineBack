import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import api from '@/services/api'


export const useProductsStore = defineStore('products', () => {
const products = ref([])
const categories = ref([])
const currentProduct = ref([null])
const loading = ref(false)
const error = ref(null)


const featuredProducts = computed(() => products.value.slice(0, 4))

const productsByCategory = computed(() => {
    return (category) => {
        if (!category) 
            return products.value;
            return products.value.filter(p => p.category === category)
        }
    
    })

const inStockProducts = computed(() => {
return products.value.filter(p => p.stock > 0)})


async  function fetchProducts(category = null){
    loading.value = true
    error.value = null
try {
    const url = category ? `/getProducts?category=${category}` : "/getProducts"
    const response = await api.get(url)
    products.value = response.data
    return  products.value
} catch (err){
    error.value = err.repsonse?.data?.message || "Failed to fetch products"
    throw err
} finally {
    loading.value = false
}
}

async function fetchCategories() {
    loading.value = true

    try {
        const response = await api.get('/getCategories')
        categories.value = response.data
        return categories.value
    } catch (err) {
        error.value = err.response?.data?.message || 'failed to fetch categories'
        throw err
    } finally {
        loading.value = false
    }
}

async function fetchProduct(id) {
    loading.value = true
    error.value = null

    try{
        const response = await api.get(`/getProduct/${id}`)
        currentProduct.value = response.data
        return currentProduct.value
    } catch (err){
        error = err.response?.data?.message || 'Failed to fetch product'
    } finally {
        loading.value = false
    }
}
function reset(){
    products.value= []
    categories.value= []
    currentProduct.value = null
    error.value = null
}
return {
    products,
    categories,
    currentProduct,
    loading,
    error,

    featuredProducts,
    productsByCategory,
    inStockProducts,

    fetchProducts,
    fetchCategories,
    fetchProduct,
    reset
}
}
)
