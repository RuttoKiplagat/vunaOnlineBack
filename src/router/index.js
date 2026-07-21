import HomePage from '@/components/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Product from '@/components/Product.vue'
import Cart from '@/components/Cart.vue'
import Login from '@/components/Login.vue'
import Orders from '@/components/Orders.vue'
import Register from '@/components/Register.vue'
import Admin from '@/components/Admin.vue'
import checkOut from '@/components/checkOut.vue' 


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: HomePage,
    },
    {
      path: '/products',
      name: 'products',
      component: Product,
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: checkOut,
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/Admin',
      name: 'admin',
      component: Admin,
    },
    
    
  ],
})

export default router
