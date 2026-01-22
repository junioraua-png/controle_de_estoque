export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const addToast = (
    message: string,
    type: Toast['type'] = 'info',
    duration: number = 4000
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    const toast: Toast = { id, type, message, duration }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (message: string, duration?: number) => {
    return addToast(message, 'success', duration)
  }

  const error = (message: string, duration?: number) => {
    return addToast(message, 'error', duration)
  }

  const warning = (message: string, duration?: number) => {
    return addToast(message, 'warning', duration)
  }

  const info = (message: string, duration?: number) => {
    return addToast(message, 'info', duration)
  }

  const clear = () => {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clear
  }
}
