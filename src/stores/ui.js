import { signal } from '@preact/signals'
import { getItem } from '@utils/storage'

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

export const tooltipOpen = signal(false)
export const tooltipTitle = signal(null)
export const tooltipIsWarm = signal(false)

// element used to calculate the position
export const tooltipTarget = signal(null)

// custom tooltip props (ex. enterDelay, placement)
export const tooltipProps = signal({})

export const isDrawerOpen = signal(getItem('drawerOpen'))
