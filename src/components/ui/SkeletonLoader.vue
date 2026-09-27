<script setup>
defineProps({
  type: {
    type: String,
    default: 'card', // card, text, image, avatar, list-item
  },
  lines: {
    type: Number,
    default: 2,
  },
})
</script>

<template>
  <div class="skeleton-wrapper" aria-hidden="true">
    <!-- Card Skeleton (Image + Text) -->
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-content">
        <div class="skeleton-text skeleton-title"></div>
        <div class="skeleton-text skeleton-subtitle"></div>
        <div class="skeleton-text skeleton-price mt-3"></div>
      </div>
    </div>

    <!-- Image Skeleton -->
    <div v-else-if="type === 'image'" class="skeleton-img skeleton-img-only"></div>

    <!-- Text Lines Skeleton -->
    <div v-else-if="type === 'text'" class="skeleton-text-group">
      <div v-for="n in lines" :key="n" class="skeleton-text" :class="n === lines && lines > 1 ? 'skeleton-text-short' : ''"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-wrapper {
  width: 100%;
}

.skeleton-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 4/3;
  background-color: var(--color-border);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-img-only {
  border-radius: var(--radius-lg);
}

.skeleton-content {
  padding: var(--space-md);
}

.skeleton-text {
  height: 16px;
  background-color: var(--color-border);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-sm);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-title {
  width: 70%;
  height: 20px;
}

.skeleton-subtitle {
  width: 100%;
}

.skeleton-text-short {
  width: 60%;
}

.skeleton-price {
  width: 40%;
  height: 24px;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
</style>
