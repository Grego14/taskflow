import { signal, computed, effect } from '@preact/signals'
import { playSound } from '@services/audio'
import sortTasks from '@utils/tasks/sortTasks'

// *** Tasks ***

// plain tasks (task and subtasks on the same nest level)
export const taskRegistry = signal(new Map())

// ids of tasks without parents (non-subtasks)
export const rootTaskIds = computed(() => {
  const ids = []

  for (const taskSignal of taskRegistry.value.values()) {
    if (!taskSignal.peek().parentId) ids.push(taskSignal.peek().id)
  }
  return ids
})

export const activeDropIndicator = signal({
  sourceId: null,
  targetId: null,
  edge: null
})

export const updateTaskLocal = (id, data) => {
  const registry = taskRegistry.peek()
  const taskSignal = registry.get(id)

  if (taskSignal) {
    taskSignal.value = { ...taskSignal.peek(), ...data }
  }
}

export const deleteTaskLocal = (id, parentId, deleteSubtasks) => {
  const map = taskRegistry.value
  const newMap = new Map(map)

  // delete the main task/subtask
  newMap.delete(id)

  if (!parentId && deleteSubtasks) {
    for (const [taskId, tSignal] of map) {
      if (tSignal.peek().parentId === id) newMap.delete(taskId)
    }
  }

  taskRegistry.value = newMap
}

export const createTaskLocal = (task) => {
  const newMap = new Map(taskRegistry.peek())

  const taskData = { ...task, subtasks: task.subtasks || [] }

  newMap.set(task.id, signal(taskData))

  // add the subtasks IDs to the subtasks prop of a task
  const pId = task.parentId
  if (pId && newMap.has(pId)) {
    const parentSignal = newMap.get(pId)
    const parentData = parentSignal.peek()

    const currentSubtasks = (parentData.subtasks || [])
    .map(id => newMap.get(id)?.peek())
    .filter(Boolean)

    currentSubtasks.push(taskData)

    parentSignal.value = {
      ...parentData,
      subtasks: sortTasks(currentSubtasks).map(t => t.id)
    }
  }

  taskRegistry.value = newMap
}

export const archiveTasksLocal = (taskIds) => {
  const registry = taskRegistry.peek()

  for (const id of taskIds) {
    const taskSignal = registry.get(id)
    if (taskSignal) {
      taskSignal.value = { ...taskSignal.peek(), isArchived: true }
    }
  }
}

export const moveSubtasksLocal = (
  taskId, 
  subtaskIds, 
  position, 
  timestamp
) => {
  const currentMap = taskRegistry.peek()
  const newMap = new Map(currentMap)

  // delete parent task
  newMap.delete(taskId)

  // promote each subtask
  for (const sId of subtaskIds) {
    const subtaskSignal = currentMap.get(sId)
    if (!subtaskSignal) continue

    subtaskSignal.value = {
      ...subtaskSignal.peek(),
      status: 'todo',
      parentId: null,
      position,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }

  taskRegistry.value = newMap
}

export const reorderTaskLocal = (id, newPosition, newStatus) => {
  const registry = taskRegistry.peek()
  const taskSignal = registry.get(id)

  if (!taskSignal) return

  const now = Date.now()
  const currentTask = taskSignal.peek()
  
  const updates = { ...currentTask, position: newPosition }

  if (newStatus) {
    updates.status = newStatus
    updates.completedDate = newStatus === 'done' ? now : null
    updates.cancelledDate = newStatus === 'cancelled' ? now : null
  }

  taskSignal.value = updates

  const parentSignal = registry.get(currentTask.parentId)

  if (parentSignal) {
    const parentData = parentSignal.peek()

    // get all siblings including the updated one
    const siblings = parentData.subtasks
    .map(subId => registry.get(subId)?.peek())
    .filter(Boolean)

    // update parent with a new array reference to trigger the filteredSubtaskIds
    parentSignal.value = {
      ...parentData, 
      subtasks: sortTasks(siblings).map(t => t.id) 
    }
  }
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
