<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'

const currentSlide = ref(0)
const farmSlides = [
  {
    title: 'Quality Farm Inputs Delivered',
    subtitle: 'Premium seeds, fertilizers & equipment for better yields',
    button: 'Shop Now',
    icon: 'mdi-sprout',
    bgImage: 'linear-gradient(135deg, rgba(27, 94, 32, 0.9) 0%, rgba(46, 125, 50, 0.8) 100%)'
  },
  {
    title: 'Grow More, Earn More',
    subtitle: 'Expert-approved products for maximum productivity',
    button: 'Explore Products',
    icon: 'mdi-chart-line',
    bgImage: 'linear-gradient(135deg, rgba(56, 142, 60, 0.9) 0%, rgba(27, 94, 32, 0.8) 100%)'
  },
  {
    title: 'From Farm to Your Doorstep',
    subtitle: 'Fast delivery across all 47 counties in Kenya',
    button: 'Order Today',
    icon: 'mdi-truck-fast',
    bgImage: 'linear-gradient(135deg, rgba(0, 137, 123, 0.9) 0%, rgba(46, 125, 50, 0.8) 100%)'
  }
]

let slideInterval = null

onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % farmSlides.length
  }, 6000)
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<template>
  <section class="hero-section">
    <!-- Background Slides -->
    <TransitionGroup name="hero-fade">
      <div 
        v-for="(slide, index) in farmSlides" 
        :key="index"
        v-show="currentSlide === index"
        class="hero-bg"
        :style="{ background: slide.bgImage }"
      ></div>
    </TransitionGroup>

    <!-- Floating decorative elements -->
    <div class="farm-animation" aria-hidden="true">
      <div class="floating-shape shape-1"><v-icon icon="mdi-leaf" color="white" opacity="0.1" size="120" /></div>
      <div class="floating-shape shape-2"><v-icon icon="mdi-sprout" color="white" opacity="0.1" size="80" /></div>
    </div>

    <v-container class="fill-height position-relative z-10">
      <v-row align="center" justify="center">
        <v-col cols="12" md="10" lg="8" class="text-center text-white">
          <!-- Animating Icon -->
          <div class="mb-6 slide-in-top">
            <v-icon :icon="farmSlides[currentSlide].icon" size="72" color="white" class="floating-icon" />
          </div>

          <!-- Animating text -->
          <transition name="text-slide" mode="out-in">
            <div :key="currentSlide" class="text-content">
              <h1 class="text-display mb-4 text-shadow">{{ farmSlides[currentSlide].title }}</h1>
              <p class="text-h3 font-weight-regular mb-8 text-shadow-sm opacity-90">
                {{ farmSlides[currentSlide].subtitle }}
              </p>
            </div>
          </transition>

          <div class="d-flex justify-center gap-4 fade-in-up delay-2">
            <AppButton size="x-large" to="/products" class="px-8">
              {{ farmSlides[currentSlide].button }}
            </AppButton>
            <AppButton variant="outline" size="x-large" to="/register" class="px-8 bg-white-transparent">
              Create Account
            </AppButton>
          </div>

          <!-- Dot Indicators -->
          <div class="dot-indicators mt-12 d-flex justify-center gap-2">
            <button
              v-for="(slide, index) in farmSlides"
              :key="index"
              class="dot-btn"
              :class="{ 'active': currentSlide === index }"
              @click="currentSlide = index"
              :aria-label="`Go to slide ${index + 1}`"
            ></button>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.z-10 {
  z-index: 10;
}

.text-shadow {
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.text-shadow-sm {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.opacity-90 {
  opacity: 0.9;
}

.bg-white-transparent {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  color: white !important;
}

.bg-white-transparent:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-color: white !important;
}

.gap-4 {
  gap: 16px;
}

.gap-2 {
  gap: 8px;
}

.dot-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  padding: 0;
}

.dot-btn.active {
  width: 32px;
  border-radius: 8px;
  background-color: white;
}

/* Animations */
.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 1.5s ease;
}
.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}

.text-slide-enter-active,
.text-slide-leave-active {
  transition: all 0.5s ease;
}
.text-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.text-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.floating-icon {
  animation: float 6s ease-in-out infinite;
}

.slide-in-top {
  animation: fadeInDown 1s ease-out forwards;
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 1s ease-out forwards;
}

.delay-2 {
  animation-delay: 0.4s;
}

.farm-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  animation: float 15s ease-in-out infinite;
}

.shape-1 {
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  bottom: 20%;
  right: 15%;
  animation-delay: -5s;
}

@media (max-width: 600px) {
  .hero-section {
    min-height: 90vh;
  }
}
</style>
