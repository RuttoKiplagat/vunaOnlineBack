<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())

const footerLinks = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', to: '/products' },
      { name: 'Seeds', to: '/products?category=Seeds' },
      { name: 'Fertilizers', to: '/products?category=Fertilizers' },
      { name: 'Equipment', to: '/products?category=Equipment' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', to: '/' },
      { name: 'Contact', to: '/' },
      { name: 'Careers', to: '/' },
      { name: 'Blog', to: '/' },
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', to: '/' },
      { name: 'Shipping Info', to: '/' },
      { name: 'Returns', to: '/' },
      { name: 'Track Order', to: '/orders' },
    ]
  }
]
</script>

<template>
  <v-footer class="app-footer">
    <v-container>
      <v-row class="py-8">
        <v-col cols="12" md="4" class="mb-6 mb-md-0">
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-leaf" color="primary-light" size="32" class="mr-2" />
            <span class="text-h2 text-white font-weight-bold" style="font-size: 1.5rem !important;">VunaOnline</span>
          </div>
          <p class="text-body text-primary-50 mb-6 max-w-sm pr-md-8">
            Kenya's premier agricultural platform. Providing farmers with quality inputs, tools, and expertise for maximum yields.
          </p>
          <div class="d-flex gap-4">
            <v-btn icon="mdi-facebook" variant="text" color="white" density="comfortable" />
            <v-btn icon="mdi-twitter" variant="text" color="white" density="comfortable" />
            <v-btn icon="mdi-instagram" variant="text" color="white" density="comfortable" />
          </div>
        </v-col>

        <v-col 
          v-for="(group, i) in footerLinks" 
          :key="i"
          cols="6" 
          md="2"
        >
          <h4 class="text-h3 text-white mb-4" style="font-size: 1.1rem !important;">{{ group.title }}</h4>
          <ul class="footer-links">
            <li v-for="link in group.links" :key="link.name" class="mb-2">
              <router-link :to="link.to" class="footer-link">
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </v-col>

        <v-col cols="12" md="2">
          <h4 class="text-h3 text-white mb-4" style="font-size: 1.1rem !important;">Contact</h4>
          <ul class="footer-links">
            <li class="mb-2 text-primary-50 d-flex align-start">
              <v-icon icon="mdi-map-marker" size="small" class="mr-2 mt-1" />
              <span>Nairobi, Kenya</span>
            </li>
            <li class="mb-2 text-primary-50 d-flex align-start">
              <v-icon icon="mdi-phone" size="small" class="mr-2 mt-1" />
              <span>+254 700 000 000</span>
            </li>
            <li class="mb-2 text-primary-50 d-flex align-start">
              <v-icon icon="mdi-email" size="small" class="mr-2 mt-1" />
              <span>info@vunaonline.co.ke</span>
            </li>
          </ul>
        </v-col>
      </v-row>

      <v-divider class="border-opacity-25 my-4" color="white"></v-divider>

      <v-row class="py-4 align-center">
        <v-col cols="12" md="6" class="text-center text-md-left text-caption text-primary-50">
          &copy; {{ currentYear }} VunaOnline. All rights reserved.
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-right text-caption">
          <a href="#" class="footer-link mr-4">Privacy Policy</a>
          <a href="#" class="footer-link">Terms of Service</a>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--color-primary-dark) !important;
  color: white;
  padding: 0;
  margin-top: auto;
}

.footer-links {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  color: var(--color-primary-50);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.footer-link:hover {
  color: var(--color-accent);
}

.gap-4 {
  gap: 16px;
}
</style>
