<script setup>
defineProps({
  icon: {
    type: String,
    default: 'mdi-inbox-outline'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: ''
  },
  actionTo: {
    type: [String, Object],
    default: null
  }
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="empty-state text-center pa-8">
    <div class="icon-wrapper mb-4">
      <v-icon :icon="icon" size="64" color="primary-light" />
    </div>
    
    <h3 class="text-h3 mb-2">{{ title }}</h3>
    
    <p v-if="description" class="text-body text-muted mb-6 max-w-sm mx-auto">
      {{ description }}
    </p>
    
    <slot name="action">
      <v-btn
        v-if="actionText"
        :to="actionTo"
        color="primary"
        variant="flat"
        rounded="lg"
        @click="emit('action')"
      >
        {{ actionText }}
      </v-btn>
    </slot>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--color-primary-50);
}

.max-w-sm {
  max-width: 400px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>
