<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const mobileDrawer = ref(false)

const isLoggedIn = computed(() => {
  return authStore.isLoggedIn || localStorage.getItem('authToken') !== null
})
const isAdmin = computed(() => {
  return authStore.isAdmin || localStorage.getItem('isAdmin') === 'true'
})
const cartCount = computed(() => cartStore.itemCount || 0)

const navLinks = [
  { title: 'Products', to: '/products', icon: 'mdi-storefront' },
  { title: 'Cart', to: '/cart', icon: 'mdi-cart' },
  { title: 'Orders', to: '/orders', icon: 'mdi-package-variant-closed' },
]

function logout() {
  authStore.logout()
  localStorage.removeItem('authToken')
  localStorage.removeItem('isAdmin')
  router.push('/')
}
</script>

<template>
  <!-- Desktop & Tablet Navbar -->
  <v-app-bar
    class="navbar"
    elevation="0"
    height="72"
  >
    <v-container class="d-flex align-center py-0" style="max-width: 1280px;">
      <!-- Logo -->
      <router-link to="/" class="d-flex align-center text-decoration-none">
        <v-avatar size="40" color="primary" class="mr-3">
          <v-icon icon="mdi-sprout" color="white" size="24" />
        </v-avatar>
        <span class="brand-name text-h6 font-weight-bold">
          Vuna<span class="text-secondary">Online</span>
        </span>
      </router-link>

      <v-spacer />

      <!-- Desktop Navigation Links -->
      <div class="d-none d-md-flex align-center ga-1">
        <template v-if="isLoggedIn">
          <v-btn
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            variant="text"
            class="nav-link"
            :prepend-icon="link.icon"
          >
            {{ link.title }}
            <!-- Cart Badge -->
            <v-badge
              v-if="link.to === '/cart' && cartCount > 0"
              :content="cartCount"
              color="secondary"
              floating
              class="cart-badge"
            />
          </v-btn>

          <v-btn
            v-if="isAdmin"
            to="/admin"
            variant="text"
            class="nav-link"
            prepend-icon="mdi-shield-crown"
          >
            Admin
          </v-btn>

          <!-- User Menu -->
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                class="ml-2"
              >
                <v-avatar size="36" color="primary-darken-1">
                  <v-icon icon="mdi-account" color="white" size="20" />
                </v-avatar>
              </v-btn>
            </template>
            <v-list rounded="lg" class="pa-2" elevation="8" min-width="200">
              <v-list-item to="/orders" prepend-icon="mdi-package-variant" rounded="lg">
                <v-list-item-title>My Orders</v-list-item-title>
              </v-list-item>
              <v-divider class="my-1" />
              <v-list-item @click="logout" prepend-icon="mdi-logout" rounded="lg" base-color="error">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <!-- Not Logged In -->
        <template v-else>
          <v-btn to="/products" variant="text" class="nav-link" prepend-icon="mdi-storefront">
            Products
          </v-btn>
          <v-btn
            to="/login"
            variant="outlined"
            color="primary"
            class="ml-2"
            prepend-icon="mdi-login"
          >
            Login
          </v-btn>
          <v-btn
            to="/register"
            color="primary"
            class="ml-2 btn-primary"
            prepend-icon="mdi-account-plus"
          >
            Sign Up
          </v-btn>
        </template>
      </div>

      <!-- Mobile Hamburger -->
      <v-btn
        icon="mdi-menu"
        variant="text"
        class="d-md-none"
        @click="mobileDrawer = !mobileDrawer"
        aria-label="Open menu"
      />
    </v-container>
  </v-app-bar>

  <!-- Mobile Navigation Drawer -->
  <v-navigation-drawer
    v-model="mobileDrawer"
    location="right"
    temporary
    width="300"
    class="mobile-drawer"
  >
    <div class="pa-6">
      <!-- Drawer Header -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center">
          <v-avatar size="36" color="primary" class="mr-3">
            <v-icon icon="mdi-sprout" color="white" size="20" />
          </v-avatar>
          <span class="text-h6 font-weight-bold">
            Vuna<span class="text-secondary">Online</span>
          </span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="mobileDrawer = false" />
      </div>

      <v-divider class="mb-4" />

      <!-- Mobile Links -->
      <v-list nav class="px-0">
        <template v-if="isLoggedIn">
          <v-list-item
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            :prepend-icon="link.icon"
            rounded="lg"
            class="mb-1"
            @click="mobileDrawer = false"
          >
            <v-list-item-title class="font-weight-medium">{{ link.title }}</v-list-item-title>
            <template v-slot:append v-if="link.to === '/cart' && cartCount > 0">
              <v-chip size="small" color="secondary">{{ cartCount }}</v-chip>
            </template>
          </v-list-item>

          <v-list-item
            v-if="isAdmin"
            to="/admin"
            prepend-icon="mdi-shield-crown"
            rounded="lg"
            class="mb-1"
            @click="mobileDrawer = false"
          >
            <v-list-item-title class="font-weight-medium">Admin</v-list-item-title>
          </v-list-item>

          <v-divider class="my-3" />

          <v-list-item
            prepend-icon="mdi-logout"
            rounded="lg"
            base-color="error"
            @click="logout(); mobileDrawer = false"
          >
            <v-list-item-title class="font-weight-medium">Logout</v-list-item-title>
          </v-list-item>
        </template>

        <template v-else>
          <v-list-item
            to="/products"
            prepend-icon="mdi-storefront"
            rounded="lg"
            class="mb-1"
            @click="mobileDrawer = false"
          >
            <v-list-item-title class="font-weight-medium">Products</v-list-item-title>
          </v-list-item>

          <v-divider class="my-3" />

          <v-btn
            to="/login"
            variant="outlined"
            color="primary"
            block
            class="mb-3"
            size="large"
            @click="mobileDrawer = false"
          >
            Login
          </v-btn>
          <v-btn
            to="/register"
            color="primary"
            block
            class="btn-primary"
            size="large"
            @click="mobileDrawer = false"
          >
            Sign Up
          </v-btn>
        </template>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(46, 125, 50, 0.08) !important;
  z-index: 1000;
}

.brand-name {
  color: var(--color-primary-dark);
  letter-spacing: -0.5px;
}

.text-secondary {
  color: var(--color-secondary) !important;
}

.nav-link {
  font-weight: 500 !important;
  letter-spacing: 0.2px;
  color: var(--color-on-surface) !important;
  position: relative;
  text-transform: none !important;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 2px;
  transition: width var(--transition-base), left var(--transition-base);
}

.nav-link:hover::after,
.nav-link.v-btn--active::after {
  width: 60%;
  left: 20%;
}

.mobile-drawer {
  z-index: 1100 !important;
}

.cart-badge :deep(.v-badge__badge) {
  font-size: 11px;
  font-weight: 700;
}
</style>
