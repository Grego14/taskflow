import { useMemo, useRef, useCallback, useEffect } from 'preact/hooks'
import useLayout from '@hooks/useLayout'

import getTaskRef from '@utils/tasks/getTaskRef'
import { playSound } from '@services/audio'

import TasksContext from './context'
import {
  globalClock,
  activeTaskData,
  pomoStart,
  targetTime,
  showOverlay,
  isWorking,
  currentMinutes,
  clearFocusGoals,
  showResetPrompt
} from '@stores/task'

export default function TasksBaseProvider({
  children,
  tasks,
  actions,
  loading,
  error,
  taskRefs // [taskId]: DOMElement
}) {
  const { isPreview } = useLayout()
  const timeout = useRef(null)

  const saveWorkingTime = useCallback(async ({
    id, 
    parent, 
    startTime, 
    initialSeconds, 
    isFocusGuard 
  }) => {
    const now = Date.now()
    const target = targetTime.value
    
    const parentTask = tasks.find(task => task.id === (parent || id))
    const currentTask = !parent 
      ? parentTask 
      : parentTask?.subtasks?.find(sTask => sTask.id === id)
    
    const endTime = target && (now > target) ? target : now
    const sessionDuration = Math.floor((endTime - startTime) / 1000)

    const updateData = { 
      timeWorked: initialSeconds + sessionDuration 
    }

    if (!isFocusGuard) {
      const sessionType = target > 0 ? 'goal' : 'manual'
      const currentSessions = currentTask?.sessions || []

      updateData.sessions = [
        ...currentSessions,
        {
          duration: sessionDuration,
          date: now,
          type: sessionType
        }
      ]
      
      clearFocusGoals()
    }

    await actions.updateTask({ id, subtask: parent, data: updateData })
  }, [tasks, actions])

  const resetSession = useCallback(async () => {
    const taskData = activeTaskData.value

    if (!taskData) return

    const now = Date.now()
    const minutes = currentMinutes.value
    
    const currentTask = tasks
      .find(task => task.id === (taskData.subtask || taskData.id))
    const targetTask = !taskData.subtask 
      ? currentTask 
      : currentTask?.subtasks?.find(sTask => sTask.id === taskData.id)

    // calculate how much time has passed in the current session (since the user
    // hits the play btn)
    const sessionElapsed = Math.floor((now - taskData.startTime) / 1000)
    
    // restore the total time that the Focus Guard added
    const restoredTotal = Math.max(0, (targetTask?.timeWorked || 0) - sessionElapsed)

    activeTaskData.value = {
      ...taskData,
      startTime: now,
      initialSeconds: restoredTotal
    }

    pomoStart.value = now
    targetTime.value = now + (minutes * 60 * 1000)
    showResetPrompt.value = false

    await actions.updateTask({
      id: taskData.id,
      subtask: taskData.subtask,
      data: { timeWorked: restoredTotal }
    })
  }, [tasks, actions])

  const toggleWorkingTask = useCallback((taskData = null) => {
    const dataValue = activeTaskData.value

    // if there's an active task, we save it (the user stops working or switches to
    // another task while already having an active task)
    if (dataValue) {
      const { id, subtask, startTime, initialSeconds } = dataValue

      saveWorkingTime({
        id,
        parent: subtask,
        startTime,
        initialSeconds
      })

      // if there's no new task (taskData.id is null) or is the same task,
      // reset and close
      if (!taskData?.id || dataValue.id === taskData.id) {
        showOverlay.value = false
        activeTaskData.value = null
        return
      }
    }

    // activate work mode to a new task
    if (taskData?.id) {
      const { id, title, priority, subtask, timeWorked } = taskData
      let parentTitle = null

      showOverlay.value = true
      const now = Date.now()

      // get the parent task title if the task is a subtask
      if (subtask) {
        for (const task of tasks) {
          if (task.id === subtask) {
            parentTitle = task.title
            break
          }
        }
      }

      activeTaskData.value = {
        id,
        title,
        priority,
        subtask,
        parentTitle,
        startTime: now,
        initialSeconds: timeWorked || 0
      }
    }
  }, [saveWorkingTime, tasks])

  const scrollIntoTask = useCallback((taskId) => {
    const element = getTaskRef(taskRefs, taskId)

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })

      clearTimeout(timeout.current)
      element.setAttribute('data-focused', true)
      timeout.current = setTimeout(() => {
        element.removeAttribute('data-focused')
      }, 1500)
    }
  }, [])

  const value = useMemo(() => ({
    tasks,
    actions: { 
      ...actions, 
      saveWorkingTime,
      resetSession
    },
    loading: !isPreview ? loading : false,
    error: !isPreview ? error : null,
    taskRefs,
    scrollIntoTask,
    toggleWorkingTask
  }), [
      tasks, 
      actions, 
      loading, 
      error, 
      scrollIntoTask, 
      toggleWorkingTask, 
      saveWorkingTime
    ])

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  )
}
