<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = [
  { id: 'Seeds', name: 'Seeds', icon: 'mdi-seed', color: '#E8F5E9', iconColor: 'var(--color-primary-dark)', count: '45 Products' },
  { id: 'Fertilizers', name: 'Fertilizers', icon: 'mdi-sack', color: '#FFF8E1', iconColor: 'var(--color-warning)', count: '32 Products' },
  { id: 'Pesticides', name: 'Pesticides', icon: 'mdi-spray', color: '#FFEBEE', iconColor: 'var(--color-error)', count: '28 Products' },
  { id: 'Equipment', name: 'Equipment', icon: 'mdi-tools', color: '#E3F2FD', iconColor: 'var(--color-info)', count: '56 Products' },
  { id: 'Animal Feed', name: 'Animal Feed', icon: 'mdi-barley', color: '#FFF3E0', iconColor: '#E65100', count: '24 Products' },
  { id: 'Irrigation', name: 'Irrigation', icon: 'mdi-water', color: '#E0F7FA', iconColor: '#006064', count: '18 Products' }
]

function goToCategory(categoryId) {
  router.push(`/products?category=${categoryId}`)
}
</script>

<template>
  <section class="section-padding bg-surface">
    <v-container>
      <div class="section-header">
        <h2 class="section-title">Shop by Category</h2>
        <p class="section-subtitle">Explore our wide range of premium agricultural products categorized for your convenience.</p>
        <div class="section-divider"></div>
      </div>
      
      <v-row class="mt-8">
        <v-col
          v-for="category in categories"
          :key="category.id"
          cols="6" sm="4" md="2"
        >
          <div class="category-card" @click="goToCategory(category.id)" role="button" tabindex="0">
            <div class="category-icon-wrapper" :style="{ backgroundColor: category.color }">
              <v-icon :icon="category.icon" size="40" :color="category.iconColor" class="category-icon" />
            </div>
            <h3 class="text-h4 font-weight-bold mt-4 mb-1">{{ category.name }}</h3>
            <span class="text-caption text-muted">{{ category.count }}</span>
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
  padding: var(--space-lg) var(--space-sm);
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-base);
  height: 100%;
}

.category-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-light);
}

.category-card:hover .category-icon-wrapper {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.category-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.text-h4 {
  font-size: 1.1rem;
}
</style>
