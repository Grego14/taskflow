import { signal, computed, effect } from '@preact/signals'
import { playSound } from '@services/audio'
import sortTasks from '@utils/tasks/sortTasks'

// *** Tasks ***

// plain tasks (task and subtasks on the same nest level)
export const taskRegistry = signal(new Map())

// ids of tasks without parents (non-subtasks)
export const rootTaskIds = computed(() => {
  const ids = []

  for (const task of taskRegistry.value.values()) {
    if (!task.parentId) ids.push(task.id)
  }
  return ids
})

export const activeDropIndicator = signal({
  sourceId: null,
  targetId: null,
  edge: null
})

export const updateTaskLocal = (id, data) => {
  const currentMap = taskRegistry.value
  const task = currentMap.get(id)

  if (task) {
    const newMap = new Map(currentMap)

    newMap.set(id, { ...task, ...data }) 
    taskRegistry.value = newMap
  }
}

export const deleteTaskLocal = (id, parentId, deleteSubtasks) => {
  const map = taskRegistry.value
  const newMap = new Map(map)

  // delete the main task/subtask
  newMap.delete(id)

  if (!parentId && deleteSubtasks) {
    for (const [taskId, task] of map) {
      if (task.parentId === id) newMap.delete(taskId)
    }
  }

  taskRegistry.value = newMap
}

export const createTaskLocal = (task) => {
  const newMap = new Map(taskRegistry.value)

  if (!task.subtasks) task.subtasks = []
  newMap.set(task.id, task)

  // add the subtasks IDs to the subtasks prop of a task
  const pId = task.parentId
  if (pId && newMap.has(pId)) {
    const parent = { ...newMap.get(pId) }

    const currentSubtasks = (parent.subtasks || [])
      .map(id => newMap.get(id)).filter(Boolean)
    currentSubtasks.push(task)

    parent.subtasks = sortTasks(currentSubtasks).map(t => t.id)
    newMap.set(pId, parent)
  }

  taskRegistry.value = newMap
}

export const archiveTasksLocal = (taskIds) => {
  const newMap = new Map(taskRegistry.value)
  
  for (const id of taskIds) {
    const task = newMap.get(id)
    if (task) newMap.set(id, { ...task, isArchived: true })
  }
  
  taskRegistry.value = newMap
}

export const moveSubtasksLocal = (
  taskId, 
  subtaskIds, 
  position, 
  timestamp
) => {
  const currentMap = taskRegistry.value
  const newMap = new Map(currentMap)

  // delete parent task
  newMap.delete(taskId)

  // promote each subtask
  for (const sId of subtaskIds) {
    const subtask = currentMap.get(sId)

    if (!subtask) continue

    newMap.set(sId, {
      ...subtask,
      status: 'todo',
      parentId: null,
      position,
      createdAt: timestamp,
      updatedAt: timestamp
    })
  }

  taskRegistry.value = newMap
}

export const reorderTaskLocal = (id, newPosition, newStatus) => {
  const currentMap = taskRegistry.value
  const task = currentMap.get(id)

  if(!task) return

  const newMap = new Map(currentMap)
  const updates = { ...task, position: newPosition }

  if (newStatus) {
    const now = Date.now()
    const isDone = newStatus === 'done'
    const isCancelled = newStatus === 'cancelled'

    updates.status = newStatus
    updates.completedDate = isDone ? now : null
    updates.cancelledDate = isCancelled ? now : null
  }

  newMap.set(id, updates)

  const parent = newMap.get(task.parentId)

  if (parent) {
    // get all siblings including the updated one
    const siblings = []

    for (const subId of parent.subtasks) {
      const subtask = newMap.get(subId)
      if (subtask) siblings.push(subtask)
    }

    const sortedIds = sortTasks(siblings).map(t => t.id)

    // update parent with a new array reference to trigger the filteredSubtaskIds
    newMap.set(task.parentId, { ...parent, subtasks: sortedIds })
  }

  taskRegistry.value = newMap
}

// *** Zen mode ***

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
