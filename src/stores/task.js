import { signal, computed, effect } from '@preact/signals'
import { playSound } from '@services/audio'

// core state signals
export const activeTaskData = signal(null)
export const globalClock = signal(Date.now())
export const showOverlay = signal(false)
export const targetTime = signal(null)
export const pomoStart = signal(null)
export const isAlarmRinging = signal(false)

export const isWorking = computed(() => activeTaskData.value !== null)

setInterval(() => {
  globalClock.value = Date.now()
}, 1000)

/**
 * Reset all pomodoro/goal related signals
 */
export function clearFocusGoals() {
  targetTime.value = null
  pomoStart.value = null
}

effect(() => {
  const now = globalClock.value
  const target = targetTime.value
  const working = isWorking.value
  const ringing = isAlarmRinging.value

  if (!target || ringing || !working) return

  if (now >= target) {
    isAlarmRinging.value = true
    playSound('endSessionGoal', true)
  }
})
