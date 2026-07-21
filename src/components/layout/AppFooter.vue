<script setup>
const currentYear = new Date().getFullYear()

const quickLinks = [
  { title: 'Seeds', to: '/products?category=1' },
  { title: 'Fertilizers', to: '/products?category=2' },
  { title: 'Pesticides', to: '/products?category=3' },
  { title: 'Equipment', to: '/products?category=4' },
  { title: 'Animal Feed', to: '/products?category=5' },
]

const customerLinks = [
  { title: 'My Account', to: '/login' },
  { title: 'My Orders', to: '/orders' },
  { title: 'Shopping Cart', to: '/cart' },
  { title: 'Register', to: '/register' },
]

const socialLinks = [
  { icon: 'mdi-facebook', url: '#', label: 'Facebook' },
  { icon: 'mdi-twitter', url: '#', label: 'Twitter' },
  { icon: 'mdi-instagram', url: '#', label: 'Instagram' },
  { icon: 'mdi-whatsapp', url: '#', label: 'WhatsApp' },
]
</script>

<template>
  <footer class="app-footer">
    <!-- Wave Divider -->
    <div class="wave-divider">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C360,100 720,0 1080,60 C1260,80 1380,40 1440,40 L1440,100 L0,100 Z" fill="#1B5E20"/>
      </svg>
    </div>

    <div class="footer-body">
      <v-container style="max-width: 1280px;">
        <v-row class="py-8">
          <!-- Company Info -->
          <v-col cols="12" sm="6" lg="3" class="mb-6 mb-lg-0">
            <div class="d-flex align-center mb-4">
              <v-avatar size="42" color="white" class="mr-3">
                <v-icon icon="mdi-sprout" color="primary" size="24" />
              </v-avatar>
              <span class="text-h6 font-weight-bold text-white">
                Vuna<span class="text-amber">Online</span>
              </span>
            </div>
            <p class="footer-text mb-4">
              Kenya's trusted online farm shop. Quality seeds, fertilizers, and farming tools delivered to your doorstep.
            </p>
            <!-- Social Links -->
            <div class="d-flex ga-2">
              <v-btn
                v-for="social in socialLinks"
                :key="social.label"
                :icon="social.icon"
                :href="social.url"
                :aria-label="social.label"
                variant="tonal"
                color="white"
                size="small"
                class="social-btn"
              />
            </div>
          </v-col>

          <!-- Quick Links -->
          <v-col cols="6" sm="6" lg="2" class="mb-6 mb-lg-0">
            <h4 class="footer-heading mb-4">Shop</h4>
            <ul class="footer-links">
              <li v-for="link in quickLinks" :key="link.title">
                <router-link :to="link.to" class="footer-link">
                  {{ link.title }}
                </router-link>
              </li>
            </ul>
          </v-col>

          <!-- Customer Service -->
          <v-col cols="6" sm="6" lg="2" class="mb-6 mb-lg-0">
            <h4 class="footer-heading mb-4">Account</h4>
            <ul class="footer-links">
              <li v-for="link in customerLinks" :key="link.title">
                <router-link :to="link.to" class="footer-link">
                  {{ link.title }}
                </router-link>
              </li>
            </ul>
          </v-col>

          <!-- Contact Info -->
          <v-col cols="12" sm="6" lg="3" class="mb-6 mb-lg-0">
            <h4 class="footer-heading mb-4">Contact Us</h4>
            <div class="footer-contact">
              <div class="d-flex align-start mb-3">
                <v-icon icon="mdi-map-marker" size="20" color="amber" class="mr-3 mt-1" />
                <span class="footer-text">Nairobi, Kenya<br>Tom Mboya Street</span>
              </div>
              <div class="d-flex align-center mb-3">
                <v-icon icon="mdi-phone" size="20" color="amber" class="mr-3" />
                <span class="footer-text">+254 700 000 000</span>
              </div>
              <div class="d-flex align-center mb-3">
                <v-icon icon="mdi-email" size="20" color="amber" class="mr-3" />
                <span class="footer-text">info@vunaonline.co.ke</span>
              </div>
              <div class="d-flex align-center">
                <v-icon icon="mdi-clock-outline" size="20" color="amber" class="mr-3" />
                <span class="footer-text">Mon - Sat: 8AM - 6PM</span>
              </div>
            </div>
          </v-col>

          <!-- Newsletter -->
          <v-col cols="12" sm="6" lg="2">
            <h4 class="footer-heading mb-4">Newsletter</h4>
            <p class="footer-text mb-3">Get updates on new products and farming tips.</p>
            <v-text-field
              placeholder="Your email"
              variant="solo"
              density="compact"
              bg-color="rgba(255,255,255,0.12)"
              hide-details
              class="mb-2 newsletter-input"
              append-inner-icon="mdi-send"
            />
          </v-col>
        </v-row>

        <v-divider color="rgba(255,255,255,0.15)" class="my-4" />

        <!-- Bottom Bar -->
        <div class="d-flex flex-column flex-sm-row justify-space-between align-center py-4">
          <p class="footer-text text-body-2 mb-2 mb-sm-0">
            © {{ currentYear }} Vuna Online. All rights reserved.
          </p>
          <div class="d-flex align-center ga-3">
            <v-icon icon="mdi-cellphone" size="24" color="rgba(255,255,255,0.5)" title="M-Pesa" />
            <v-icon icon="mdi-credit-card" size="24" color="rgba(255,255,255,0.5)" title="Visa" />
            <v-icon icon="mdi-bank" size="24" color="rgba(255,255,255,0.5)" title="Bank Transfer" />
            <v-icon icon="mdi-cash" size="24" color="rgba(255,255,255,0.5)" title="Cash" />
          </div>
        </div>
      </v-container>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  position: relative;
  margin-top: auto;
}

.wave-divider {
  margin-bottom: -2px;
  line-height: 0;
}

.wave-divider svg {
  width: 100%;
  height: 60px;
  display: block;
}

.footer-body {
  background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #1B5E20 100%);
}

.footer-heading {
  color: white;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  padding-bottom: 10px;
}

.footer-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 3px;
  background: var(--color-secondary);
  border-radius: 3px;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-fast), padding-left var(--transition-fast);
  display: inline-block;
}

.footer-link:hover {
  color: white;
  padding-left: 6px;
}

.social-btn {
  transition: transform var(--transition-fast) !important;
}

.social-btn:hover {
  transform: translateY(-3px);
}

.text-amber {
  color: #FFB300 !important;
}

.newsletter-input :deep(.v-field) {
  border-radius: 10px !important;
  color: white !important;
}

.newsletter-input :deep(input::placeholder) {
  color: rgba(255, 255, 255, 0.5) !important;
}
</style>
