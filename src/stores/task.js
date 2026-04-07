import { signal, computed, effect } from '@preact/signals'
import { playSound } from '@services/audio'

// core state signals
export const activeTaskData = signal(null)
export const globalClock = signal(Date.now())
export const showOverlay = signal(false)
export const targetTime = signal(null)
export const pomoStart = signal(null)
export const isAlarmRinging = signal(false)
export const showResetPrompt = signal(false)
export const currentMinutes = signal(0)
export const goalReached = signal(false)

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
  goalReached.value = false
}

export const currentSessionSeconds = computed(() => {
  const task = activeTaskData.value

  if (!task) return 0

  const ringing = isAlarmRinging.value
  const target = targetTime.value
  const clock = globalClock.value
  
  const referenceTime = ringing && target ? target : clock
  const startReference = target > 0 ? pomoStart.value : task.startTime

  const elapsed = Math.floor((referenceTime - startReference) / 1000)
  
  // returns this session work (doesn't count task timeWorked value)
  return elapsed >= 0 ? elapsed : 0
})

effect(() => {
  const now = globalClock.value
  const target = targetTime.value
  const working = isWorking.value
  const ringing = isAlarmRinging.value
  const reached = goalReached.value

  if (!target || ringing || !working || reached) return

  if (now >= target) {
    goalReached.value = true
    isAlarmRinging.value = true
    showOverlay.value = true

    playSound('endSessionGoal', true)
  }
})
