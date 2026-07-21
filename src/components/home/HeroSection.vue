<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentSlide = ref(0)

const farmSlides = [
  {
    title: 'Quality Farm Inputs Delivered',
    subtitle: 'Premium seeds, fertilizers & equipment for better yields',
    button: 'Shop Now',
    icon: 'mdi-sprout',
  },
  {
    title: 'Grow More, Earn More',
    subtitle: 'Expert-approved products for maximum productivity',
    button: 'Explore Products',
    icon: 'mdi-chart-line',
  },
  {
    title: 'From Farm to Your Doorstep',
    subtitle: 'Fast delivery across all 47 counties in Kenya',
    button: 'Order Today',
    icon: 'mdi-truck-fast',
  },
]

let slideInterval
onMounted(() => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % farmSlides.length
  }, 5000)
})
onUnmounted(() => {
  clearInterval(slideInterval)
})

function goToProducts() {
  router.push('/products')
}
</script>

<template>
  <section class="hero-section">
    <!-- Background Image Overlay -->
    <div class="hero-bg" />

    <!-- Floating Shapes -->
    <div class="floating-shapes">
      <div class="shape shape-1" />
      <div class="shape shape-2" />
      <div class="shape shape-3" />
      <div class="shape shape-4" />
    </div>

    <v-container class="hero-container" style="max-width: 1280px;">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" md="10" lg="8" class="text-center hero-content">
          <!-- Animated Icon -->
          <div class="hero-icon-wrapper mb-6">
            <transition name="fade" mode="out-in">
              <v-icon
                :key="currentSlide"
                :icon="farmSlides[currentSlide].icon"
                size="72"
                color="white"
                class="hero-icon"
              />
            </transition>
          </div>

          <!-- Animated Title -->
          <transition name="slide-up" mode="out-in">
            <h1 :key="'title-' + currentSlide" class="hero-title mb-4">
              {{ farmSlides[currentSlide].title }}
            </h1>
          </transition>

          <!-- Animated Subtitle -->
          <transition name="fade" mode="out-in">
            <p :key="'sub-' + currentSlide" class="hero-subtitle mb-8">
              {{ farmSlides[currentSlide].subtitle }}
            </p>
          </transition>

          <!-- CTA Buttons -->
          <div class="hero-buttons mb-10">
            <v-btn
              size="x-large"
              class="hero-btn-primary mr-4"
              @click="goToProducts"
              rounded="xl"
            >
              <v-icon icon="mdi-storefront" class="mr-2" />
              {{ farmSlides[currentSlide].button }}
            </v-btn>
            <v-btn
              variant="outlined"
              color="white"
              size="x-large"
              to="/register"
              rounded="xl"
              class="hero-btn-secondary"
            >
              <v-icon icon="mdi-account-plus" class="mr-2" />
              Create Account
            </v-btn>
          </div>

          <!-- Dot Indicators -->
          <div class="dot-indicators">
            <button
              v-for="(slide, index) in farmSlides"
              :key="index"
              class="dot"
              :class="{ active: currentSlide === index }"
              @click="currentSlide = index"
              :aria-label="'Go to slide ' + (index + 1)"
            >
              <span class="dot-inner" />
            </button>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(27, 94, 32, 0.92) 0%, rgba(46, 125, 50, 0.85) 50%, rgba(0, 137, 123, 0.80) 100%),
    url('/farm.jpg') center/cover no-repeat;
  z-index: 0;
}

.hero-container {
  position: relative;
  z-index: 2;
}

.hero-content {
  animation: fadeIn 0.8s ease-out;
}

/* Floating Shapes */
.floating-shapes {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -60px;
  right: -60px;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  left: -40px;
  animation: float 10s ease-in-out infinite 2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 40%;
  right: 15%;
  animation: float 7s ease-in-out infinite 1s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  right: 30%;
  animation: float 9s ease-in-out infinite 3s;
}

/* Icon */
.hero-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.hero-icon {
  animation: bounceSubtle 3s ease-in-out infinite;
}

/* Title */
.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: white;
  line-height: 1.15;
  letter-spacing: -1px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

/* Subtitle */
.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.35rem);
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Buttons */
.hero-btn-primary {
  background: white !important;
  color: var(--color-primary-dark) !important;
  font-weight: 700 !important;
  letter-spacing: 0.3px;
  text-transform: none !important;
  transition: transform 0.2s, box-shadow 0.2s !important;
}

.hero-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25) !important;
}

.hero-btn-secondary {
  border-width: 2px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  transition: background 0.2s, transform 0.2s !important;
}

.hero-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  transform: translateY(-2px);
}

/* Dot Indicators */
.dot-indicators {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
}

.dot.active {
  border-color: white;
}

.dot-inner {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: transparent;
  transition: background 0.3s, transform 0.3s;
}

.dot.active .dot-inner {
  background: white;
  transform: scale(1.2);
}

/* Transitions */
.slide-up-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-leave-active {
  transition: all 0.3s ease-in;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active {
  transition: opacity 0.5s ease 0.1s;
}
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 600px) {
  .hero-section {
    min-height: 80vh;
  }

  .hero-icon-wrapper {
    width: 90px;
    height: 90px;
  }

  .hero-icon {
    font-size: 48px !important;
  }

  .hero-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .hero-btn-primary,
  .hero-btn-secondary {
    width: 100%;
    max-width: 280px;
    margin-right: 0 !important;
  }
}
</style>
