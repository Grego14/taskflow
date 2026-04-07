import { signal } from '@preact/signals'

export const globalAlert = signal(null)

export const setGlobalAlert = (payload) => {
  if (!payload) {
    globalAlert.value = null
    return
  }

  const { message, status = 'success', open, ...rest } = payload
  
  globalAlert.value = {
    ...rest,
    message,
    status,
    open: open ?? !!message
  }
}

export const closeGlobalAlert = () => {
  if (!globalAlert.value) return 

  globalAlert.value = { ...globalAlert.value, open: false }
}
