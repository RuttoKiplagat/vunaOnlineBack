<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = [
  { id: 1, name: 'Seeds', icon: 'mdi-seed', gradient: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', iconColor: '#2E7D32', count: '45 Products' },
  { id: 2, name: 'Fertilizers', icon: 'mdi-sack', gradient: 'linear-gradient(135deg, #FFF8E1, #FFECB3)', iconColor: '#F57F17', count: '32 Products' },
  { id: 3, name: 'Pesticides', icon: 'mdi-spray', gradient: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)', iconColor: '#C62828', count: '28 Products' },
  { id: 4, name: 'Equipment', icon: 'mdi-tools', gradient: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', iconColor: '#1565C0', count: '56 Products' },
  { id: 5, name: 'Animal Feed', icon: 'mdi-barley', gradient: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', iconColor: '#E65100', count: '24 Products' },
  { id: 6, name: 'Irrigation', icon: 'mdi-water', gradient: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', iconColor: '#00838F', count: '18 Products' },
]

function goToCategory(categoryId) {
  router.push(`/products?category=${categoryId}`)
}
</script>

<template>
  <section class="section-padding">
    <v-container style="max-width: 1280px;">
      <!-- Section Header -->
      <div class="section-header">
        <h2 class="section-title">Shop by Category</h2>
        <div class="section-divider" />
        <p class="section-subtitle">
          Explore our wide range of quality farm products across various categories
        </p>
      </div>

      <!-- Category Cards -->
      <v-row class="mt-4">
        <v-col
          v-for="(category, index) in categories"
          :key="category.id"
          cols="6"
          sm="4"
          md="2"
        >
          <div
            class="category-card card-hover"
            :style="{ background: category.gradient, animationDelay: index * 0.1 + 's' }"
            @click="goToCategory(category.id)"
            role="button"
            :aria-label="'Browse ' + category.name"
            tabindex="0"
            @keydown.enter="goToCategory(category.id)"
          >
            <div class="category-icon-wrapper" :style="{ background: category.iconColor + '15' }">
              <v-icon :icon="category.icon" :color="category.iconColor" size="36" />
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
            <span class="category-count">{{ category.count }}</span>
            <v-icon icon="mdi-arrow-right" size="16" class="category-arrow" :color="category.iconColor" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 16px 20px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.04);
  animation: fadeInUp 0.6s ease-out both;
}

.category-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border-radius: var(--radius-md);
  margin-bottom: 14px;
  transition: transform var(--transition-base);
}

.category-card:hover .category-icon-wrapper {
  transform: scale(1.1) rotate(-5deg);
}

.category-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin-bottom: 4px;
}

.category-count {
  font-size: 0.8rem;
  color: var(--color-on-surface-light);
  font-weight: 500;
}

.category-arrow {
  margin-top: 10px;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.category-card:hover .category-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 600px) {
  .category-card {
    padding: 20px 12px 16px;
  }

  .category-icon-wrapper {
    width: 56px;
    height: 56px;
  }
}
</style>
