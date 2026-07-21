import { useNotificationStore } from '@/stores/notification'

/**
 * Composable for easy toast notifications anywhere in the app.
 * Usage:
 *   const { notify } = useNotification()
 *   notify('Product added to cart!', 'success')
 */
export function useNotification() {
  const store = useNotificationStore()

  function notify(message, type = 'success', duration = 4000) {
    store.notify({ message, type, duration })
  }

  function notifySuccess(message) {
    store.notify({ message, type: 'success' })
  }

  function notifyError(message) {
    store.notify({ message, type: 'error' })
  }

  function notifyWarning(message) {
    store.notify({ message, type: 'warning' })
  }

  return { notify, notifySuccess, notifyError, notifyWarning }
}
