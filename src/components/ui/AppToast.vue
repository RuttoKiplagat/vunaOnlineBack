<script setup>
import { useNotification } from '@/composables/useNotification'

const { toasts, removeToast } = useNotification()

const getIcon = (type) => {
  switch (type) {
    case 'success': return 'mdi-check-circle'
    case 'error': return 'mdi-alert-circle'
    case 'warning': return 'mdi-alert'
    case 'info':
    default: return 'mdi-information'
  }
}

const getColor = (type) => {
  switch (type) {
    case 'success': return 'var(--color-success)'
    case 'error': return 'var(--color-error)'
    case 'warning': return 'var(--color-warning)'
    case 'info':
    default: return 'var(--color-info)'
  }
}
</script>

<template>
  <div class="toast-container" role="region" aria-live="polite">
    <TransitionGroup name="toast-list">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="toast-item shadow-lg"
        :style="{ borderLeftColor: getColor(toast.type) }"
        role="alert"
      >
        <v-icon :icon="getIcon(toast.type)" :color="getColor(toast.type)" class="mr-3" />
        <span class="toast-message text-body">{{ toast.message }}</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          density="comfortable"
          class="ml-3 toast-close"
          @click="removeToast(toast.id)"
          aria-label="Close notification"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  min-width: 300px;
  max-width: 450px;
  border-left: 4px solid;
  pointer-events: auto;
  box-shadow: var(--shadow-lg);
}

.toast-message {
  flex: 1;
  color: var(--color-text);
  font-weight: var(--font-weight-medium);
}

.toast-close {
  color: var(--color-text-muted) !important;
}

/* Transitions */
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all var(--transition-base);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}

@media (max-width: 600px) {
  .toast-container {
    bottom: 16px;
    right: 16px;
    left: 16px;
  }
  
  .toast-item {
    min-width: 100%;
  }
}
</style>
