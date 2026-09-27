<script setup>
const stats = [
  { values: '10K+', label: 'Happy Farmers', icon: 'mdi-emoticon-happy' },
  { values: '500+', label: 'Products Available', icon: 'mdi-package-variant' },
  { values: '47', label: 'Counties Served', icon: 'mdi-map-marker' },
  { values: '24/7', label: 'Customer Support', icon: 'mdi-headset' }
]

const features = [
  { icon: 'mdi-certificate', title: 'Certified Products', desc: 'All products meet Kenya Bureau of Standards' },
  { icon: 'mdi-truck-delivery-outline', title: 'Free Delivery', desc: 'Free shipping on orders above KES 5,000' },
  { icon: 'mdi-headset', title: 'Expert Support', desc: 'Access to agronomists and farming experts' },
  { icon: 'mdi-refresh', title: 'Easy Returns', desc: '30-day return policy for unused products' }
]
</script>

<template>
  <div>
    <!-- Stats Banner -->
    <v-sheet class="stats-banner" color="primary-darken-1">
      <v-container>
        <v-row>
          <v-col 
            v-for="stat in stats" 
            :key="stat.label" 
            cols="6" md="3" 
            class="text-center py-6 stat-item"
          >
            <v-icon :icon="stat.icon" color="white" size="36" class="mb-3 opacity-80" />
            <div class="text-h2 text-white font-weight-bold mb-1">{{ stat.values }}</div>
            <div class="text-body text-primary-50 font-weight-medium text-uppercase tracking-wide">{{ stat.label }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>

    <!-- Features Section -->
    <section class="section-padding bg-background">
      <v-container>
        <div class="section-header">
          <h2 class="section-title">Why Choose VunaOnline</h2>
          <p class="section-subtitle">We are committed to providing the best value and support to Kenyan farmers.</p>
          <div class="section-divider"></div>
        </div>

        <v-row class="mt-8 align-center">
          <v-col cols="12" md="6" class="pr-md-12 mb-8 mb-md-0">
            <div class="image-wrapper rounded-2xl overflow-hidden shadow-xl relative">
              <v-img
                src="/farm.jpg"
                alt="Farmer in the field"
                height="500"
                cover
                class="feature-image"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                  </div>
                </template>
              </v-img>
              <div class="image-overlay"></div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="features-list">
              <div 
                v-for="(feature, index) in features" 
                :key="feature.title"
                class="feature-item mb-8 d-flex align-start fade-in-up"
                :style="{ animationDelay: `${index * 0.15}s` }"
              >
                <div class="feature-icon mr-5">
                  <v-icon :icon="feature.icon" color="primary" size="28" />
                </div>
                <div>
                  <h3 class="text-h3 font-weight-bold mb-2">{{ feature.title }}</h3>
                  <p class="text-body text-muted">{{ feature.desc }}</p>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<style scoped>
.stats-banner {
  background: linear-gradient(90deg, var(--color-primary-dark) 0%, var(--color-primary) 100%) !important;
  position: relative;
  overflow: hidden;
}

.stats-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CgkJPHBhdGggZD0iTTAgMGg0MHY0MEgwem0yMCAyMGgtdjIwSDIweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KCTwvc3ZnPg==');
  opacity: 0.3;
}

.stat-item {
  position: relative;
  z-index: 1;
}

.opacity-80 {
  opacity: 0.8;
}

.tracking-wide {
  letter-spacing: 1px;
}

.image-wrapper {
  position: relative;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
}

.feature-image {
  transition: transform 10s ease;
}

.image-wrapper:hover .feature-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(27, 94, 32, 0.4), transparent);
  pointer-events: none;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-xl);
  background-color: var(--color-primary-50);
  box-shadow: inset 0 0 0 1px rgba(46, 125, 50, 0.1);
  flex-shrink: 0;
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
