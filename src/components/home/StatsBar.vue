<script setup>
import { ref, onMounted } from 'vue'

const stats = [
  { value: '10K+', label: 'Happy Farmers', icon: 'mdi-emoticon-happy' },
  { value: '500+', label: 'Products', icon: 'mdi-package-variant' },
  { value: '47', label: 'Counties', icon: 'mdi-map-marker' },
  { value: '24/7', label: 'Support', icon: 'mdi-headset' },
]

const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  const el = document.querySelector('.stats-section')
  if (el) observer.observe(el)
})
</script>

<template>
  <section class="stats-section">
    <v-container style="max-width: 1280px;">
      <v-row>
        <v-col
          v-for="(stat, index) in stats"
          :key="stat.label"
          cols="6"
          md="3"
          class="text-center"
        >
          <div
            class="stat-item"
            :class="{ 'is-visible': isVisible }"
            :style="{ transitionDelay: index * 0.15 + 's' }"
          >
            <div class="stat-icon-wrapper mb-3">
              <v-icon :icon="stat.icon" size="28" color="white" />
            </div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.stats-section {
  background: linear-gradient(135deg, #1B5E20, #2E7D32);
  padding: 40px 0;
  position: relative;
}

.stat-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  padding: 16px 0;
}

.stat-item.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.stat-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  margin-top: 4px;
}

@media (max-width: 600px) {
  .stat-value {
    font-size: 1.5rem;
  }

  .stat-icon-wrapper {
    width: 48px;
    height: 48px;
  }
}
</style>
