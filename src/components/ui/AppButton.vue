<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'text'].includes(value)
  },
  block: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  to: {
    type: [String, Object],
    default: null
  },
  size: {
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['click'])
</script>

<template>
  <v-btn
    :class="['app-btn', `btn-${variant}`]"
    :block="block"
    :loading="loading"
    :disabled="disabled"
    :to="to"
    :size="size"
    @click="emit('click', $event)"
    rounded="lg"
    elevation="0"
  >
    <v-icon v-if="icon" :icon="icon" class="mr-2" />
    <slot></slot>
  </v-btn>
</template>

<style scoped>
.app-btn {
  font-family: var(--font-family) !important;
  font-weight: var(--font-weight-semibold) !important;
  letter-spacing: 0.02em;
  text-transform: none !important;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast) !important;
}

.app-btn:not(:disabled):hover {
  transform: translateY(-2px);
}

.app-btn:not(:disabled):active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)) !important;
  color: white !important;
}

.btn-primary:not(:disabled):hover {
  box-shadow: var(--shadow-primary) !important;
}

.btn-secondary {
  background: var(--color-accent) !important;
  color: var(--color-text) !important;
}

.btn-secondary:not(:disabled):hover {
  box-shadow: 0 4px 14px rgba(255, 179, 0, 0.3) !important;
}

.btn-outline {
  background: transparent !important;
  border: 2px solid var(--color-border);
  color: var(--color-text) !important;
}

.btn-outline:not(:disabled):hover {
  border-color: var(--color-primary);
  color: var(--color-primary-dark) !important;
  background: var(--color-primary-50) !important;
}

.btn-text {
  background: transparent !important;
  color: var(--color-text) !important;
}

.btn-text:not(:disabled):hover {
  background: var(--color-surface-hover) !important;
  color: var(--color-primary) !important;
}
</style>
