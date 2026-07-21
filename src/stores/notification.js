import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const show = ref(false)
  const message = ref('')
  const type = ref('success') // success | error | warning | info
  const duration = ref(4000)

  let timeout = null

  function notify({ message: msg, type: t = 'success', duration: d = 4000 }) {
    // Clear any existing timeout
    if (timeout) clearTimeout(timeout)

    message.value = msg
    type.value = t
    duration.value = d
    show.value = true

    timeout = setTimeout(() => {
      show.value = false
    }, d)
  }

  function close() {
    show.value = false
    if (timeout) clearTimeout(timeout)
  }

  return { show, message, type, duration, notify, close }
})
