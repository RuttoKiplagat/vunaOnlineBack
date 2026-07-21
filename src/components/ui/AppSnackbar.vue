<script setup>
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const iconMap = {
  success: 'mdi-check-circle',
  error: 'mdi-alert-circle',
  warning: 'mdi-alert',
  info: 'mdi-information',
}
</script>

<template>
  <v-snackbar
    v-model="notificationStore.show"
    :color="notificationStore.type"
    :timeout="notificationStore.duration"
    location="top right"
    rounded="lg"
    class="app-snackbar"
  >
    <div class="d-flex align-center">
      <v-icon :icon="iconMap[notificationStore.type]" class="mr-3" />
      <span class="text-body-1">{{ notificationStore.message }}</span>
    </div>
    <template v-slot:actions>
      <v-btn
        variant="text"
        icon="mdi-close"
        size="small"
        @click="notificationStore.close()"
      />
    </template>
  </v-snackbar>
</template>

<style scoped>
.app-snackbar {
  font-family: var(--font-family);
}
</style>
